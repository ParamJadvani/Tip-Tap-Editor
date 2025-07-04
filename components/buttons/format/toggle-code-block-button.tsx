// toolbar/ToggleCodeBlockButton.tsx
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button'; // Adjust path as needed
import { CustomToolTip } from '@/components/ui/tooltip'; // Adjust path as needed
import { Code } from 'lucide-react';

interface ToggleCodeBlockButtonProps {
    editor: Editor;
}

export const ToggleCodeBlockButton = ({ editor }: ToggleCodeBlockButtonProps) => {
    return (
        <CustomToolTip content="Toggle code block">
            <Button
                size="icon"
                variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
                aria-label="Insert code block"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
                <Code size={18} />
            </Button>
        </CustomToolTip>
    );
};
