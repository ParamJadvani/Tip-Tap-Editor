import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";

const createHoverMenu = (view: EditorView, pos: number) => {
    const menu = document.createElement("div");
    menu.classList.add("hover-menu");

    const plusButton = document.createElement("button");
    plusButton.setAttribute("title", "Add line below");
    plusButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
    plusButton.onclick = (e) => {
        e.preventDefault();
        const { state, dispatch } = view;
        const node = state.doc.nodeAt(pos);
        if (!node) return;

        const endPos = pos + node.nodeSize;
        dispatch(state.tr.insert(endPos, state.schema.nodes.paragraph.create()));
        view.focus();
    };

    menu.appendChild(plusButton);

    return menu;
};

const hoverPluginKey = new PluginKey("hover");

export const HoverExtension = Extension.create({
    name: "hoverExtension",

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: hoverPluginKey,
                state: {
                    init: () => ({ pos: null }),
                    apply: (tr, value) => {
                        const meta = tr.getMeta(hoverPluginKey);
                        if (meta) {
                            return meta;
                        }

                        if (tr.docChanged) {
                            return { pos: null };
                        }

                        return value;
                    },
                },
                props: {
                    decorations: (state) => {
                        const pluginState = hoverPluginKey.getState(state);

                        if (pluginState?.pos !== null) {
                            return DecorationSet.create(state.doc, [
                                Decoration.widget(pluginState.pos, (view, getPos) =>
                                    createHoverMenu(view, getPos() as number)
                                ),
                            ]);
                        }
                        return null;
                    },
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            const target = event.target as HTMLElement;
                            // Check if the event target is within a paragraph, but not within the hover-menu itself
                            const element = target.closest("p");
                            const isInsideHoverMenu = target.closest(".hover-menu");

                            if (!element || isInsideHoverMenu) {
                                return false;
                            }

                            const pos = view.posAtDOM(element, 0);
                            const currentPos = hoverPluginKey.getState(view.state)?.pos;

                            if (pos !== undefined && pos !== null && pos !== currentPos) {
                                view.dispatch(view.state.tr.setMeta(hoverPluginKey, { pos }));
                            }

                            return false;
                        },
                        mouseleave: (view, event) => {
                            const currentPos = hoverPluginKey.getState(view.state)?.pos;
                            if (currentPos === null) {
                                return false;
                            }

                            const relatedTarget = event.relatedTarget as HTMLElement;
                            // If the mouse leaves the editor or enters an element that's part of the editor but not the hover area
                            // We need to be careful not to hide the menu if the mouse moves from paragraph to its own hover menu
                            if (!relatedTarget || !view.dom.contains(relatedTarget) || relatedTarget.closest(".hover-menu")) {
                                return false; // Don't hide if moving to related targets within editor or its own menu
                            }

                            // If mouse truly leaves the paragraph area that triggers the menu
                            const target = event.target as HTMLElement;
                            if (!target.closest("p")) {
                                view.dispatch(view.state.tr.setMeta(hoverPluginKey, { pos: null }));
                            }
                            return false;
                        },
                    },
                },
            }),
        ];
    },

    addGlobalAttributes() {
        return [
            {
                types: ["paragraph", "heading"], // Apply to headings as well for consistent drag
                attributes: {
                    "data-draggable": {
                        default: false, // Default to false
                        parseHTML: (element) => element.getAttribute("data-draggable") === "true",
                        renderHTML: (attributes) => {
                            return {
                                "data-draggable": attributes["data-draggable"] ? "true" : null,
                            };
                        },
                    },
                },
            },
        ];
    },
});
