// components/editor/TiptapEditor.tsx
import React, { useCallback } from "react";
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
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import useEditorStore from "@/store/use-editor-store";
import TableHeader from "@tiptap/extension-table-header";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import Youtube from "@tiptap/extension-youtube";
// import { debounce } from 'lodash';

export default function TiptapEditor() {
    const { setEditor, setHtml } = useEditorStore();

    const debouncedSetHtml = useCallback(
        // debounce((html: string) =>, 300),
        (html: string) => setHtml(html),
        [setHtml]
    );

    const editor = useEditor({
        immediatelyRender: false,
        onCreate: ({ editor }) => {
            setEditor(editor);
            debouncedSetHtml(editor.getHTML());
        },
        onUpdate: ({ editor }) => {
            setEditor(editor);
            debouncedSetHtml(editor.getHTML());
        },
        onSelectionUpdate: ({ editor }) => {
            setEditor(editor);
            debouncedSetHtml(editor.getHTML());
        },
        onFocus: ({ editor }) => {
            setEditor(editor);
            debouncedSetHtml(editor.getHTML());
        },
        onBlur: ({ editor }) => {
            setEditor(editor);
            debouncedSetHtml(editor.getHTML());
        },
        onDestroy: () => setEditor(null),
        extensions: [
            StarterKit,
            Youtube.configure({
                inline: false,
                width: 480,
                height: 480,
            }),
            TaskList,
            TableCell,
            TableRow,
            Underline,
            FontFamily,
            TextStyle,
            Color,
            TableHeader,
            Highlight.configure({
                multicolor: true,
            }),
            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Link.configure({
                autolink: true,
                defaultProtocol: "https",
                linkOnPaste: true,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: { class: "tiptap-image" },
            }),
            // YoutubeExtension,
        ],
        content: "<p>Start writing here...</p>",
        editorProps: {
            attributes: {
                class: "tiptap prose prose-sm sm:prose-base max-w-none p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md min-h-[50vh] focus:outline-none",
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="w-full mx-auto p-4">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-t-md p-2 sticky top-0 z-30 shadow-sm">
                <EditorToolbar editor={editor} />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-md">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
