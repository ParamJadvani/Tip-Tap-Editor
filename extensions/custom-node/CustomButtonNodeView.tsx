// extensions/custom-node/CustomButtonNodeView.tsx
import React, { FC, useState, useEffect, useCallback, useMemo } from "react";
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useEditorStore from "@/store/use-editor-store";
import { cn } from "@/lib/utils";

type ButtonSize = "sm" | "md" | "lg";
type ButtonColor = "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link";
type ButtonAlignment = "left" | "center" | "right";

const CustomButtonNodeView: FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    editor,
    getPos,
}) => {
    const [label, setLabel] = useState(node.attrs.label);
    const [isEditing, setIsEditing] = useState(false);
    const id: string = node.attrs.id;
    const buttonSize: ButtonSize = node.attrs.buttonSize;
    const buttonColor: ButtonColor = node.attrs.buttonColor;
    const buttonAlignment: ButtonAlignment = node.attrs.buttonAlignment;

    const { activeCustomButtonNodeId, setActiveCustomButtonNodeId } = useEditorStore();
    const isSelected = activeCustomButtonNodeId === id;

    const [isControlsPopoverOpen, setIsControlsPopoverOpen] = useState(false);

    useEffect(() => {
        setLabel(node.attrs.label);
        if (!isEditing) {
            setIsEditing(false);
        }
    }, [
        node.attrs.label,
        node.attrs.buttonSize,
        node.attrs.buttonColor,
        node.attrs.buttonAlignment,
        isEditing,
    ]);

    const applyLabelChange = useCallback(() => {
        updateAttributes({ label });
        setIsEditing(false);
    }, [label, updateAttributes]);

    const handlePreviewClick = useCallback(() => {
        console.log(`Button clicked (NodeView): ${id}`);
    }, [id]);

    const handleNodeClick = useCallback(() => {
        setActiveCustomButtonNodeId(id);
        const pos = getPos();
        if (typeof pos === "number" && pos !== -1) {
            editor.commands.setNodeSelection(pos);
        }
    }, [id, setActiveCustomButtonNodeId, editor, getPos]);

    const buttonClassNames = useMemo(() => {
        const baseClasses =
            "custom-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

        const sizeClasses = {
            sm: "h-8 px-3 text-xs",
            md: "h-9 px-4 py-2",
            lg: "h-10 px-8",
        };

        const colorClasses = {
            primary: "bg-[#0f172a] text-[#f9fafb] shadow hover:bg-[#0f172a]/90",
            secondary: "bg-[#f9fafb] text-[#0f172a] shadow-sm hover:bg-[#f9fafb]/80",
            destructive: "bg-[#ef4444]  text-[#f9fafb] shadow-sm hover:bg-destructive/90",
            outline:
                "border border-input bg-white text-[#0f172a] shadow-sm hover:bg-accent hover:text text-[#0f172a]",
            ghost: "hover:bg-[#f1f5f9] hover:text-[#0f172a] text-[#0f172a] bg-transparent",
            link: "text-[#0f172a] underline-offset-4 hover:underline hover:bg-transparent bg-transparent",
        };

        const alignWrapperClasses = {
            left: "text-left",
            center: "text-center",
            right: "text-right",
        };

        return {
            button: cn(baseClasses, sizeClasses[buttonSize], colorClasses[buttonColor]),
            wrapper: cn("w-full", alignWrapperClasses[buttonAlignment], {
                "border-2 border-blue-500 rounded-md p-1": isSelected,
            }),
        };
    }, [buttonSize, buttonColor, buttonAlignment, isSelected]);

    return (
        <NodeViewWrapper
            className={buttonClassNames.wrapper}
            data-button-id={id}
            onClick={handleNodeClick}
        >
            <div contentEditable={false} suppressContentEditableWarning>
                {isEditing ? (
                    <div className="p-2 border bg-gray-50 rounded space-y-2">
                        <input
                            className="w-full border rounded px-2 py-1"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={applyLabelChange}>
                                Apply
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Popover open={isControlsPopoverOpen} onOpenChange={setIsControlsPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                onClick={handlePreviewClick}
                                className={buttonClassNames.button}
                                data-size={buttonSize}
                                data-color={buttonColor}
                                data-align={buttonAlignment}
                            >
                                {label}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto flex space-x-1 p-1"
                            side="top"
                            align="center"
                        >
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(true);
                                    setIsControlsPopoverOpen(false);
                                }}
                            >
                                ✏️
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => {
                                    deleteNode();
                                    setIsControlsPopoverOpen(false);
                                }}
                            >
                                🗑️
                            </Button>
                        </PopoverContent>
                    </Popover>
                )}
            </div>
            <NodeViewContent style={{ display: "none" }} />
        </NodeViewWrapper>
    );
};

export default CustomButtonNodeView;
