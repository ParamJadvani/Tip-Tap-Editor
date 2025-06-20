// components/TiptapEditor.jsx

// @Error 
// Tiptap Error: SSR has been detected, please set `immediatelyRender` explicitly to `false` to avoid hydration mismatches.
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Heading, { Level } from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/core'
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Bold as IconBold,
    Italic as IconItalic,
    Underline as IconUnderline,
    Code as IconCode,
    Link2,
    List,
    ListOrdered,
    Braces,
    Minus
} from 'lucide-react';

export default function TiptapEditor() {
    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                    "focus:outline-none print:border-0 border bg-white border-[#c7c7c7] flex flex-col min-h-screen w-[816px] mx-auto cursor-text p-4",
            },
        },
        extensions: [
            StarterKit,
            Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
            Bold,
            Italic,
            Underline,
            Code,
            Highlight,
            Link.configure({ openOnClick: true }),
            Strike,
            Subscript,
            Superscript,
            TextStyle,
            Blockquote,
            BulletList,
            CodeBlockLowlight.configure({
                lowlight,
            })
        ],
        content: '<p>Start writing here...</p>',
    });

    if (!editor) return null;

    const toggleBold = () => editor.chain().focus().toggleBold().run();

    const toggleItalic = () => editor.chain().focus().toggleItalic().run();

    const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();

    const toggleStrike = () => editor.chain().focus().toggleStrike().run();

    const toggleCode = () => editor.chain().focus().toggleCode().run();

    const toggleHighlight = () => editor.chain().focus().toggleHighlight().run();

    const toggleSubscript = () => editor.chain().focus().toggleSubscript().run();

    const toggleSuperscript = () => editor.chain().focus().toggleSuperscript().run();

    const toggleLink = () => {
        const url = prompt('Enter URL') || "";
        if (url.trim() === '') editor.commands.unsetLink();
        else editor.commands.toggleLink({ href: url });
    };

    const setHeading = (value: string) => {
        if (value === 'Paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = Number(value.replace('H', '')) as Level;
            editor.chain().focus().setNode('heading', { level }).run();
        }
    };

    const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();

    const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();

    const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

    const insertHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();

    return (
        <div className='p-4'>
            <div className="flex flex-wrap gap-2 mb-4 mx-auto justify-center">
                <Button
                    size="sm"
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    onClick={toggleBold}
                >
                    <IconBold size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    onClick={toggleItalic}
                >
                    <IconItalic size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('underline') ? 'default' : 'outline'}
                    onClick={toggleUnderline}
                >
                    <IconUnderline size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('strike') ? 'default' : 'outline'}
                    onClick={toggleStrike}
                >
                    S
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('code') ? 'default' : 'outline'}
                    onClick={toggleCode}
                >
                    <IconCode size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('highlight') ? 'default' : 'outline'}
                    onClick={toggleHighlight}
                >
                    Highlight
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('link') ? 'default' : 'outline'}
                    onClick={toggleLink}
                >
                    <Link2 size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('subscript') ? 'default' : 'outline'}
                    onClick={toggleSubscript}
                >
                    X<sub>2</sub>
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('superscript') ? 'default' : 'outline'}
                    onClick={toggleSuperscript}
                >
                    X<sup>2</sup>
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                    onClick={toggleBulletList}
                >
                    <List size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                    onClick={toggleOrderedList}
                >
                    <ListOrdered size={16} />
                </Button>
                <Button
                    size="sm"
                    variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                    onClick={toggleCodeBlock}
                >
                    <Braces size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={insertHorizontalRule}
                >
                    <Minus size={16} />
                </Button>
                <Select onValueChange={setHeading} defaultValue="Paragraph">
                    <SelectTrigger className="py-2 px-3">
                        <SelectValue placeholder="Heading" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Paragraph">Normal</SelectItem>
                        {[1, 2, 3, 4, 5, 6].map((level) => (
                            <SelectItem key={level} value={`H${level}`}>
                                H{level}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="size-full overflow-x-auto bg-[#f9fbfd] px-0 print:p-0 print:bg-white print:overflow-visible">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}