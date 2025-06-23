import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FONT_FAMILIES } from "@/constants/editor-constants";

export const FontButtons = React.memo(({ editor }: { editor: Editor }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="gap-1">
                Font Family
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm w-48">
            <DropdownMenuItem
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onSelect={() => editor.chain().focus().unsetFontFamily().run()}
            >
                Default
            </DropdownMenuItem>
            {FONT_FAMILIES.map((family) => (
                <DropdownMenuItem
                    key={family.value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onSelect={() => editor.chain().focus().setFontFamily(family.value).run()}
                >
                    {family.label}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
));
FontButtons.displayName = "FontButtons";
