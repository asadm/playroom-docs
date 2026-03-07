import React, { useEffect, useState } from "react";
import { insertCoin } from "playroomkit";
import EditorHeader from "@/components/EditorHeader";
import DocumentEditor from "@/components/DocumentEditor";

const Index: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    insertCoin({ skipLobby: true }).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorHeader />
      <DocumentEditor />
    </div>
  );
};

export default Index;
