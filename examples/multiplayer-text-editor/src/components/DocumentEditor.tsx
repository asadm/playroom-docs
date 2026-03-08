import React, { useRef, useCallback, useEffect, useState } from "react";
import { useMultiplayerState } from "playroomkit";
import EditorToolbar from "./EditorToolbar";

const DocumentEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [docContent, setDocContent] = useMultiplayerState("doc", "");

  const [currentColor, setCurrentColor] = useState("#000000");
  const isRemoteUpdate = useRef(false);
  const pendingLocalChanges = useRef(0);
  const syncTimer = useRef<ReturnType<typeof setTimeout>>();

  // Sync incoming content (remote only)
  useEffect(() => {
    if (!editorRef.current || !docContent) return;
    if (pendingLocalChanges.current > 0) {
      pendingLocalChanges.current--;
      return;
    }
    if (isRemoteUpdate.current) return;

    const currentHtml = editorRef.current.innerHTML;
    if (currentHtml !== docContent) {
      isRemoteUpdate.current = true;
      editorRef.current.innerHTML = docContent as string;
      isRemoteUpdate.current = false;
    }
  }, [docContent]);

  const throttledSync = useCallback(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      if (editorRef.current) {
        pendingLocalChanges.current++;
        setDocContent(editorRef.current.innerHTML);
      }
    }, 300);
  }, [setDocContent]);

  const handleInput = useCallback(() => {
    throttledSync();
  }, [throttledSync]);

  const execCommand = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    throttledSync();
  }, [throttledSync]);

  const handleFontColor = useCallback((color: string) => {
    setCurrentColor(color);
    document.execCommand("foreColor", false, color);
    if (editorRef.current) {
      editorRef.current.style.caretColor = color;
    }
    throttledSync();
  }, [throttledSync]);

  const handleInsertImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      const img = `<img src="${reader.result}" style="max-width:100%;height:auto;" />`;
      document.execCommand("insertHTML", false, img);
      throttledSync();
    };
    reader.readAsDataURL(file);
  }, [throttledSync]);

  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      window.open((target as HTMLAnchorElement).href, "_blank");
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <EditorToolbar
        onCommand={execCommand}
        onFontColor={handleFontColor}
        onInsertImage={handleInsertImage}
        currentColor={currentColor}
      />
      <div className="flex-1 overflow-auto bg-muted flex justify-center py-8 px-4">
        <div className="relative w-full max-w-[816px]">
          <div
            ref={editorRef}
            className="doc-paper"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onClick={handleEditorClick}
            style={{ caretColor: currentColor, fontSize: "24px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
