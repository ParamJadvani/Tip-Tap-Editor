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
import { HighlighterIcon } from "lucide-react";

export const HighlightColorButton = React.memo(({ editor }: { editor: Editor }) => {
    const color = editor?.getAttributes("highlight").color || "#ffffff";

    const handleChange = useCallback(
        (color: ColorResult) => {
            editor?.chain().focus().setHighlight({ color: color.hex }).run();
        },
        [editor]
    );

    return (
        <CustomToolTip content={<p>Highlight Color</p>}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <HighlighterIcon size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    <SketchPicker color={color} onChange={handleChange} />
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
HighlightColorButton.displayName = "HighlightColorButton";
