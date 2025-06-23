import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List } from "lucide-react";
import { LIST_TYPES } from "@/constants/editor-constants";

export const ListButtons = React.memo(({ editor }: { editor: Editor }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
                <List size={18} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm w-48">
            {LIST_TYPES.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                    key={value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onSelect={() => {
                        if (value === "bullet") editor.chain().focus().toggleBulletList().run();
                        else if (value === "ordered")
                            editor.chain().focus().toggleOrderedList().run();
                        else editor.chain().focus().toggleTaskList().run();
                    }}
                >
                    <Icon size={16} />
                    <span>{label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
));
ListButtons.displayName = "ListButtons";
