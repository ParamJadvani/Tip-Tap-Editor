// extensions/custom-node/CustomButton.ts
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomButtonNodeView from "./CustomButtonNodeView";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonColor = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
export type ButtonAlignment = "left" | "center" | "right";

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
                parseHTML: (el) => el.getAttribute("data-size") as ButtonSize,
                renderHTML: (attrs) => ({
                    "data-size": attrs.buttonSize || "md",
                }),
            },
            buttonColor: {
                default: "primary" as ButtonColor,
                parseHTML: (el) => el.getAttribute("data-color") as ButtonColor,
                renderHTML: (attrs) => ({
                    "data-color": attrs.buttonColor || "primary",
                }),
            },
            buttonAlignment: {
                default: "left" as ButtonAlignment,
                // parseHTML will be handled in parseHTML()
                parseHTML: () => null,
                renderHTML: (attrs) => ({
                    "data-align": attrs.buttonAlignment || "left",
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "div[data-align]",
                getAttrs: (wrapper) => {
                    const align = (wrapper.getAttribute("data-align") || "left") as ButtonAlignment;
                    const btn = wrapper.querySelector(
                        'button[data-type="custom-button"]'
                    ) as HTMLElement | null;

                    if (!btn) {
                        return false;
                    }

                    return {
                        label: btn.getAttribute("data-label") || "New Button",
                        id: btn.getAttribute("data-id"),
                        buttonSize: (btn.getAttribute("data-size") as ButtonSize) || "md",
                        buttonColor: (btn.getAttribute("data-color") as ButtonColor) || "primary",
                        buttonAlignment: align,
                    };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const align = HTMLAttributes["data-align"] || "left";

        const buttonAttrs = mergeAttributes(HTMLAttributes, {
            "data-type": "custom-button",
            "data-size": HTMLAttributes["data-size"] || "md",
            "data-color": HTMLAttributes["data-color"] || "primary",
            "data-id": HTMLAttributes["data-id"] || "",
            onclick: `console.log("Button clicked: ${HTMLAttributes["data-id"]}");`,
        });

        return [
            "div",
            { "data-align": align },
            ["button", buttonAttrs, HTMLAttributes["data-label"] || "New Button"],
        ];
    },

    addCommands() {
        return {
            addCustomButton:
                (attrs = {}) =>
                ({ chain }) =>
                    chain()
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
                        .run(),

            updateCustomButton:
                (attrs: {
                    label?: string;
                    buttonSize?: ButtonSize;
                    buttonColor?: ButtonColor;
                    buttonAlignment?: ButtonAlignment;
                }) =>
                ({ tr, dispatch, state }) => {
                    const { selection } = state;
                    const { from, to, empty } = selection;
                    let updated = false;

                    if (empty) {
                        const node = state.doc.nodeAt(from);
                        if (node && node.type.name === this.name) {
                            dispatch!(
                                tr.setNodeMarkup(from, undefined, {
                                    ...node.attrs,
                                    ...attrs,
                                })
                            );
                            return true;
                        }
                    }

                    state.doc.nodesBetween(from, to, (node, pos) => {
                        if (node.type.name === this.name) {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                ...attrs,
                            });
                            updated = true;
                        }
                    });

                    if (updated && dispatch) {
                        dispatch(tr);
                    }

                    return updated;
                },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomButtonNodeView);
    },
});
