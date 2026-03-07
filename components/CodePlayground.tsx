"use client";

import MonacoEditor from "@monaco-editor/react";
import { FileTree } from "nextra/components";
import { useEffect, useState } from "react";

const ROOM_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Stable placeholder so server and client render the same iframe src (avoids hydration mismatch). */
const HYDRATION_ROOM_CODE = "0000";

function generateRoomCode(): string {
  const alphabet = ROOM_CODE_ALPHABET;
  let code = "";
  const randomSource =
    typeof crypto !== "undefined" && crypto.getRandomValues
      ? () => {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return buf[0]! / (0xffffffff + 1);
      }
      : () => Math.random();
  for (let i = 0; i < 4; i++) {
    code += alphabet[Math.floor(randomSource() * alphabet.length)];
  }
  return code;
}

function withRoomCode(url: string, code: string): string {
  return `${url}#r=R${code}`;
}

export type CodePlaygroundFile = {
  name: string;
  language: string;
  code: string;
};

export type CodePlaygroundProps = {
  files: CodePlaygroundFile[];
  height?: string;
  readOnly?: boolean;
  previewUrls?: [string] | [string, string];
};

type TreeItem = {
  type: "file" | "folder";
  name: string;
  path: string;
  fileIndex?: number;
  children?: TreeItem[];
};

function buildTree(files: CodePlaygroundFile[]): TreeItem[] {
  const tree: TreeItem[] = [];
  const folderMap = new Map<string, TreeItem>();

  // Process shallow paths first so parent folders exist before we add nested files
  const sorted = [...files].sort(
    (a, b) => a.name.split("/").length - b.name.split("/").length
  );

  sorted.forEach((file, index) => {
    const originalIndex = files.indexOf(file);
    const parts = file.name.split("/");

    if (parts.length === 1) {
      // Root level file
      tree.push({
        type: "file",
        name: file.name,
        path: file.name,
        fileIndex: originalIndex,
      });
      return;
    }

    // Ensure each folder in the path exists
    let currentPath = "";
    for (let i = 0; i < parts.length - 1; i++) {
      const folderName = parts[i];
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

      if (!folderMap.has(currentPath)) {
        const folder: TreeItem = {
          type: "folder",
          name: folderName,
          path: currentPath,
          children: [],
        };
        folderMap.set(currentPath, folder);

        if (parentPath) {
          folderMap.get(parentPath)?.children?.push(folder);
        } else {
          tree.push(folder);
        }
      }
    }

    // Add file to its parent folder using explicit parent path from file name
    const fileName = parts[parts.length - 1];
    const fileParentPath = parts.slice(0, -1).join("/");
    const parentFolder = folderMap.get(fileParentPath);
    parentFolder?.children?.push({
      type: "file",
      name: fileName,
      path: file.name,
      fileIndex: originalIndex,
    });
  });

  return tree;
}

function renderFileTree(
  tree: TreeItem[],
  activeIndex: number,
  onSelect: (index: number) => void
) {
  return tree.map((item) => {
    if (item.type === "folder") {
      return (
        <FileTree.Folder key={item.path} name={item.name} defaultOpen>
          {item.children?.length
            ? renderFileTree(item.children, activeIndex, onSelect)
            : null}
        </FileTree.Folder>
      );
    }
    const isActive = item.fileIndex === activeIndex;
    return (
      <FileTree.File
        key={item.path}
        name={item.name}
        active={isActive}
        label={
          <button
            type="button"
            onClick={() => onSelect(item.fileIndex!)}
            className="cursor-pointer text-left hover:opacity-80"
          >
            {item.name}
          </button>
        }
      />
    );
  });
}

export default function CodePlayground({
  files,
  height = "600px",
  readOnly = true,
  previewUrls,
}: CodePlaygroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFile = files[activeIndex] ?? files[0];
  const tree = buildTree(files);

  const [urlsWithRoom, setUrlsWithRoom] = useState<
    [string] | [string, string] | undefined
  >(() => {
    if (!previewUrls) return undefined;
    return previewUrls.map((url) =>
      withRoomCode(url, HYDRATION_ROOM_CODE)
    ) as [string] | [string, string];
  });

  useEffect(() => {
    if (!previewUrls) return;
    const code = generateRoomCode();
    setUrlsWithRoom(
      previewUrls.map((url) => withRoomCode(url, code)) as
      | [string]
      | [string, string]
    );
  }, [previewUrls]);

  if (!files?.length) return null;

  return (
    <div
      className="grid gap-0 overflow-hidden rounded-lg border border-neutral-700 my-5"
      style={{
        height,
        gridTemplateColumns: urlsWithRoom ? "200px 1fr 420px" : "200px 1fr",
      }}
    >
      {/* Sidebar */}
      <div className="bg-[#1E1E1E] overflow-y-auto p-2">
        <FileTree>{renderFileTree(tree, activeIndex, setActiveIndex)}</FileTree>
      </div>

      {/* Editor */}
      <div className="flex flex-col bg-[#1E1E1E]">
        <div className="border-b border-neutral-700 p-2 text-sm">
          {activeFile.name.split("/").pop()}
        </div>
        <div className="flex-1">
          <MonacoEditor
            width='100%'
            height="100%"
            language={activeFile.language}
            value={activeFile.code}
            theme="vs-dark"
            options={{
              readOnly,

              // disable interactions
              contextmenu: false,
              hover: { enabled: false },
              links: false,

              // disable features
              quickSuggestions: false,
              suggestOnTriggerCharacters: false,
              parameterHints: { enabled: false },
              wordBasedSuggestions: "off",
              renderValidationDecorations: "off",

              // Clean UI
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 11,
              occurrencesHighlight: "off",
              selectionHighlight: false,
              codeLens: false,
              folding: false,
            }}
          />
        </div>
      </div>

      {/* Previews */}
      {urlsWithRoom && (
        <div
          className="flex flex-col gap-2"
          data-room-code={urlsWithRoom[0]?.match(/#r=R(.+)$/)?.[1] ?? ""}
        >
          {urlsWithRoom.map((url, i) => (
            <div key={i} className="flex-1 overflow-hidden rounded bg-white">
              <iframe
                src={url}
                title={`Preview ${i + 1}`}
                className="h-full w-full"
                sandbox="allow-scripts allow-forms allow-same-origin"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
