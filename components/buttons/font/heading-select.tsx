// toolbar/HeadingSelect.tsx
import React from 'react';
import { HEADINGS } from '@/constants/editor-constants';
import { Level } from "@tiptap/extension-heading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useEditorStore from '@/store/use-editor-store';


export const HeadingSelect = React.memo(() => {
    const { editor } = useEditorStore();
    const setHeading = (value: string) => {
        if (value === 'paragraph') {
            editor?.chain().focus().setParagraph().run();
        } else {
            const level = (Number(value.replace("h", "")) as Level) || 1;
            editor?.chain().focus().setNode("heading", { level }).run();
        }
    };

    const currentHeading = HEADINGS.find(
        (heading) =>
            (heading.value === 'paragraph' && editor?.isActive('paragraph')) ||
            (heading.value.startsWith('heading') &&
                editor?.isActive('heading', { level: parseInt(heading.value.replace('heading', '')) }))
    )?.value || 'paragraph';

    if (!editor) {
        return null;
    }

    return (
        <Select onValueChange={setHeading} defaultValue={currentHeading}>
            <SelectTrigger className="px-2 py-1 w-36 text-sm h-9">
                <SelectValue placeholder="Heading" />
            </SelectTrigger>
            <SelectContent>
                {HEADINGS.map(({ value, label, icon: Icon }) => (
                    <SelectItem key={value} value={value} className="flex items-center gap-2">
                        <Icon size={16} />
                        <span>{label}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
});

HeadingSelect.displayName = "HeadingSelect";
