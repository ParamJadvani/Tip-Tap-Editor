// components/buttons/integrated-button/button-style-toolbar.tsx
import React, { FC, useCallback, useMemo, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import useEditorStore from "@/store/use-editor-store";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Palette, AlignLeft, AlignCenter, AlignRight, Ruler } from "lucide-react";
import { NodeSelection } from "prosemirror-state";

const SIZE_OPTIONS = ["sm", "md", "lg"] as const;
const COLOR_OPTIONS = ["primary", "secondary", "destructive", "outline", "ghost", "link"] as const;
const ALIGN_OPTIONS = ["left", "center", "right"] as const;

type ButtonAttrs = {
    id: string;
    buttonSize: (typeof SIZE_OPTIONS)[number];
    buttonColor: (typeof COLOR_OPTIONS)[number];
    buttonAlignment: (typeof ALIGN_OPTIONS)[number];
};

const isCustomButtonSelected = (editor: Editor | null): boolean => {
    if (!editor) return false;
    const { selection } = editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === "customButton") {
        return true;
    }
    const direct = editor.state.doc.nodeAt(selection.from);
    if (direct?.type.name === "customButton") return true;
    const $from = selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === "customButton") return true;
    }
    return false;
};

export const ButtonStylesToolbar: FC = React.memo(() => {
    const { editor, activeCustomButtonNodeId, setActiveCustomButtonNodeId } = useEditorStore(
        (s) => s
    );

    const isActive = useMemo(() => isCustomButtonSelected(editor), [activeCustomButtonNodeId]);

    useEffect(() => {
        if (!isActive && activeCustomButtonNodeId) {
            setActiveCustomButtonNodeId(null);
        }
    }, [isActive, activeCustomButtonNodeId, setActiveCustomButtonNodeId]);

    const attrs = useMemo<ButtonAttrs | null>(() => {
        if (!editor || !activeCustomButtonNodeId) return null;
        let found: ButtonAttrs | null = null;
        editor.state.doc.descendants((node) => {
            if (node.type.name === "customButton" && node.attrs.id === activeCustomButtonNodeId) {
                found = node.attrs as ButtonAttrs;
                return false;
            }
            return true;
        });
        return found;
    }, [editor, activeCustomButtonNodeId]);

    const update = useCallback(
        (patch: Partial<ButtonAttrs>) => {
            if (!editor) return;
            editor.chain().focus().updateCustomButton(patch).run();
        },
        [editor]
    );

    if (!editor || !isActive || !attrs) return null;

    const { buttonSize, buttonColor, buttonAlignment } = attrs;

    return (
        <div className="flex gap-2 p-1 border rounded-md bg-white shadow-sm">
            <span className="text-sm font-medium mr-2 self-center">Button Styles:</span>

            {/* Size */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Ruler className="h-4 w-4 mr-2" />
                        Size: {buttonSize.toUpperCase()}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Button Size</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {SIZE_OPTIONS.map((size) => (
                        <DropdownMenuItem key={size} onClick={() => update({ buttonSize: size })}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Color */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Palette className="h-4 w-4 mr-2" />
                        Color: {buttonColor}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Button Color</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {COLOR_OPTIONS.map((color) => (
                        <DropdownMenuItem
                            key={color}
                            onClick={() => update({ buttonColor: color })}
                        >
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Alignment */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        {buttonAlignment === "left" && <AlignLeft className="h-4 w-4 mr-2" />}
                        {buttonAlignment === "center" && <AlignCenter className="h-4 w-4 mr-2" />}
                        {buttonAlignment === "right" && <AlignRight className="h-4 w-4 mr-2" />}
                        Align: {buttonAlignment.charAt(0).toUpperCase() + buttonAlignment.slice(1)}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Button Alignment</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {ALIGN_OPTIONS.map((align) => (
                        <DropdownMenuItem
                            key={align}
                            onClick={() => update({ buttonAlignment: align })}
                        >
                            {align.charAt(0).toUpperCase() + align.slice(1)}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
});

ButtonStylesToolbar.displayName = "ButtonStylesToolbar";
