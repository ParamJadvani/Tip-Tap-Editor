// /extensions/ImageWithCaption.ts
import { Node, mergeAttributes } from "@tiptap/core";

export interface ImageWithCaptionOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        imageWithCaption: {
            /** Insert a new image with optional caption */
            setImageWithCaption: (options: {
                src: string;
                alt?: string;
                title?: string;
                caption?: string;
            }) => ReturnType;
            /** Update the caption of the selected image */
            updateCaption: (caption: string) => ReturnType;
            /** Remove caption from the selected image */
            removeCaption: () => ReturnType;
        };
    }
}

export const ImageWithCaption = Node.create<ImageWithCaptionOptions>({
    name: "imageWithCaption",
    group: "block",
    draggable: true,

    addOptions() {
        return { HTMLAttributes: {} };
    },

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            caption: { default: "" },
        };
    },

    parseHTML() {
        return [{ tag: "figure[data-image-with-caption]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "figure",
            mergeAttributes(this.options.HTMLAttributes, { "data-image-with-caption": "" }),
            ["img", mergeAttributes(HTMLAttributes)],
            ["figcaption", {}, HTMLAttributes.caption as string],
        ];
    },

    addCommands() {
        return {
            setImageWithCaption:
                (options) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: options.src,
                            alt: options.alt || "",
                            title: options.title || "",
                            caption: options.caption || "",
                        },
                    });
                },

            updateCaption:
                (caption) =>
                ({ commands, state }) => {
                    const { $from } = state.selection;
                    const node = state.selection.node || $from.nodeAfter;
                    if (!node || node.type.name !== this.name) {
                        return false;
                    }
                    return commands.updateAttributes(this.name, { caption });
                },

            removeCaption:
                () =>
                ({ commands, state }) => {
                    const { $from } = state.selection;
                    const node = state.selection.node || $from.nodeAfter;
                    if (!node || node.type.name !== this.name) {
                        return false;
                    }
                    return commands.updateAttributes(this.name, { caption: "" });
                },
        };
    },
});

// // Usage in /components/editor/TiptapEditor.tsx
// // ------------------------------------------------
// import React, { useRef } from "react";
// import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
// import { ImageWithCaption } from "@/extensions/ImageWithCaption";

// export default function TiptapEditor() {
//     const bubbleMenuRef = useRef<HTMLDivElement | null>(null);
//     const editor = useEditor({
//         extensions: [
//             ImageWithCaption.configure({ HTMLAttributes: { class: "tiptap-image" } }),
//             // ...other extensions
//         ],
//         content: "<p>Write something…</p>",
//     });

//     if (!editor) {
//         return null;
//     }

//     return (
//         <div className="prose dark:prose-invert">
//             <EditorContent editor={editor} />

//             <BubbleMenu
//                 editor={editor}
//                 element={bubbleMenuRef.current as HTMLDivElement}
//                 shouldShow={({ state }) => {
//                     const { $from } = state.selection;
//                     const node = state.selection.node || $from.nodeAfter;
//                     return node?.type.name === "imageWithCaption";
//                 }}
//                 tippyOptions={{ duration: 100 }}
//             >
//                 <div
//                     ref={bubbleMenuRef}
//                     className="bg-white dark:bg-gray-800 shadow rounded p-2 flex"
//                 >
//                     <button
//                         className="btn-sm btn-outline"
//                         onClick={() => {
//                             const attrs = editor.getAttributes("imageWithCaption") as {
//                                 caption?: string;
//                             };
//                             const current = attrs.caption || "";
//                             const newCaption = prompt("Enter caption:", current) || "";
//                             editor.commands.updateCaption(newCaption);
//                         }}
//                     >
//                         Edit Caption
//                     </button>

//                     <button
//                         className="btn-sm btn-destructive ml-2"
//                         onClick={() => editor.commands.removeCaption()}
//                     >
//                         Remove Caption
//                     </button>
//                 </div>
//             </BubbleMenu>
//         </div>
//     );
// }

// // **Use Case**
// // A blog authoring interface where images are inserted optionally with captions: authors can skip captions on most images, but if needed, click the bubble menu to edit or remove captions inline, improving workflow efficiency and accessibility.
