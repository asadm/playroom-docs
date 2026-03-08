/*
  generate-sdk-docs.ts
  Parses a TypeScript "dummy SDK" file (JSDoc-annotated, no real implementation)
  and generates one MDX page per exported function/interface/type under pages/.

  Adapted for Nextra (markdown tables, _meta.js for navigation).

  Usage:
    npx tsx lib/generate-sdk-docs.ts --entrypoint data/dummy-api-full.ts \
      --output pages/api-reference/js --ignore-root-namespace
*/

import ts from "typescript";
import * as tsdoc from "@microsoft/tsdoc";
import { TSDocParser } from "@microsoft/tsdoc";
import * as fs from "fs";
import * as path from "path";

const DEFAULT_JS_ENTRYPOINT = path.resolve(__dirname, "../data/dummy-api-full.ts");
const DEFAULT_JS_OUTPUT = path.resolve(__dirname, "../pages/api-reference/js");

const tsdocParser: TSDocParser = new TSDocParser();

// ─── Filesystem helpers ───────────────────────────────────────────────────────

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function writeFile(filePath: string, content: string) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimEnd() + "\n", "utf8");
}

// ─── TSDoc rendering ──────────────────────────────────────────────────────────

export function renderDocNode(node: tsdoc.DocNode): string {
  switch (node.kind) {
    case "CodeSpan":
      return `\`${(node as tsdoc.DocCodeSpan).code}\``;
    case "FencedCode": {
      const fc = node as tsdoc.DocFencedCode;
      return `\`\`\`${fc.language || "ts"}\n${fc.code}\n\`\`\``;
    }
    case "LinkTag": {
      const n = node as tsdoc.DocLinkTag;
      if (n.urlDestination)
        return `[${n.linkText || n.urlDestination}](${n.urlDestination})`;
      let identifier = "";
      if (n.codeDestination) {
        const refs = n.codeDestination.memberReferences;
        if (refs.length > 0) {
          const last = refs[refs.length - 1].memberIdentifier;
          if (last) identifier = last.identifier;
        }
      }
      return `\`${n.linkText || identifier || "link"}\``;
    }
    case "Paragraph":
      return renderContainer(node as tsdoc.DocParagraph).trim() + "\n\n";
    case "PlainText":
      return (node as tsdoc.DocPlainText).text;
    case "SoftBreak":
      return " ";
    case "EscapedText":
      return (node as tsdoc.DocEscapedText).decodedText;
    case "ErrorText":
      return (node as tsdoc.DocErrorText).text;
    default:
      return renderContainer(node);
  }
}

export function renderContainer(
  container: { getChildNodes(): readonly tsdoc.DocNode[] } | null
): string {
  if (!container) return "";
  return container
    .getChildNodes()
    .map((child) => renderDocNode(child))
    .join("");
}

// ─── TSDoc extraction ─────────────────────────────────────────────────────────

type ParsedDoc = {
  summary: string;
  remarks: string;
  params: { name: string; text: string }[];
  returns: string;
  examples: string[];
};

export function parseTsDoc(node: ts.Node): ParsedDoc {
  const text = node.getFullText();
  const ranges = ts.getLeadingCommentRanges(text, 0) || [];
  for (const range of ranges) {
    const raw = text.substring(range.pos, range.end);
    if (!raw.startsWith("/**")) continue;
    const parsed = tsdocParser.parseString(raw);
    const doc = parsed.docComment;
    const summary = renderContainer(doc.summarySection).trim();
    const params = doc.params.blocks.map((b) => ({
      name: b.parameterName,
      text: renderContainer(b.content).trim(),
    }));
    const remarks = doc.remarksBlock
      ? renderContainer(doc.remarksBlock.content).trim()
      : "";
    const returns = doc.returnsBlock
      ? renderContainer(doc.returnsBlock.content).trim()
      : "";
    const exampleBlocks = doc.customBlocks.filter(
      (x) =>
        x.blockTag.tagNameWithUpperCase ===
        tsdoc.StandardTags.example.tagNameWithUpperCase
    );
    const examples = exampleBlocks.map((b) =>
      renderContainer(b.content).trim()
    );
    return { summary, remarks, params, returns, examples };
  }
  return { summary: "", remarks: "", params: [], returns: "", examples: [] };
}

// ─── Type helpers ─────────────────────────────────────────────────────────────

export function getTypeName(
  checker: ts.TypeChecker,
  node: ts.Node | undefined
): string | null {
  if (!node) return null;
  try {
    return checker.typeToString(checker.getTypeAtLocation(node));
  } catch {
    return null;
  }
}

// ─── Markdown rendering ───────────────────────────────────────────────────────

type TableRow = {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
};

export function markdownTable(rows: TableRow[]): string {
  if (rows.length === 0) return "_None_";
  const lines = rows.map((r) => {
    const name = r.optional ? `\`${r.name}?\`` : `\`${r.name}\``;
    const type = `\`${r.type}\``;
    const desc = r.description || "_No description._";
    return `| ${name} | ${type} | ${desc} |`;
  });
  return [
    "| Name | Type | Description |",
    "|------|------|-------------|",
    ...lines,
  ].join("\n");
}

// ─── MDX builders ─────────────────────────────────────────────────────────────

function autoGenComment(entrypointHint: string, command: string): string {
  return `{/* AUTO-GENERATED FILE. DO NOT EDIT. */}\n{/* Edit \`${entrypointHint}\` and run \`${command}\` to regenerate. */}`;
}

export function mdxForFunction(
  name: string,
  signature: string,
  doc: ParsedDoc,
  params: TableRow[],
  entrypointHint: string,
  command: string
): string {
  const description = doc.summary || "_No description._";

  const paramSection =
    params.length > 0
      ? `## Parameters\n\n${markdownTable(params)}\n`
      : "";

  const returnType = signature.includes("): ")
    ? signature.split("): ").slice(1).join("): ").trim()
    : "";

  const returnSection =
    returnType && returnType !== "void"
      ? `## Returns\n\n\`${returnType}\`\n`
      : "";

  const remarksSection = doc.remarks ? `${doc.remarks}\n\n` : "";

  const exampleSection =
    doc.examples.length > 0
      ? "## Usage\n\n" +
        doc.examples
          .map((ex, i) =>
            doc.examples.length === 1 ? ex : `**Example ${i + 1}**\n\n${ex}`
          )
          .join("\n\n")
      : "";

  return `---
title: ${name}
description: "${description.replace(/"/g, '\\"').replace(/\n/g, " ")}"
---

${autoGenComment(entrypointHint, command)}

# ${name}

${remarksSection}## Signature

\`\`\`ts
${signature}
\`\`\`

${paramSection}
${returnSection}
${exampleSection}`.trimEnd();
}

export function mdxForType(
  name: string,
  doc: ParsedDoc,
  properties: TableRow[],
  entrypointHint: string,
  command: string
): string {
  const description = doc.summary || "_No description._";

  const propsSection =
    properties.length > 0
      ? `## Properties\n\n${markdownTable(properties)}\n`
      : "";

  const remarksSection = doc.remarks ? `${doc.remarks}\n\n` : "";

  const exampleSection =
    doc.examples.length > 0
      ? "## Usage\n\n" +
        doc.examples
          .map((ex, i) =>
            doc.examples.length === 1 ? ex : `**Example ${i + 1}**\n\n${ex}`
          )
          .join("\n\n")
      : "";

  return `---
title: ${name}
description: "${description.replace(/"/g, '\\"').replace(/\n/g, " ")}"
---

${autoGenComment(entrypointHint, command)}

# ${name}

${remarksSection}${propsSection}
${exampleSection}`.trimEnd();
}

export function mdxForIndex(
  title: string,
  description: string,
  entrypointHint: string,
  command: string
): string {
  return `---
title: ${title}
description: "${description.replace(/"/g, '\\"')}"
---

${autoGenComment(entrypointHint, command)}

${description}`.trimEnd();
}

// ─── _meta.js writer ──────────────────────────────────────────────────────────

export function writeMetaFile(
  dir: string,
  entries: { key: string; title: string }[]
) {
  const body = entries
    .map((e) => `  "${e.key}": "${e.title}",`)
    .join("\n");
  const content = `export default {\n${body}\n};\n`;
  writeFile(path.join(dir, "_meta.js"), content);
}

// ─── Interface property extraction ───────────────────────────────────────────

export function parseInterfaceProperties(
  checker: ts.TypeChecker,
  node: ts.Node
): TableRow[] {
  const props: TableRow[] = [];

  if (ts.isInterfaceDeclaration(node)) {
    node.members.forEach((member) => {
      if (ts.isPropertySignature(member)) {
        const name = member.name?.getText() || "";
        const type =
          getTypeName(checker, member.type as ts.Node) ||
          (member.type ? member.type.getText() : "any");
        const optional = member.questionToken !== undefined;
        const memberDoc = parseTsDoc(member);
        props.push({ name, type, description: memberDoc.summary, optional });
      } else if (ts.isMethodSignature(member)) {
        const name = member.name?.getText() || "";
        const type = getTypeName(checker, member) || "function";
        const memberDoc = parseTsDoc(member);
        props.push({ name, type, description: memberDoc.summary, optional: false });
      }
    });
  }
  return props;
}

// ─── AST walker ───────────────────────────────────────────────────────────────

type ProcessOptions = {
  checker: ts.TypeChecker;
  outputDir: string;
  ignoreRootNamespace: boolean;
  entrypointHint: string;
  command: string;
  excludeNames: Set<string>;
};

type FolderState = {
  metaEntries: { key: string; title: string }[];
};

const folderStates = new Map<string, FolderState>();

function getFolderState(dir: string): FolderState {
  if (!folderStates.has(dir)) folderStates.set(dir, { metaEntries: [] });
  return folderStates.get(dir)!;
}

export function processNode(
  opts: ProcessOptions,
  node: ts.Node,
  fsParts: string[] = [],
  depth: number = 0
) {
  const { checker, outputDir, ignoreRootNamespace, entrypointHint, command } = opts;
  const nameNode = (node as any).name;
  const name: string | undefined = nameNode
    ? nameNode.getText
      ? nameNode.getText()
      : String(nameNode)
    : undefined;

  // ── Namespace / Module ────────────────────────────────────────────────────
  if (ts.isModuleDeclaration(node) && name) {
    const doc = parseTsDoc(node);
    const isRoot = depth === 0;
    const newFs = isRoot && ignoreRootNamespace ? [...fsParts] : [...fsParts, name];

    if (!isRoot || !ignoreRootNamespace) {
      const dir = path.join(outputDir, ...newFs);
      ensureDir(dir);
      // Write namespace page as parent/RPC.mdx (not RPC/index.mdx) so sidebar shows one "RPC" that opens this page, with children underneath
      const parentDir = newFs.length > 1 ? path.join(outputDir, ...newFs.slice(0, -1)) : outputDir;
      const indexFile = path.join(parentDir, `${name}.mdx`);
      writeFile(
        indexFile,
        mdxForIndex(name, doc.summary || `${name} API reference.`, entrypointHint, command)
      );
      // Register in parent folder's _meta
      if (newFs.length > 0) {
        const parentMetaDir = path.join(outputDir, ...newFs.slice(0, -1));
        getFolderState(parentMetaDir).metaEntries.push({ key: name, title: name });
      }
    }

    const recurse = (child: ts.Node) =>
      processNode(opts, child, newFs, depth + 1);

    if (node.body) {
      if (ts.isModuleBlock(node.body)) {
        node.body.forEachChild(recurse);
      } else if (ts.isModuleDeclaration(node.body)) {
        processNode(opts, node.body, newFs, depth + 1);
      }
    }
    return;
  }

  // ── Function ──────────────────────────────────────────────────────────────
  if (ts.isFunctionDeclaration(node) && name) {
    if (opts.excludeNames.has(name)) return;
    const doc = parseTsDoc(node);
    const sig = checker.signatureToString(
      checker.getSignatureFromDeclaration(node)!
    );

    const params: TableRow[] = node.parameters.map((param) => {
      const pname = param.name.getText();
      const ptype =
        getTypeName(checker, param) ||
        (param.type ? param.type.getText() : "unknown");
      const optional = param.questionToken !== undefined || param.initializer !== undefined;
      const docMatch = doc.params.find((p) => p.name === pname);
      return { name: pname, type: ptype, description: docMatch?.text || "", optional };
    });

    const dir = path.join(outputDir, ...fsParts);
    const filePath = path.join(dir, `${name}.mdx`);
    writeFile(filePath, mdxForFunction(name, `function ${name}${sig}`, doc, params, entrypointHint, command));
    getFolderState(dir).metaEntries.push({ key: name, title: `${name}()` });
    return;
  }

  // ── Interface ─────────────────────────────────────────────────────────────
  if (ts.isInterfaceDeclaration(node) && name) {
    if (opts.excludeNames.has(name)) return;
    const doc = parseTsDoc(node);
    const properties = parseInterfaceProperties(checker, node);
    const dir = path.join(outputDir, ...fsParts);
    const filePath = path.join(dir, `${name}.mdx`);
    writeFile(filePath, mdxForType(name, doc, properties, entrypointHint, command));
    getFolderState(dir).metaEntries.push({ key: name, title: name });
    return;
  }

  // ── Type alias ────────────────────────────────────────────────────────────
  if (ts.isTypeAliasDeclaration(node) && name) {
    if (opts.excludeNames.has(name)) return;
    const doc = parseTsDoc(node);
    const dir = path.join(outputDir, ...fsParts);
    const filePath = path.join(dir, `${name}.mdx`);
    writeFile(filePath, mdxForType(name, doc, [], entrypointHint, command));
    getFolderState(dir).metaEntries.push({ key: name, title: name });
    return;
  }

  // ── Enum (skip - just document as part of parent) ─────────────────────────
  if (ts.isEnumDeclaration(node)) {
    return;
  }

  // ── Recurse for other nodes ───────────────────────────────────────────────
  node.forEachChild((child) => processNode(opts, child, fsParts, depth));
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export function generateSDKDocs(
  entrypoint: string = DEFAULT_JS_ENTRYPOINT,
  outputDir: string = DEFAULT_JS_OUTPUT,
  ignoreRootNamespace: boolean = false,
  entrypointHint: string = "data/dummy-api-full.ts",
  command: string = "npm run generate:js-docs",
  excludeNames: string[] = []
) {
  // Clear folder state for this run
  folderStates.clear();

  const program = ts.createProgram([entrypoint], {
    strict: false,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();

  const source = program.getSourceFile(entrypoint);
  if (!source) {
    console.error("❌ Could not load entrypoint:", entrypoint);
    process.exit(1);
  }

  ensureDir(outputDir);

  const opts: ProcessOptions = {
    checker,
    outputDir,
    ignoreRootNamespace,
    entrypointHint,
    command,
    excludeNames: new Set(excludeNames),
  };

  source.forEachChild((node) => processNode(opts, node, [], 0));

  // Write all _meta.js files
  Array.from(folderStates.entries()).forEach(([dir, state]) => {
    if (state.metaEntries.length > 0) {
      writeMetaFile(dir, state.metaEntries);
    }
  });

  // Also write _meta.js for the root output dir if it has entries (prepend index for /js and /react landing)
  const rootState = getFolderState(outputDir);
  if (rootState.metaEntries.length > 0) {
    const rootMeta = rootState.metaEntries;
    writeMetaFile(outputDir, rootMeta);
  }

  console.log(`✅ SDK docs generated from ${entrypoint} → ${outputDir}`);
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);
  let entrypoint = DEFAULT_JS_ENTRYPOINT;
  let outputDir = DEFAULT_JS_OUTPUT;
  let ignoreRootNamespace = false;
  let entrypointHint = "data/dummy-api-full.ts";
  let command = "npm run generate:js-docs";
  const excludeNames: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--entrypoint" || args[i] === "-e") {
      entrypoint = args[++i];
      entrypointHint = args[i];
    } else if (args[i] === "--output" || args[i] === "-o") {
      outputDir = args[++i];
    } else if (args[i] === "--ignore-root-namespace") {
      ignoreRootNamespace = true;
    } else if (args[i] === "--hint") {
      entrypointHint = args[++i];
    } else if (args[i] === "--command") {
      command = args[++i];
    } else if (args[i] === "--exclude") {
      const val = args[++i] || "";
      excludeNames.push(...val.split(",").map((s) => s.trim()).filter(Boolean));
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log(`
Usage: tsx lib/generate-sdk-docs.ts [options]

Options:
  -e, --entrypoint <path>     TypeScript source file to process
  -o, --output <path>         Output directory for generated MDX files
  --ignore-root-namespace     Skip root namespace folder, place files directly in output dir
  --hint <string>             Hint shown in "edit this file" comment
  --command <string>          Command shown in "run this command" comment
  --exclude <names>           Comma-separated names to exclude (no docs generated)
  -h, --help                  Show this help message
      `);
      process.exit(0);
    }
  }

  if (!path.isAbsolute(entrypoint))
    entrypoint = path.resolve(process.cwd(), entrypoint);
  if (!path.isAbsolute(outputDir))
    outputDir = path.resolve(process.cwd(), outputDir);

  generateSDKDocs(entrypoint, outputDir, ignoreRootNamespace, entrypointHint, command, excludeNames);
}
