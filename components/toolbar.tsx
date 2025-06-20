import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
    Bold as IconBold,
    Italic as IconItalic,
    Underline as IconUnderline,
    Code as IconCode,
    Link2,
    List,
    ListOrdered,
    Braces,
    Minus,
    Quote,
    Undo,
    Redo,
    Table2,
    Trash,
    CheckSquare,
    Eraser,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from 'lucide-react';

const highlightColors = [
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'pink', label: 'Pink' },
    { value: 'orange', label: 'Orange' },
];

const fontFamilies = [
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
];

const headings = [
    { value: 'Paragraph', label: 'Paragraph' },
    { value: 'H1', label: 'H1' },
    { value: 'H2', label: 'H2' },
    { value: 'H3', label: 'H3' },
    { value: 'H4', label: 'H4' },
    { value: 'H5', label: 'H5' },
    { value: 'H6', label: 'H6' },
];

const EditorToolbar = ({ editor }: { editor: Editor }) => {
    const [currentHighlight, setCurrentHighlight] = useState('none');
    const [currentFontFamily, setCurrentFontFamily] = useState<string | null>('default');
    const [currentHeading, setCurrentHeading] = useState('Paragraph');

    useEffect(() => {
        if (!editor) return;

        const handleUpdate = () => {
            const highlightAttrs = editor.getAttributes('highlight');
            setCurrentHighlight(highlightAttrs?.color || 'none');

            const fontFamilyAttrs = editor.getAttributes('fontFamily');
            setCurrentFontFamily(fontFamilyAttrs?.fontFamily || 'default');

            const { node } = editor.state.selection;
            if (node && node.type.name === 'heading') {
                setCurrentHeading(`H${node.attrs.level}`);
            } else {
                setCurrentHeading('Paragraph');
            }
        };

        handleUpdate();
        editor.on('selectionUpdate', handleUpdate);
        editor.on('update', handleUpdate);

        return () => {
            editor.off('selectionUpdate', handleUpdate);
            editor.off('update', handleUpdate);
        };
    }, [editor]);

    return (
        <div className="flex flex-wrap gap-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm">
            <Button
                size="sm"
                variant={editor.isActive('bold') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <IconBold size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('italic') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <IconItalic size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('underline') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <IconUnderline size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('strike') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
            >
                S
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('code') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Inline Code"
            >
                <IconCode size={16} />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="w-28">
                        {highlightColors.find(c => c.value === currentHighlight)?.label || 'Highlight'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm">
                    <DropdownMenuItem
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onSelect={() => {
                            editor.commands.command(({ tr, state }) => {
                                const { from, to } = state.selection;
                                tr.removeMark(from, to, editor.schema.marks.highlight);
                                return true;
                            });
                        }}
                    >
                        None
                    </DropdownMenuItem>
                    {highlightColors.map(color => (
                        <DropdownMenuItem
                            key={color.value}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onSelect={() => {
                                editor.commands.command(({ tr, state }) => {
                                    const { from, to } = state.selection;
                                    tr.removeMark(from, to, editor.schema.marks.highlight);
                                    tr.addMark(from, to, editor.schema.marks.highlight.create({ color: color.value }));
                                    return true;
                                });
                            }}
                        >
                            {color.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button
                size="sm"
                variant={editor.isActive('link') ? 'default' : 'outline'}
                onClick={() => {
                    const url = prompt('Enter URL') || '';
                    if (url.trim()) editor.commands.toggleLink({ href: url });
                    else editor.commands.unsetLink();
                }}
                title="Insert Link"
            >
                <Link2 size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('subscript') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                title="Subscript"
            >
                X<sub>2</sub>
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('superscript') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleSuperscript().run()}
                title="Superscript"
            >
                X<sup>2</sup>
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet List"
            >
                <List size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Ordered List"
            >
                <ListOrdered size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                title="Code Block"
            >
                <Braces size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Blockquote"
            >
                <Quote size={16} />
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus size={16} />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="w-28">
                        {headings.find(h => h.value === currentHeading)?.label || 'Heading'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm">
                    {headings.map(heading => (
                        <DropdownMenuItem
                            key={heading.value}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onSelect={() => {
                                if (heading.value === 'Paragraph') {
                                    editor.chain().focus().setParagraph().run();
                                } else {
                                    const level = Number(heading.value.replace('H', ''));
                                    editor.chain().focus().setNode('heading', { level }).run();
                                }
                            }}
                        >
                            {heading.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo"
            >
                <Undo size={16} />
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo"
            >
                <Redo size={16} />
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => {
                    editor.commands.insertContent(
                        '<table><tbody><tr><td><p></p></td><td><p></p></td><td><p></p></td></tr><tr><td><p></p></td><td><p></p></td><td><p></p></td></tr><tr><td><p></p></td><td><p></p></td><td><p></p></td></tr></tbody></table>'
                    );
                }}
                title="Insert Table"
            >
                <Table2 size={16} />
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => {
                    if (editor.isActive('table')) {
                        editor.commands.deleteRange({
                            from: editor.state.selection.from,
                            to: editor.state.selection.to,
                        });
                    }
                }}
                disabled={!editor.isActive('table')}
                title="Delete Table"
            >
                <Trash size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('taskList') ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                title="Task List"
            >
                <CheckSquare size={16} />
            </Button>
            <Button
                size="sm"
                variant="outline"
                onClick={() => editor.chain().focus().unsetAllMarks().setParagraph().run()}
                title="Clear Formatting"
            >
                <Eraser size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                title="Align Left"
            >
                <AlignLeft size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                title="Align Center"
            >
                <AlignCenter size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                title="Align Right"
            >
                <AlignRight size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                title="Justify Text"
            >
                <AlignJustify size={16} />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="w-28">
                        {fontFamilies.find(f => f.value === currentFontFamily)?.label || 'Font Family'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border border-gray-200 rounded-md shadow-sm">
                    <DropdownMenuItem
                        className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                        onSelect={() => editor.chain().focus().unsetFontFamily().run()}
                    >
                        Default
                    </DropdownMenuItem>
                    {fontFamilies.map(family => (
                        <DropdownMenuItem
                            key={family.value}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onSelect={() => editor.chain().focus().setFontFamily(family.value).run()}
                        >
                            {family.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default EditorToolbar;