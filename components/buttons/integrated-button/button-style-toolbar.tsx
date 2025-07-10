// components/buttons/integrated-button/button-style-toolbar.tsx
import React, { useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/store/use-editor-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, AlignLeft, AlignCenter, AlignRight, Ruler } from "lucide-react";
import { ButtonAlignment, ButtonColor, ButtonSize } from "@/extensions/custom-node/CustomButton";

const isCustomButtonSelected = (editor: Editor | null) => {
    if (!editor) return false;
    const { selection } = editor.state;
    const { from } = selection;

    const node = editor.state.doc.nodeAt(from);

    // If the node at the cursor is a custom button
    if (node && node.type.name === "customButton") {
        return true;
    }

    let isSelectedInNode = false;
    editor.state.doc.nodesBetween(selection.from, selection.to, (node) => {
        if (node.type.name === "customButton") {
            isSelectedInNode = true;
            return false;
        }
    });

    return isSelectedInNode;
};

export const ButtonStylesToolbar = () => {
    const { editor, activeCustomButtonNodeId, setActiveCustomButtonNodeId } = useEditorStore();

    const selectedNode = activeCustomButtonNodeId
        ? editor?.state.doc.nodeAt(
              editor.view?.posAtDOM(
                  editor.view.dom.querySelector(`[data-button-id="${activeCustomButtonNodeId}"]`) ||
                      document.body,
                  0
              )
          )
        : null;

    const currentSize = selectedNode?.attrs.buttonSize || "md";
    const currentColor = selectedNode?.attrs.buttonColor || "primary";
    const currentAlignment = selectedNode?.attrs.buttonAlignment || "left";

    const updateButton = useCallback(
        (attrs: {
            label?: string | undefined;
            buttonSize?: ButtonSize | undefined;
            buttonColor?: ButtonColor;
            buttonAlignment?: ButtonAlignment;
        }) => {
            if (editor && activeCustomButtonNodeId) {
                editor.chain().focus().updateCustomButton(attrs).run();
            }
        },
        [editor, activeCustomButtonNodeId]
    );

    const isButtonActive = isCustomButtonSelected(editor);

    useEffect(() => {
        if (!isButtonActive && activeCustomButtonNodeId) {
            setActiveCustomButtonNodeId(null);
        }
    }, [isButtonActive, activeCustomButtonNodeId, setActiveCustomButtonNodeId]);

    if (!editor || !isButtonActive) {
        return null;
    }

    return (
        <div className="flex gap-2 p-1 border rounded-md bg-white shadow-sm">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        Button Styles
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {/* SIZE SUBMENU */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Ruler className="h-4 w-4 mr-2" />
                            Size: {currentSize.toUpperCase()}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuLabel>Button Size</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateButton({ buttonSize: "sm" })}>
                                Small
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateButton({ buttonSize: "md" })}>
                                Medium
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateButton({ buttonSize: "lg" })}>
                                Large
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* COLOR SUBMENU */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Palette className="h-4 w-4 mr-2" />
                            Color: {currentColor}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuLabel>Button Color</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                "primary",
                                "secondary",
                                "destructive",
                                "outline",
                                "ghost",
                                "link",
                            ].map((color) => (
                                <DropdownMenuItem
                                    key={color}
                                    onClick={() =>
                                        updateButton({ buttonColor: color as ButtonColor })
                                    }
                                >
                                    {color.charAt(0).toUpperCase() + color.slice(1)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* ALIGNMENT SUBMENU */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            {currentAlignment === "left" && <AlignLeft className="h-4 w-4 mr-2" />}
                            {currentAlignment === "center" && (
                                <AlignCenter className="h-4 w-4 mr-2" />
                            )}
                            {currentAlignment === "right" && (
                                <AlignRight className="h-4 w-4 mr-2" />
                            )}
                            Align:{" "}
                            {currentAlignment.charAt(0).toUpperCase() + currentAlignment.slice(1)}
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuLabel>Button Alignment</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => updateButton({ buttonAlignment: "left" })}
                            >
                                <AlignLeft className="h-4 w-4 mr-2" /> Left
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateButton({ buttonAlignment: "center" })}
                            >
                                <AlignCenter className="h-4 w-4 mr-2" /> Center
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => updateButton({ buttonAlignment: "right" })}
                            >
                                <AlignRight className="h-4 w-4 mr-2" /> Right
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
