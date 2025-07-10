"use client";

import React, { useMemo } from "react";
// Store
import useEditorStore from "@/store/use-editor-store";

// Editor
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Core Tiptap Extensions
import Paragraph from "@tiptap/extension-paragraph";
import HardBreak from "@tiptap/extension-hard-break";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";

// Media & Embed Extensions
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import ImageResize from "tiptap-extension-resize-image";

// Table Extensions
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

// Task List
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";

// Drag & Drop
import GlobalDragHandle from "tiptap-extension-global-drag-handle";

// Custom Extensions
import { HoverExtension } from "@/extensions/hover";
import { VimeoVideo } from "@/extensions/vimeo-video";
import { CustomButton } from "@/extensions/custom-node/CustomButton";

// UI
import { TipTapToolbar } from "@/components/TipTap/toolbar";

const TiptapEditor = () => {
    const { setHtml, setEditor, html: htmlValue } = useEditorStore();

    const extensions = [
        StarterKit.configure({
            paragraph: {
                HTMLAttributes: { "data-type": "draggable-item" },
            },
            code: false,
        }),
        Paragraph,
        HardBreak,
        Underline,
        TextStyle,
        FontFamily,
        Color,
        Highlight.configure({ multicolor: true }),
        Link.configure({
            autolink: true,
            defaultProtocol: "https",
            linkOnPaste: true,
        }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        CharacterCount,
        // REMOVE THIS LINE: History,
        Placeholder.configure({
            placeholder: "Write something …",
        }),
        // Tables
        Table.configure({ resizable: true }),
        TableRow,
        TableCell,
        TableHeader,

        // Tasks
        TaskList,
        TaskItem.configure({ nested: true }),

        // Media
        Image.configure({
            inline: true,
            allowBase64: true,
            HTMLAttributes: { class: "tiptap-image" },
        }),
        ImageResize,
        Youtube.configure({ inline: false, width: 480, height: 480 }),

        // Drag and Drop
        GlobalDragHandle,

        // Custom Features
        HoverExtension,
        VimeoVideo,
        CustomButton,
    ];

    const debouncedSetHtml = useMemo(() => (html: string) => setHtml(html), [setHtml]);

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        onCreate: ({ editor }) => {
            if (htmlValue) editor.commands.setContent(htmlValue);
            const html = editor.getHTML();
            setEditor(editor);
            debouncedSetHtml(html);
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            debouncedSetHtml(html);
            setEditor(editor);
        },
        content: `
            <h1>Blocknote UI Clone with TipTap</h1>
            <p>This is a simple document to demonstrate the hover functionality.</p>
            <p>Hover over any line to see the drag handle and the plus icon.</p>
            <p>The drag handle allows you to reorder the paragraphs.</p>
            <p>The plus icon inserts a new line below the current one.</p>
            <p>This is built using a custom TipTap extension.</p>
            <p>You can drag this line.</p>
            <p>And this one too.</p>
            <p>Try adding a new line in the middle!</p>
            <p>The styling is minimal to keep the focus on the functionality.</p>
            <p>Enjoy exploring the code!</p>
        `,
    });

    if (!editor) return null;

    return (
        <div>
            <TipTapToolbar />
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
