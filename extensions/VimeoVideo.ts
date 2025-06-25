// extensions/VimeoVideo.ts
import { Node, mergeAttributes } from "@tiptap/core";

export interface VimeoVideoOptions {
    HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        vimeoVideo: {
            insertVimeoVideo: (options: { src: string }) => ReturnType;
        };
    }
}

export const VimeoVideo = Node.create<VimeoVideoOptions>({
    name: "vimeoVideo",

    group: "block",

    atom: true,

    selectable: true,

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "iframe[data-vimeo]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "iframe",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                "data-vimeo": "",
                frameborder: 0,
                allow: "autoplay; fullscreen",
                allowfullscreen: "true",
                width: "640",
                height: "360",
            }),
        ];
    },

    addCommands() {
        return {
            insertVimeoVideo:
                ({ src }) =>
                ({ commands }) => {
                    const videoIdMatch = src.match(/vimeo\.com\/(\d+)/);
                    if (!videoIdMatch) return false;

                    const videoId = videoIdMatch[1];
                    const embedSrc = `https://player.vimeo.com/video/${videoId}`;

                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: embedSrc,
                        },
                    });
                },
        };
    },
});
