"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import {
  AlignmentButtons,
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

interface TipTapToolbarProps {
  editor: Editor;
}

export function TipTapToolbar({ editor }: TipTapToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
      <HistoryButtons editor={editor} />
      <div className="toolbar-separator" />

      {/* Block-level Formatting Group */}
      <HeadingSelect editor={editor} />
      <ToggleCodeBlockButton editor={editor} />
      <ToggleBlockquoteButton editor={editor} />
      <InsertHorizontalRuleButton editor={editor} />
      <div className="toolbar-separator" />

      {/* Inline Formatting Group */}
      <FormattingButtons editor={editor} />
      <div className="toolbar-separator" />

      <AlignmentButtons editor={editor} />
      <div className="toolbar-separator" />

      {/* Font & Color Group */}
      <FontButtons editor={editor} />
      <ColorPickerButton editor={editor} />
      <div className="toolbar-separator" />

      <ListButtons editor={editor} />
      <div className="toolbar-separator" />

      {/* Media & Links Group */}
      <ImageUploadButton editor={editor} />
      <LinkButton editor={editor} />
      <YoutubeButton editor={editor} />
      <div className="toolbar-separator" />

      {/* Table & Utility Group */}
      <TableButtons editor={editor} />
      <ClearFormattingButton editor={editor} />
      <PreviewButton />
      <div className="toolbar-separator" />

      {/* Right-aligned Word Count */}
      <div className="ml-auto">
        {" "}
        {/* Use ml-auto to push to the right */}
        <WordCountDisplay editor={editor} />
      </div>
    </div>
  );
}
