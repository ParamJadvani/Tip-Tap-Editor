// EditorToolbar.tsx
"use client";

import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Code, Minus, Quote } from "lucide-react";
import { HEADINGS } from "@/constants/editor-constants";
import { Level } from "@tiptap/extension-heading";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { CustomToolTip, TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/context/ThemeContext";

import {
    HistoryButtons,
    FormattingButtons,
    ListButtons,
    AlignmentButtons,
    LinkButton,
    TableButtons,
    ImageUploadButton,
    YoutubeButton,
    ClearFormattingButton,
    PreviewButton,
    ColorPickerButton,
    FontButtons,
    HardBreakButton,
} from "@/components/editor/TIpTapExtensions";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
    const { theme, toggleTheme } = useTheme();

    const setHeading = useCallback(
        (value: string) => {
            if (!editor) return;
            if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
            } else {
                const level = (Number(value.replace("h", "")) as Level) || 1;
                editor.chain().focus().setNode("heading", { level }).run();
            }
        },
        [editor]
    );

    if (!editor) return null;

    return (
        <TooltipProvider>
            <nav
                aria-label="Editor toolbar"
                className="flex flex-wrap items-center space-x-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
                {/* Theme toggle */}
                <CustomToolTip content="Toggle theme">
                    <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Toggle theme"
                        onClick={toggleTheme}
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </Button>
                </CustomToolTip>

                <div role="group" className="flex items-center space-x-1">
                    <HistoryButtons editor={editor} />
                </div>

                <div role="group" className="flex items-center space-x-1">
                    <Select onValueChange={setHeading} defaultValue="paragraph">
                        <SelectTrigger className="px-2 py-1 w-36 text-sm">
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
                </div>

                <div role="group" className="flex items-center space-x-1">
                    <FormattingButtons editor={editor} />
                    {/* replace TextColorButton */}
                    <ColorPickerButton editor={editor} />
                </div>

                <div role="group" className="flex items-center space-x-1">
                    <ListButtons editor={editor} />
                    <AlignmentButtons editor={editor} />
                </div>

                <div role="group" className="flex items-center space-x-1">
                    <CustomToolTip content="Toggle code block">
                        <Button
                            size="sm"
                            variant={editor.isActive("code") ? "secondary" : "ghost"}
                            aria-label="Insert code block"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                        >
                            <Code size={18} />
                        </Button>
                    </CustomToolTip>

                    <CustomToolTip content="Blockquote">
                        <Button
                            size="sm"
                            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                            aria-label="Toggle blockquote"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        >
                            <Quote size={18} />
                        </Button>
                    </CustomToolTip>

                    <CustomToolTip content="Horizontal rule">
                        <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Insert horizontal rule"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        >
                            <Minus size={18} />
                        </Button>
                    </CustomToolTip>
                </div>

                <div role="group" className="flex items-center space-x-1">
                    <LinkButton editor={editor} />
                    <FontButtons editor={editor} />
                    <TableButtons editor={editor} />
                    <ImageUploadButton editor={editor} />
                    <YoutubeButton editor={editor} />
                </div>

                <div role="group" className="flex items-center space-x-1">
                    <ClearFormattingButton editor={editor} />
                    {/* replace HighlightColorButton */}
                    {/* <ColorMenuButton editor={editor} mode="highlight" /> */}
                    <HardBreakButton editor={editor} />
                    <PreviewButton />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-md border text-sm bg-muted text-muted-foreground">
                    <span className="font-medium text-foreground">
                        {editor.storage.characterCount.words()}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        Words
                    </span>
                </div>
            </nav>
        </TooltipProvider>
    );
}
