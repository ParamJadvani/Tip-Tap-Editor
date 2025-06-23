import React, { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomToolTip } from "@/components/ui/tooltip";
import { debounce } from "lodash";

export const LinkButton = React.memo(({ editor }: { editor: Editor }) => {
    const [url, setUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const getCurrentLink = useCallback(() => {
        const linkAttrs = editor.getAttributes("link");
        return linkAttrs.href || "";
    }, [editor]);

    const debouncedSetUrl = debounce((value: string) => setUrl(value), 300);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);
            if (open && editor.isActive("link")) {
                setUrl(getCurrentLink());
            } else {
                setUrl("");
            }
        },
        [editor, getCurrentLink]
    );

    const handleApply = useCallback(() => {
        let finalUrl = url.trim();
        if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
            finalUrl = `https://${finalUrl}`;
        }
        try {
            new URL(finalUrl);
            if (finalUrl) {
                editor?.chain().focus().toggleLink({ href: finalUrl }).run();
            } else {
                editor?.chain().focus().unsetLink().run();
            }
            setUrl("");
            setIsOpen(false);
        } catch {
            alert("Please enter a valid URL");
        }
    }, [editor, url]);

    return (
        <CustomToolTip content={<p>Insert/Edit Link</p>}>
            <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant={editor?.isActive("link") ? "secondary" : "ghost"}>
                        <Link2 size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex items-center gap-2">
                    <Input
                        placeholder="Paste or type URL"
                        value={url}
                        onChange={(e) => debouncedSetUrl(e.target.value)}
                        className="w-40"
                    />
                    <Button size="sm" onClick={handleApply}>
                        Apply
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
LinkButton.displayName = "LinkButton";
