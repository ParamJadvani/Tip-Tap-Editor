// toolbar/ToggleCodeBlockButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust path as needed
import { CustomToolTip } from '@/components/ui/tooltip'; // Adjust path as needed
import { Code } from 'lucide-react';
import useEditorStore from '@/store/use-editor-store';


export const ToggleCodeBlockButton = React.memo(() => {
    const { editor } = useEditorStore();
    if (!editor) {
        return null;
    }
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
});

ToggleCodeBlockButton.displayName = "ToggleCodeBlockButton";
