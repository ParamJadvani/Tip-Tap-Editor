"use client";

import React from "react";
import {
    AlignmentButtons,
    ApplyButton,
    ButtonStylesToolbar,
    ClearFormattingButton,
    ColorPickerButton,
    FontButtons,
    FormattingButtons,
    HeadingSelect,
    HistoryButtons,
    ImageUploadButton,
    InsertHorizontalRuleButton,
    LinkButton,
    ListButtons,
    PreviewButton,
    TableButtons,
    ToggleBlockquoteButton,
    ToggleCodeBlockButton,
    WordCountDisplay,
    YoutubeButton,
} from "@/components/buttons";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/toogle-theme";

export function TipTapToolbar() {
    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
            <ThemeToggle />
            <Separator orientation="vertical" />
            <HistoryButtons />
            <Separator orientation="vertical" />

            {/* Block-level Formatting Group */}
            <HeadingSelect />
            <ToggleCodeBlockButton />
            <ToggleBlockquoteButton />
            <InsertHorizontalRuleButton />
            <Separator orientation="vertical" />

            {/* Inline Formatting Group */}
            <FormattingButtons />
            <Separator orientation="vertical" />

            <AlignmentButtons />
            <Separator orientation="vertical" />

            {/* Font & Color Group */}
            <FontButtons />
            <ColorPickerButton />
            <Separator orientation="vertical" />

            <ListButtons />
            <Separator orientation="vertical" />

            {/* Media & Links Group */}
            <ImageUploadButton />
            <LinkButton />
            <YoutubeButton />
            <Separator orientation="vertical" />

            {/* Table & Utility Group */}
            <TableButtons />
            <ClearFormattingButton />
            {/* Custom Button for Integrated Functionality */}
            <ApplyButton />
            <ButtonStylesToolbar />
            <PreviewButton />
            <Separator orientation="vertical" />

            {/* Right-aligned Word Count */}
            <div className="ml-auto">
                {" "}
                <WordCountDisplay />
            </div>
            <Separator orientation="vertical" />
        </div>
    );
}
