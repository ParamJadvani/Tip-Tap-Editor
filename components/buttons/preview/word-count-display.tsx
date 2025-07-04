// toolbar/WordCountDisplay.tsx
import React from 'react';
import { Editor } from '@tiptap/react';

interface WordCountDisplayProps {
    editor: Editor;
}

export const WordCountDisplay = ({ editor }: WordCountDisplayProps) => {
    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm">
            <span className="font-medium text-gray-900 dark:text-gray-100">
                {editor.storage.characterCount.words()}
            </span>
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Words
            </span>
        </div>
    );
};
