"use client";
import useEditorStore from "@/store/use-editor-store";

export default function Preview() {
    const html = useEditorStore((state) => state.html);

    if (!html) {
        return <div className="p-4 text-gray-500">No content to preview</div>;
    }

    return (
        <div className="w-full mx-auto p-4">
            <div
                className="tiptap prose prose-sm sm:prose-base max-w-none p-4 bg-white border border-gray-200 rounded-md min-h-[50vh]"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
