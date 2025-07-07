import React, { useState, useCallback } from "react";
import { Link2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";
import useEditorStore from '@/store/use-editor-store';


export const LinkButton = React.memo(() => {
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);
    const { editor } = useEditorStore();

    const getHref = useCallback(() => editor?.getAttributes("link").href || "", [editor]);
    const onOpenChange = useCallback(
        (o: boolean) => {
            setOpen(o);
            setUrl(o && editor?.isActive("link") ? getHref() : "");
        },
        [editor, getHref]
    );
    const onApply = useCallback(() => {
        let href = url.trim();
        if (href && !/^https?:\/\//i.test(href)) href = `https://${href}`;
        try {
            new URL(href); // Validate URL structure
            editor?.chain()
                .focus()
                .toggleLink({ href: href || "" }) // Use href || "" to unset if empty
                .run();
            setUrl("");
            setOpen(false);
        } catch {
            alert("Invalid URL. Please enter a valid URL.");
        }
    }, [editor, url]);
    const onRemove = useCallback(() => editor?.chain().focus().unsetLink().run(), [editor]);

    if (!editor) {
        return null;
    }

    return (
        <CustomToolTip content="Insert/edit link">
            <DropdownMenu open={open} onOpenChange={onOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="sm"
                        variant={editor.isActive("link") ? "default" : "ghost"}
                        aria-label="Insert or edit link"
                    >
                        <Link2 size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex gap-2 items-center">
                    <Input
                        placeholder="Paste URL"
                        value={url}
                        onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)
                        }
                        className="w-40"
                    />
                    <Button size="sm" onClick={onApply}>
                        Apply
                    </Button>
                    {editor.isActive("link") && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onRemove}
                            aria-label="Remove link"
                        >
                            <Trash2 size={16} />
                        </Button>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});

LinkButton.displayName = "LinkButton";
