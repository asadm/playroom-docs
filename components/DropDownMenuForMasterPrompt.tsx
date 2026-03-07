import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DropDownMenuProps {
    text: string
    style?: React.CSSProperties
}

export default function DropDownMenuForMasterPrompt({text, style}: DropDownMenuProps) {
  const encodedText = encodeURI(text);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open in...</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <a href={`https://lovable.dev/?autosubmit=true#prompt=${encodedText}`} target="_blank">
            <DropdownMenuItem>
                <img src="/images/logos/lovable-logo.png" className="w-4" alt="Lovable logo" />
            Open in Lovable
            </DropdownMenuItem>
        </a>
        <a href={`https://chat.openai.com/?q=${encodedText}`} target="_blank">
            <DropdownMenuItem>
                <img src="/images/logos/openai-logo.svg" className="w-4 dark:brightness-0 dark:invert" alt="ChatGPT logo" />
            Open in ChatGPT
            </DropdownMenuItem>
        </a>
        <a href={`https://claude.ai/new?q=${encodedText}`} target="_blank">
            <DropdownMenuItem>
                <img src="/images/logos/claude-logo.svg" className="w-4 dark:brightness-0 dark:invert" alt="Claude logo" />
            Open in Claude
            </DropdownMenuItem>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
