// toolbar/InsertHorizontalRuleButton.tsx
import React from 'react';
import { Minus } from 'lucide-react';
import { CustomToolTip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import useEditorStore from '@/store/use-editor-store';



export const InsertHorizontalRuleButton = React.memo(() => {
    const { editor } = useEditorStore();
    if (!editor) {
        return null;
    }
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
});

InsertHorizontalRuleButton.displayName = "InsertHorizontalRuleButton";
