"use client";

import React, { useEffect, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Paragraph from "@tiptap/extension-paragraph";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import useEditorStore from "@/store/use-editor-store";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import { Vimeo } from "@fourwaves/tiptap-extension-vimeo";
import CharacterCount from "@tiptap/extension-character-count";
import { DragHandle } from "@tiptap/extension-drag-handle";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { debounce } from "lodash";

export default function TiptapEditor() {
    const { setHtml } = useEditorStore();

    const debouncedSetHtml = useMemo(
        () => debounce((html: string) => setHtml(html), 300),
        [setHtml]
    );

    const extensions = useMemo(
        () => [
            StarterKit,
            Paragraph,
            Vimeo,
            TaskList,
            TaskItem.configure({ nested: true }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            Underline,
            FontFamily,
            TextStyle,
            Color,
            CharacterCount,
            Highlight.configure({ multicolor: true }),
            Link.configure({ autolink: true, defaultProtocol: "https", linkOnPaste: true }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: { class: "tiptap-image" },
            }),
            Youtube.configure({ inline: false, width: 480, height: 480 }),
            DragHandle.configure({
                locked: false,
                render: () => {
                    const el = document.createElement("div");
                    el.classList.add("my-drag-handle");
                    return el;
                },
                tippyOptions: { placement: "left" },
            }),
        ],
        []
    );

    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content: "<p>Start writing here...</p>",
        editorProps: {
            attributes: {
                class: "tiptap prose prose-sm sm:prose-base max-w-none p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md min-h-[50vh] focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (!editor) return;
        const handle = () => debouncedSetHtml(editor.getHTML());
        editor.on("update", handle);
        return () => {
            editor.off("update", handle);
        };
    }, [editor, debouncedSetHtml]);

    if (!editor) return null;

    return (
        <div className="w-full mx-auto p-4 space-y-3 ">
            <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
                <EditorToolbar editor={editor} />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md p-2">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
