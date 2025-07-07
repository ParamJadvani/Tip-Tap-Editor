"use client";
import useEditorStore from "@/store/use-editor-store";

export default function Preview() {
    const html = useEditorStore((state) => state.html);

    if (!html) {
        return (
            <div className="p-4 text-gray-500 dark:text-gray-400 italic">No content to preview</div>
        );
    }

    console.log(html);

    return (
        <div className="w-full mx-auto p-2">
            <div
                className="tiptap prose prose-base sm:prose-lg lg:prose-xl dark:prose-invert max-w-none p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md min-h-[50vh] transition-colors duration-200"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
