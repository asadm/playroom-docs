import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button"

export default function CopyMasterPromptButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
    }

    return (
        <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
        </Button>
    );
}