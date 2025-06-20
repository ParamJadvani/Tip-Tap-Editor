import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';

export const BubbleToolbar = ({ editor }: { editor: Editor }) => {
    if (!editor) return null;

    return (
        <div className="flex items-center gap-1 p-2 bg-white border border-gray-300 rounded-md shadow-md">
            <Button
                size="sm"
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold"
            >
                <BoldIcon size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic"
            >
                <ItalicIcon size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                title="Underline"
            >
                <UnderlineIcon size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Strikethrough"
            >
                <StrikethroughIcon size={16} />
            </Button>
            <Button
                size="sm"
                variant={editor.isActive('code') ? 'secondary' : 'ghost'}
                onClick={() => editor.chain().focus().toggleCode().run()}
                title="Inline Code"
            >
                <CodeIcon size={16} />
            </Button>
        </div>
    );
};