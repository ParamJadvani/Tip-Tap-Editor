import { Node, mergeAttributes, InputRule } from "@tiptap/core";

export interface VimeoVideoOptions {
    HTMLAttributes: Record<string, unknown>;
    width: string;
    height: string;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        vimeoVideo: {
            insertVimeoVideo: (options: { src: string,width?: string, height?: string }) => ReturnType;
        };
    }
}

const VIMEO_REGEX =
    /(?:https?:)?\/\/(?:www\.)?(?:vimeo\.com\/(?:channels\/[\w]+\/|groups\/[\w]+\/videos\/|album\/\d+\/video\/)?|player\.vimeo\.com\/video\/)(\d+)/i;

export const VimeoVideo = Node.create<VimeoVideoOptions>({
    name: "vimeoVideo",
    group: "block",
    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
            width: "640",
            height: "360",
        };
    },

    addAttributes() {
        return {
            src: { default: null },
            width: { default: this.options.width },
            height: { default: this.options.height },
        };
    },

    parseHTML() {
        return [{ tag: 'iframe[src*="player.vimeo.com/video/"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "iframe",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                frameborder: "0",
                allow: "autoplay; fullscreen",
                allowfullscreen: "",
                width: this.options.width,
                height: this.options.height,
            }),
        ];
    },

    addCommands() {
        return {
            insertVimeoVideo:
                ({ src ,width, height }) =>
                ({ commands }) => {
                    const match = VIMEO_REGEX.exec(src);
                    if (!match) return false;
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            src: `https://player.vimeo.com/video/${match[1]}`,
                            width,
                            height,
                        },
                    });
                },
        };
    },

    addInputRules() {
        return [
            new InputRule({
                find: VIMEO_REGEX,
                handler: ({ state, range, match }) => {
                    const id = match[1];
                    const { tr, schema } = state;
                    const node = schema.nodes[this.name].create({
                        src: `https://player.vimeo.com/video/${id}`,
                        width: this.options.width,
                        height: this.options.height,
                    });
                    tr.replaceWith(range.from - match[0].length, range.to, node);
                },
            }),
        ];
    },
});
