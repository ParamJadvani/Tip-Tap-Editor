import React, { useCallback } from "react";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";
import useEditorStore from '@/store/use-editor-store';



export const FormattingButtons = React.memo(() => {
    const { editor } = useEditorStore();
    const onBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
    const onItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
    const onUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);
    const onStrike = useCallback(() => editor?.chain().focus().toggleStrike().run(), [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-1">
            <CustomToolTip content="Bold">
                <Button
                    size="sm"
                    variant={editor?.isActive("bold") ? "default" : "ghost"}
                    onClick={onBold}
                    aria-label="Bold"
                >
                    <Bold size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Italic">
                <Button
                    size="sm"
                    variant={editor?.isActive("italic") ? "default" : "ghost"}
                    onClick={onItalic}
                    aria-label="Italic"
                >
                    <Italic size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Underline">
                <Button
                    size="sm"
                    variant={editor?.isActive("underline") ? "default" : "ghost"}
                    onClick={onUnderline}
                    aria-label="Underline"
                >
                    <Underline size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Strikethrough">
                <Button
                    size="sm"
                    variant={editor?.isActive("strike") ? "default" : "ghost"}
                    onClick={onStrike}
                    aria-label="Strikethrough"
                >
                    <Strikethrough size={18} />
                </Button>
            </CustomToolTip>
        </div>
    );
});

FormattingButtons.displayName = "FormattingButtons";
