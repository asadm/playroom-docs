"use client";

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PromptStepCopyButtonProps {
  text: string;
  counter: number;
}

export function PromptStepCopyButton({ text, counter }: PromptStepCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleClick = async () => {
    await navigator.clipboard?.writeText(text)
    setIsCopied(true)
    toast.success("Prompt has been copied to your clipboard", {
        description: `You can now vibe-code "Step ${counter}".`,
    })
  }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    onClick={handleClick}
                    className={isCopied ? "text-white bg-green-600 hover:bg-green-600" : ""}
                >
                    {isCopied ? (
                        <>
                        <Check />
                        Copied
                        </>
                    ) : (
                        <>
                        <Copy />
                        Copy Prompt
                        </>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent className="z-50 max-w-sm">
                <span className="opacity-50 tracking-wide uppercase">✨ Prompt for this step</span>
                <pre className="mt-1 px-2 py-2 bg-muted rounded-md text-white wrap-break-word whitespace-pre-wrap">{text}</pre>
            </TooltipContent>
        </Tooltip>
    )
}
