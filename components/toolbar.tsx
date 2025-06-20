import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Bold, Italic, Underline, Strikethrough, Code, Highlighter, Link2, List, Minus, Quote, Undo2, Redo2, Table2, Trash2, Eraser, AlignLeft,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SketchPicker, ColorResult } from 'react-color';
import { ALIGNMENTS, FONT_FAMILIES, HEADINGS, LIST_TYPES } from '@/constants/editor_constants';
import { Level } from '@tiptap/extension-heading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const TextColorButton = ({ editor }: { editor: Editor }) => {
    const color = editor?.getAttributes('textStyle').color || '#000000';

    const handleChange = (color: ColorResult) => {
        editor?.chain().focus().setColor(color.hex).run();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" title="Text Color">
                    <span className="text-xs">A</span>
                    <div className="h-1 w-4" style={{ backgroundColor: color }} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker color={color} onChange={handleChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const HighlightColorButton = ({ editor }: { editor: Editor }) => {
    const color = editor?.getAttributes('highlight').color || '#ffffff';

    const handleChange = (color: ColorResult) => {
        editor?.chain().focus().setHighlight({ color: color.hex }).run();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" title="Highlight Color">
                    <Highlighter size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0">
                <SketchPicker color={color} onChange={handleChange} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const LinkButton = ({ editor }: { editor: Editor }) => {
    const [url, setUrl] = useState('');

    const handleApply = () => {
        if (url.trim()) {
            editor?.chain().focus().toggleLink({ href: url }).run();
        } else {
            editor?.chain().focus().unsetLink().run();
            setUrl('');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant={editor?.isActive('link') ? 'secondary' : 'ghost'}
                    title="Insert Link"
                >
                    <Link2 size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 flex items-center gap-2">
                <Input
                    placeholder="Paste URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-40"
                />
                <Button size="sm" onClick={handleApply}>Apply</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Main Editor Toolbar
export const EditorToolbar = ({ editor }: { editor: Editor }) => {
    if (!editor) return null

    const setHeading = (value: string) => {
        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = Number(value.replace('h', '')) as Level;
            editor.chain().focus().setNode('heading', { level }).run();
        }
    };


    return (
        <div className="flex flex-wrap items-center gap-1 p-2">
            {/* History */}
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo"
            >
                <Undo2 size={18} />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo"
            >
                <Redo2 size={18} />
            </Button>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Headings Dropdown
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-1">
                        <CurrentHeadingIcon size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm w-48">
                    {HEADINGS.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={value}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onSelect={() => setHeading(value)}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu> */}

            <Select onValueChange={setHeading} defaultValue="paragraph">
                <SelectTrigger className="py-2 px-3">
                    <SelectValue placeholder="Heading" />
                </SelectTrigger>
                <SelectContent>
                    {HEADINGS.map(({ value, label, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                            <Icon size={16} />
                            <span>{label}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Basic Formatting */}
            <Button
                size="sm"
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <Bold size={18} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <Italic size={18} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <Underline size={18} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
            >
                <Strikethrough size={18} />
            </Button>

            {/* Color Pickers */}
            <TextColorButton editor={editor} />
            <HighlightColorButton editor={editor} />

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Lists */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <List size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm w-48">
                    {LIST_TYPES.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={value}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onSelect={() => {
                                if (value === 'bullet') editor.chain().focus().toggleBulletList().run();
                                else if (value === 'ordered') editor.chain().focus().toggleOrderedList().run();
                                else editor.chain().focus().toggleTaskList().run();
                            }}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Alignment */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <AlignLeft size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm w-48">
                    {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={value}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onSelect={() => editor.chain().focus().setTextAlign(value).run()}
                        >
                            <Icon size={16} />
                            <span>{label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Code */}
            <Button
                size="sm"
                variant={editor.isActive('code') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Inline Code"
            >
                <Code size={18} />
            </Button>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Links & Blocks */}
            <LinkButton editor={editor} />
            <Button
                size="sm"
                variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Blockquote"
            >
                <Quote size={18} />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus size={18} />
            </Button>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Fonts */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="gap-1">
                        Font
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm w-48">
                    <DropdownMenuItem
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onSelect={() => editor.chain().focus().unsetFontFamily().run()}
                    >
                        Default
                    </DropdownMenuItem>
                    {FONT_FAMILIES.map(family => (
                        <DropdownMenuItem
                            key={family.value}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onSelect={() => editor.chain().focus().setFontFamily(family.value).run()}
                        >
                            {family.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Tables */}
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })}
                title="Insert Table"
            >
                <Table2 size={18} />
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.commands.deleteTable()}
                disabled={!editor.isActive('table')}
                title="Delete Table"
            >
                <Trash2 size={18} />
            </Button>

            {/* Clear Formatting */}
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                title="Clear Formatting"
            >
                <Eraser size={18} />
            </Button>
        </div>
    );
};