import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Bold, Italic, Underline, Strikethrough, Palette,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon,
} from "lucide-react";

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#EA4335" },
  { name: "Blue", value: "#4285F4" },
  { name: "Green", value: "#34A853" },
  { name: "Orange", value: "#FF6D01" },
];

interface EditorToolbarProps {
  onCommand: (cmd: string, value?: string) => void;
  onFontColor: (color: string) => void;
  onInsertImage: (file: File) => void;
  currentColor: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onCommand, onFontColor, onInsertImage, currentColor,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onInsertImage(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const ToolBtn = ({ icon: Icon, cmd, title }: { icon: React.ElementType; cmd: string; title: string }) => (
    <Button variant="ghost" size="icon" className="h-8 w-8" title={title} onMouseDown={(e) => { e.preventDefault(); onCommand(cmd); }}>
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex items-center justify-center px-4 py-2">
      <div className="flex items-center gap-0.5 bg-card border border-border rounded-full px-3 py-1 shadow-sm">
        <ToolBtn icon={Bold} cmd="bold" title="Bold" />
        <ToolBtn icon={Italic} cmd="italic" title="Italic" />
        <ToolBtn icon={Underline} cmd="underline" title="Underline" />
        <ToolBtn icon={Strikethrough} cmd="strikeThrough" title="Strikethrough" />

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Font Color">
              <Palette className="h-4 w-4" style={{ color: currentColor }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-1">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  className="w-7 h-7 rounded-full border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  onMouseDown={(e) => { e.preventDefault(); onFontColor(c.value); }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolBtn icon={AlignLeft} cmd="justifyLeft" title="Align Left" />
        <ToolBtn icon={AlignCenter} cmd="justifyCenter" title="Align Center" />
        <ToolBtn icon={AlignRight} cmd="justifyRight" title="Align Right" />
        <ToolBtn icon={AlignJustify} cmd="justifyFull" title="Justify" />

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert Image" onClick={() => fileRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default EditorToolbar;
