import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";
import { LIST_TYPES } from "@/constants/editor-constants";

interface ListButtonsProps {
    editor: Editor;
}

export const ListButtons = ({ editor }: ListButtonsProps) => {
    const onSelect = useCallback(
        (type: string) => {
            if (type === "bullet") editor.chain().focus().toggleBulletList().run();
            else if (type === "ordered") editor.chain().focus().toggleOrderedList().run();
            else if (type === "task") editor.chain().focus().toggleTaskList().run(); // Ensure 'task' is handled
        },
        [editor]
    );

    return (
        <CustomToolTip content="List types">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label="List types">
                        <List size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                    {LIST_TYPES.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem
                            key={value}
                            onSelect={() => onSelect(value)}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                                editor.isActive(value === "bullet" ? "bulletList" : value === "ordered" ? "orderedList" : "taskList")
                                    ? "font-bold" // Indicate active list type
                                    : ""
                            }`}
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
