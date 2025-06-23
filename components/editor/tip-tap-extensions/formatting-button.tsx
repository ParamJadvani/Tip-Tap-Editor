import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { CustomToolTip } from "@/components/ui/tooltip";

export const FormattingButtons = React.memo(({ editor }: { editor: Editor }) => (
    <div>
        <CustomToolTip content={<p>Bold</p>}>
            <Button
                size="sm"
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Italic</p>}>
            <Button
                size="sm"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Underline</p>}>
            <Button
                size="sm"
                variant={editor.isActive("underline") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Strikethrough</p>}>
            <Button
                size="sm"
                variant={editor.isActive("strike") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough size={18} />
            </Button>
        </CustomToolTip>
    </div>
));
FormattingButtons.displayName = "FormattingButtons";
