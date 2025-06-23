import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";
import React, { useCallback } from "react";
import { ColorResult, SketchPicker } from "react-color";
import { Editor } from "@tiptap/react";

export const TextColorButton = React.memo(({ editor }: { editor: Editor }) => {
    const color = editor?.getAttributes("textStyle").color || "#000000";

    const handleChange = useCallback(
        (color: ColorResult) => {
            editor?.chain().focus().setColor(color.hex).run();
        },
        [editor]
    );

    return (
        <CustomToolTip content={<p>Text Color</p>}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <span className="text-xs">A</span>
                        <div className="h-1 w-4" style={{ backgroundColor: color }} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    <SketchPicker color={color} onChange={handleChange} />
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
TextColorButton.displayName = "TextColorButton";
