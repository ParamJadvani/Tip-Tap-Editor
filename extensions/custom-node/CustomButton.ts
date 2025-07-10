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
                parseHTML: (element) => element.getAttribute("data-size") as ButtonSize,
                renderHTML: (attributes) => ({
                    "data-size": attributes.buttonSize || "md",
                }),
            },
            buttonColor: {
                default: "primary" as ButtonColor,
                parseHTML: (element) => element.getAttribute("data-color") as ButtonColor,
                renderHTML: (attributes) => ({
                    "data-color": attributes.buttonColor || "primary",
                }),
            },
            buttonAlignment: {
                default: "left" as ButtonAlignment,
                parseHTML: (element) => element.getAttribute("data-align") as ButtonAlignment,
                renderHTML: (attributes) => ({
                    "data-align": attributes.buttonAlignment || "left",
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'button[data-type="custom-button"]',
                getAttrs: (el) => {
                    const label = el.getAttribute("data-label") || "Unnamed Button";
                    const id = el.getAttribute("data-id");
                    const buttonSize = (el.getAttribute("data-size") as ButtonSize) || "md";
                    const buttonColor = (el.getAttribute("data-color") as ButtonColor) || "primary";
                    const buttonAlignment =
                        (el.getAttribute("data-align") as ButtonAlignment) || "left";
                    return { label, id, buttonSize, buttonColor, buttonAlignment };
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const id = HTMLAttributes["data-id"];
        const label = HTMLAttributes["data-label"] || "New Button";
        const buttonSize = HTMLAttributes["data-size"] || "md";
        const buttonColor = HTMLAttributes["data-color"] || "primary";
        const buttonAlignment = HTMLAttributes["data-align"] || "left";

        const alignmentClass = `text-${buttonAlignment}`;
        const displayClass =
            buttonAlignment === "center" || buttonAlignment === "right" ? "block" : "inline-block";

        return [
            "button",
            mergeAttributes(HTMLAttributes, {
                "data-type": "custom-button",
                "data-size": buttonSize,
                "data-color": buttonColor,
                "data-align": buttonAlignment,
                class: `${displayClass} ${alignmentClass} custom-preview-button-${buttonSize} custom-preview-button-${buttonColor}`,
                onclick: `console.log(${JSON.stringify(`Button clicked: ${id}`)});`,
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
                (attrs: {
                    label?: string;
                    buttonSize?: ButtonSize;
                    buttonColor?: ButtonColor;
                    buttonAlignment?: ButtonAlignment;
                }) =>
                ({ editor, tr }) => {
                    const { selection } = editor.state;
                    const { from, to, empty } = selection;

                    if (empty) {
                        const node = editor.state.doc.nodeAt(from);
                        if (node && node.type.name === this.name) {
                            editor.commands.setNode(this.name, { ...node.attrs, ...attrs });
                            return true;
                        }
                    }

                    let updated = false;
                    editor.state.doc.nodesBetween(from, to, (node, pos) => {
                        if (node.type.name === this.name) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...attrs });
                            updated = true;
                        }
                    });
                    if (updated) {
                        editor.view.dispatch(tr);
                    }
                    return updated;
                },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CustomButtonNodeView);
    },
});
