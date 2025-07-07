import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomButtonNodeView from "./CustomButtonNodeView";

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
type ButtonAlignment = "left" | "center" | "right";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        customButton: {
            addCustomButton: (attrs?: {
                label?: string;
                id?: string;
                buttonSize?: ButtonSize;
                buttonColor?: ButtonColor;
                buttonAlignment?: ButtonAlignment;
            }) => ReturnType;
            updateCustomButton: (attrs: {
                label?: string;
                buttonSize?: ButtonSize;
                buttonColor?: ButtonColor;
                buttonAlignment?: ButtonAlignment;
            }) => ReturnType;
        };
    }
}

// /components/custom-node/CustomButton.ts
export const CustomButton = Node.create({
    name: "customButton",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            label: {
                default: "New Button",
                parseHTML: (el) => el.innerHTML,
                renderHTML: (attrs) => ({
                    "data-label": attrs.label || "",
                }),
            },
            id: {
                default: null,
                parseHTML: (el) => el.getAttribute("data-id"),
                renderHTML: (attrs) => ({
                    "data-id": attrs.id || "",
                }),
            },
            buttonSize: {
                default: "md" as ButtonSize,
                parseHTML: (el) => (el.getAttribute("data-size") as ButtonSize) || "md",
                renderHTML: (attrs) => ({
                    "data-size": attrs.buttonSize || "md",
                }),
            },
            buttonColor: {
                default: "primary" as ButtonColor,
                parseHTML: (el) => (el.getAttribute("data-color") as ButtonColor) || "primary",
                renderHTML: (attrs) => ({
                    "data-color": attrs.buttonColor || "primary",
                }),
            },
            buttonAlignment: {
                default: "left" as ButtonAlignment,
                parseHTML: (el) => (el.getAttribute("data-align") as ButtonAlignment) || "left",
                renderHTML: (attrs) => ({
                    "data-align": attrs.buttonAlignment || "left",
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'button[data-type="custom-button"]',
                getAttrs: (el) => ({
                    label: el.getAttribute("data-label") || "Unnamed Button",
                    id: el.getAttribute("data-id"),
                    buttonSize: (el.getAttribute("data-size") as ButtonSize) || "md",
                    buttonColor: (el.getAttribute("data-color") as ButtonColor) || "primary",
                    buttonAlignment: (el.getAttribute("data-align") as ButtonAlignment) || "left",
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const {
            "data-id": id,
            "data-label": label = "New Button",
            "data-size": size = "md",
            "data-color": color = "primary",
            "data-align": align = "left",
            style,
        } = HTMLAttributes as Record<string, string>;
        // inline style to preserve alignment on getHTML()
        const mergedStyle = `${style || ""};text-align:${align};display:inline-block`;
        return [
            "button",
            mergeAttributes(HTMLAttributes, {
                "data-type": "custom-button",
                "data-id": id,
                "data-label": label,
                "data-size": size,
                "data-color": color,
                "data-align": align,
                class: `btn btn-${size} btn-${color} btn-align-${align}`,
                style: mergedStyle,
                onclick: `console.log(${JSON.stringify(id)})`,
            }),
            label,
        ];
    },

    addCommands() {
        return {
            addCustomButton:
                (attrs = {}) =>
                ({ chain }) => {
                    return chain()
                        .insertContent({
                            type: this.name,
                            attrs: {
                                label: attrs.label,
                                id:
                                    attrs.id ??
                                    `btn-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                                buttonSize: attrs.buttonSize ?? "md",
                                buttonColor: attrs.buttonColor ?? "primary",
                                buttonAlignment: attrs.buttonAlignment ?? "left",
                            },
                        })
                        .run();
                },
            updateCustomButton:
                (attrs) =>
                ({ editor, tr }) => {
                    const { from, to, empty } = editor.state.selection;

                    if (empty) {
                        const node = editor.state.doc.nodeAt(from);
                        if (node && node.type.name === this.name) {
                            return editor.commands.setNode(this.name, {
                                ...node.attrs,
                                ...attrs,
                            });
                        }
                    }

                    let updated = false;
                    editor.state.doc.nodesBetween(from, to, (node, pos) => {
                        if (node.type.name === this.name) {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                ...attrs,
                            });
                            updated = true;
                        }
                    });

                    return updated;
                },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomButtonNodeView);
    },
});
