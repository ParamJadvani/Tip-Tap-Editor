import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { ChevronDownIcon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HIGHLIGHT_COLORS, TEXT_COLORS } from "@/constants/editor-constants";
import { CustomToolTip } from "@/components/ui/tooltip";

interface ColorPickerButtonProps {
    editor: Editor;
}

export const ColorPickerButton =({ editor }: ColorPickerButtonProps) => {
    const  theme  = "light"

    const highlightTextColor = theme === "light" ? "#000" : "#fff";

    const activeText =
        TEXT_COLORS.find((c) => editor.isActive("textStyle", { color: c.color })) ??
        (theme === "light" ? TEXT_COLORS[0] : { name: "Default", color: "white" });

    const unsetText = useCallback(() => editor.commands.unsetColor(), [editor]);
    const applyText = useCallback(
        (color: string) => {
            editor.commands.unsetColor();
            editor.chain().focus().setColor(color).run();
        },
        [editor]
    );

    const activeHighlight =
        HIGHLIGHT_COLORS.find((c) => editor.isActive("highlight", { color: c.color })) ??
        HIGHLIGHT_COLORS[0];

    const unsetHighlight = useCallback(() => editor.commands.unsetHighlight(), [editor]);
    const applyHighlight = useCallback(
        (color: string) => editor.chain().focus().setHighlight({ color }).run(),
        [editor]
    );

    return (
        <CustomToolTip content="Text and highlight color">
            <Popover>
                <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-1" aria-label="Text color">
                        <span
                            className="rounded-sm px-1 font-medium"
                            style={{
                                color: activeText.color,
                                backgroundColor: activeHighlight.color,
                            }}
                        >
                            A
                        </span>
                        <ChevronDownIcon size={18} />
                    </Button>
                </PopoverTrigger>

                <PopoverContent sideOffset={4} align="start" className="w-56 p-2">
                    {/* Text Color Section */}
                    <div className="px-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Text Color
                    </div>
                    {TEXT_COLORS.map(({ name, color }) => (
                        <Button
                            key={name}
                            onClick={() => {
                                unsetText();
                                if (name !== "Default") applyText(color);
                            }}
                            variant="ghost"
                            className="flex w-full items-center justify-between gap-2 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-0 cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-sm border flex items-center justify-center"
                                    style={{
                                        color: name === "Default" ? highlightTextColor : color, // Default text color based on theme
                                    }}
                                >
                                    A
                                </div>
                                <span>{name}</span>
                            </div>
                            {editor.isActive("textStyle", { color }) && <CheckIcon size={16} />}
                        </Button>
                    ))}

                    {/* Highlight Color Section */}
                    <div className="mt-3 px-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Highlight Color
                    </div>
                    {HIGHLIGHT_COLORS.map(({ name, color }) => (
                        <Button
                            key={name}
                            onClick={() => {
                                unsetHighlight();
                                if (name !== "Default") applyHighlight(color);
                            }}
                            variant="ghost"
                            className="flex w-full items-center justify-between gap-2 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-0 cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-5 w-5 rounded-sm border flex items-center justify-center"
                                    style={{
                                        backgroundColor: color,
                                        color: highlightTextColor,
                                    }}
                                >
                                    A
                                </div>
                                <span>{name}</span>
                            </div>
                            {editor.isActive("highlight", { color }) && <CheckIcon size={16} />}
                        </Button>
                    ))}
                </PopoverContent>
            </Popover>
        </CustomToolTip>
    );
}
