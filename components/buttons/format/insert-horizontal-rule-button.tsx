// toolbar/InsertHorizontalRuleButton.tsx
import React from 'react';
import { Editor } from '@tiptap/react';
import { Minus } from 'lucide-react';
import { CustomToolTip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface InsertHorizontalRuleButtonProps {
    editor: Editor;
}

export const InsertHorizontalRuleButton = ({ editor }: InsertHorizontalRuleButtonProps) => {
    return (
        <CustomToolTip content="Horizontal rule">
            <Button
                size="icon"
                variant="ghost"
                aria-label="Insert horizontal rule"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={editor.isActive("horizontalRule") ? "bg-secondary text-secondary-foreground" : ""}
            >
                <Minus size={18} />
            </Button>
        </CustomToolTip>
    );
};
