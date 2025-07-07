// /components/custom-node/CustomButtonNodeView.tsx
import React, { FC, useState, useEffect, useCallback, useMemo, memo } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TextCursor } from "lucide-react";
import useEditorStore from "@/store/use-editor-store";
import { NodeSelection } from "@tiptap/pm/state";

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
type ButtonAlignment = "left" | "center" | "right";

const CustomButtonNodeViewInner: FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    editor,
    getPos,
}) => {
    const [label, setLabel] = useState(node.attrs.label);
    const [editing, setEditing] = useState(false);
    const id: string = node.attrs.id;
    const size: ButtonSize = node.attrs.buttonSize;
    const color: ButtonColor = node.attrs.buttonColor;
    const align: ButtonAlignment = node.attrs.buttonAlignment;

    const { activeCustomButtonNodeId, setActiveCustomButtonNodeId } = useEditorStore();
    const isSelected = activeCustomButtonNodeId === id;
    const [popoverOpen, setPopoverOpen] = useState(false);

    useEffect(() => {
        setLabel(node.attrs.label);
    }, [node.attrs.label]);

    const apply = useCallback(() => {
        updateAttributes({ label });
        setEditing(false);
    }, [label, updateAttributes]);

    const selectNode = useCallback(() => {
        const pos = getPos();
        if (typeof pos === "number") {
            const sel = editor.state.selection;
            if (!(sel instanceof NodeSelection && sel.node.attrs.id === id)) {
                editor.commands.setNodeSelection(pos);
            }
        }
        setActiveCustomButtonNodeId(id);
        setPopoverOpen(true);
    }, [editor, getPos, id, setActiveCustomButtonNodeId]);

    const previewClick = useCallback(() => {
        console.log(id);
    }, [id]);

    const btnCls = useMemo(
        () =>
            cn(
                "inline-flex items-center justify-center gap-1 rounded-md px-3 py-1 text-sm font-medium",
                `btn-size-${size}`,
                `btn-color-${color}`
            ),
        [size, color]
    );

    const wrapperCls = useMemo(
        () =>
            cn("w-full", {
                "text-left": align === "left",
                "text-center": align === "center",
                "text-right": align === "right",
                "border-2 border-blue-500 p-1 rounded": isSelected,
            }),
        [align, isSelected]
    );

    return (
        <NodeViewWrapper className={wrapperCls} data-button-id={id} onClick={selectNode}>
            <div contentEditable={false} suppressContentEditableWarning>
                {editing ? (
                    <div className="p-2 border bg-gray-50 rounded space-y-2">
                        <input
                            className="w-full border rounded px-2 py-1"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={apply}>
                                Apply
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button className={btnCls} onClick={previewClick}>
                                {label}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="flex gap-1 p-1">
                            <Button size="icon" variant="outline" onClick={() => setEditing(true)}>
                                ✏️
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                    deleteNode();
                                    setPopoverOpen(false);
                                }}
                            >
                                🗑️
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setPopoverOpen(false)}
                            >
                                ❌
                            </Button>
                            {!isSelected && (
                                <Button size="icon" variant="outline" onClick={selectNode}>
                                    <TextCursor className="h-4 w-4" />
                                </Button>
                            )}
                        </PopoverContent>
                    </Popover>
                )}
            </div>
            <NodeViewContent />
        </NodeViewWrapper>
    );
};

export default memo(CustomButtonNodeViewInner);
