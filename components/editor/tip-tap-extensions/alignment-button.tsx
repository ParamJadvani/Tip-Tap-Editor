import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignLeft } from "lucide-react";
import { ALIGNMENTS } from "@/constants/editor-constants";

export const AlignmentButtons = React.memo(({ editor }: { editor: Editor }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
                <AlignLeft size={18} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm w-48">
            {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                    key={value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onSelect={() => editor.chain().focus().setTextAlign(value).run()}
                >
                    <Icon size={16} />
                    <span>{label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
));
AlignmentButtons.displayName = "AlignmentButtons";
