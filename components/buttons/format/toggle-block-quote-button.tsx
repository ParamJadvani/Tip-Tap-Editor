// toolbar/ToggleBlockquoteButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust path as needed
import { CustomToolTip } from '@/components/ui/tooltip'; // Adjust path as needed
import { Quote } from 'lucide-react';
import useEditorStore from '@/store/use-editor-store';



export const ToggleBlockquoteButton = React.memo(() => {
    const { editor } = useEditorStore();
    if (!editor) {
        return null;
    }
    return (
        <CustomToolTip content="Blockquote">
            <Button
                size="icon"
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                aria-label="Toggle blockquote"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote size={18} />
            </Button>
        </CustomToolTip>
    );
});

ToggleBlockquoteButton.displayName = "ToggleBlockquoteButton";
