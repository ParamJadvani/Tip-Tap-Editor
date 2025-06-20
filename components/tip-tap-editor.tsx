import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Heading from '@tiptap/extension-heading';
import Mention from '@tiptap/extension-mention';
import useEditorStore from '@/store/use-editor-store';
import { BubbleToolbar } from '@/components/bubble-menubar';
import { EditorToolbar } from '@/components/toolbar';

export default function TiptapEditor() {
    const { setEditor } = useEditorStore();

    const editor = useEditor({
        immediatelyRender: false,
        onCreate: ({ editor }) => setEditor(editor),
        onUpdate: ({ editor }) => setEditor(editor),
        onSelectionUpdate: ({ editor }) => setEditor(editor),
        onFocus: ({ editor }) => setEditor(editor),
        onBlur: ({ editor }) => setEditor(editor),
        onDestroy: () => setEditor(null),
        extensions: [
            StarterKit,
            TaskItem.configure({ nested: true }),
            TaskList,
            Table.configure({ resizable: true }),
            TableCell,
            TableHeader,
            TableRow,
            Underline,
            FontFamily,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Subscript,
            Superscript,
            Heading,
            Mention.configure({
                HTMLAttributes: { class: 'mention' },
                suggestion: {
                    items: ({ query }) => {
                        const users = ['@alice', '@bob', '@charlie'];
                        return users
                            .filter(user => user.toLowerCase().startsWith(query.toLowerCase()))
                            .map(user => ({ label: user }));
                    },
                },
            }),
        ],
        content: `<p>Start writing here...</p>`,
        editorProps: {
            attributes: {
                class:
                    "tiptap prose prose-sm sm:prose lg:prose-lg max-w-none bg-white border border-gray-300 rounded-md min-h-[40vh] p-5 shadow-sm focus:outline-none",
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="w-full mx-auto p-4 space-y-4">
            <div className="sticky top-4 z-30 bg-white border border-gray-200 rounded-md shadow p-3">
                <EditorToolbar editor={editor} />
            </div>

            <div className="relative overflow-x-auto rounded-md bg-gray-50 border border-gray-200 print:bg-white print:border-0">
                <BubbleMenu
                    editor={editor}
                    tippyOptions={{
                        duration: 100,
                        placement: 'top',
                        offset: [0, 10],
                        zIndex: 1000,
                    }}
                    shouldShow={({ editor }) => {
                        return !editor.state.selection.empty;
                    }}
                >
                    <BubbleToolbar editor={editor} />
                </BubbleMenu>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}