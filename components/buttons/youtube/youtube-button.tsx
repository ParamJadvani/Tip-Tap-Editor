import React, { useState, useCallback } from "react";
import { Youtube as YoutubeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";
import useEditorStore from '@/store/use-editor-store';
import { toast } from 'sonner';


export const YoutubeButton = React.memo(() => {
    const [url, setUrl] = useState("");
    const [width, setWidth] = useState("640");
    const [height, setHeight] = useState("480");
    const [open, setOpen] = useState(false);
    const { editor } = useEditorStore();

    const onApply = useCallback(() => {
        const parsedWidth = Math.max(320, (Number(width), 10)) || 640;
        const parsedHeight = Math.max(180, (Number(height), 10)) || 480;

        if (!url || !url.trim()) {
            toast.error("Please enter a valid YouTube or Vimeo URL.");
            return;
        }

        // Attempt to set YouTube video
        const success = editor?.commands.setYoutubeVideo({ src: url, width: parsedWidth, height: parsedHeight });

        // If not a YouTube video, try Vimeo (if you have Vimeo extension enabled)
        if (!success) {
            const success = editor?.commands.insertVimeoVideo({ src: url, width: parsedWidth.toString(), height: parsedHeight.toString() });
            setUrl("");
            setWidth("640");
            setHeight("480");
            setOpen(false);

            if (!success) {
                toast.error("Please enter a valid YouTube or Vimeo URL.");
            }
        }

        if (success) {
            setUrl("");
            setWidth("640");
            setHeight("480");
            setOpen(false);
        }
    }, [editor?.commands, url, width, height]);

    if (!editor) {
        return null;
    }

    return (
        <CustomToolTip content="Embed YouTube video">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label="Embed YouTube video">
                        <YoutubeIcon size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex flex-col gap-2">
                    <Input
                        placeholder="YouTube/Vimeo URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Width"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="w-32"
                        />
                        <Input
                            type="number"
                            placeholder="Height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-32"
                        />
                    </div>
                    <Button size="sm" onClick={onApply}>
                        Embed Video
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});

YoutubeButton.displayName = "YoutubeButton";
