import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { AlignLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";
import { ALIGNMENTS } from "@/constants/editor-constants";

interface AlignmentButtonsProps {
    editor: Editor;
}

export const AlignmentButtons = ({ editor }: AlignmentButtonsProps) => {
    const onSelect = useCallback(
        (align: string) => editor.chain().focus().setTextAlign(align).run(),
        [editor]
    );

    return (
        <CustomToolTip content="Text alignment">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label="Text align">
                        <AlignLeft size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={value}
                            onSelect={() => onSelect(value)}
                            className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                        >
                            <Icon size={16} />
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
}
