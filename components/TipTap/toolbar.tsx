"use client";

import React from "react";
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


export function TipTapToolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
      <HistoryButtons  />
      <div className="toolbar-separator" />

      {/* Block-level Formatting Group */}
      <HeadingSelect  />
      <ToggleCodeBlockButton  />
      <ToggleBlockquoteButton  />
      <InsertHorizontalRuleButton  />
      <div className="toolbar-separator" />

      {/* Inline Formatting Group */}
      <FormattingButtons  />
      <div className="toolbar-separator" />

      <AlignmentButtons  />
      <div className="toolbar-separator" />

      {/* Font & Color Group */}
      <FontButtons  />
      <ColorPickerButton  />
      <div className="toolbar-separator" />

      <ListButtons  />
      <div className="toolbar-separator" />

      {/* Media & Links Group */}
      <ImageUploadButton  />
      <LinkButton  />
      <YoutubeButton  />
      <div className="toolbar-separator" />

      {/* Table & Utility Group */}
      <TableButtons />
      <ClearFormattingButton  />
      <PreviewButton />
      <div className="toolbar-separator" />

      {/* Right-aligned Word Count */}
      <div className="ml-auto">
        {" "}
        {/* Use ml-auto to push to the right */}
        <WordCountDisplay  />
      </div>
    </div>
  );
}
