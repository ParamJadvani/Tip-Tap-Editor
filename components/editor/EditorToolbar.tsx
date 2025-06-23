import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Code, Minus, Quote } from "lucide-react";
import { HEADINGS } from "@/constants/editor-constants";
import { Level } from "@tiptap/extension-heading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CustomToolTip, TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/context/ThemeContext";
import { HistoryButtons } from "@/components/editor/tip-tap-extensions/history-button";
import { FormattingButtons } from "@/components/editor/tip-tap-extensions/formatting-button";
import { TextColorButton } from "@/components/editor/tip-tap-extensions/text-color-button";
import { HighlightColorButton } from "@/components/editor/tip-tap-extensions/highlight-button";
import { ListButtons } from "@/components/editor/tip-tap-extensions/list-button";
import { AlignmentButtons } from "@/components/editor/tip-tap-extensions/alignment-button";
import { LinkButton } from "@/components/editor/tip-tap-extensions/link-button";
import { FontButtons } from "@/components/editor/tip-tap-extensions/font-button";
import { TableButtons } from "@/components/editor/tip-tap-extensions/table-button";
import { ImageUploadButton } from "@/components/editor/tip-tap-extensions/image-upload-button";
import { YoutubeButton } from "@/components/editor/tip-tap-extensions/youtube-button";
import { ClearFormattingButton } from "@/components/editor/tip-tap-extensions/clear-format-button";
import { PreviewButton } from "@/components/editor/tip-tap-extensions/preview-button";

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
    const { theme, toggleTheme } = useTheme();

    const setHeading = useCallback(
        (value: string) => {
            if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
            } else {
                const level = Number(value.replace("h", "")) as Level;
                editor.chain().focus().setNode("heading", { level }).run();
            }
        },
        [editor]
    );
    if (!editor) return null;

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                <CustomToolTip content={<p>Toggle Theme</p>}>
                    <Button size="sm" variant="ghost" onClick={toggleTheme}>
                        {theme === "light" ? "🌙" : "☀️"}
                    </Button>
                </CustomToolTip>

                <HistoryButtons editor={editor} />

                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <Select onValueChange={setHeading} defaultValue="paragraph">
                    <SelectTrigger className="py-2 px-3 w-40">
                        <SelectValue placeholder="Heading" />
                    </SelectTrigger>
                    <SelectContent>
                        {HEADINGS.map(({ value, label, icon: Icon }) => (
                            <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                <FormattingButtons editor={editor} />

                <TextColorButton editor={editor} />

                <HighlightColorButton editor={editor} />

                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                <ListButtons editor={editor} />

                <AlignmentButtons editor={editor} />

                <CustomToolTip content={<p>Code</p>}>
                    <Button
                        size="sm"
                        variant={editor.isActive("code") ? "secondary" : "ghost"}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                        <Code size={18} />
                    </Button>
                </CustomToolTip>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                <LinkButton editor={editor} />

                <CustomToolTip content={<p>Blockquote</p>}>
                    <Button
                        size="sm"
                        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote size={18} />
                    </Button>
                </CustomToolTip>
                <CustomToolTip content={<p>Horizontal Rule</p>}>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    >
                        <Minus size={18} />
                    </Button>
                </CustomToolTip>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                <FontButtons editor={editor} />

                <TableButtons editor={editor} />

                <ImageUploadButton editor={editor} />

                <YoutubeButton editor={editor} />

                <ClearFormattingButton editor={editor} />

                <PreviewButton />
            </div>
        </TooltipProvider>
    );
};
