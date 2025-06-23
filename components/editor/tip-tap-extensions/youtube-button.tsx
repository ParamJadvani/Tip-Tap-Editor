import React, { useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomToolTip } from "@/components/ui/tooltip";
import { debounce } from "lodash";

export const YoutubeButton = React.memo(({ editor }: { editor: Editor }) => {
    const [url, setUrl] = useState("");
    const [width, setWidth] = useState("640");
    const [height, setHeight] = useState("480");
    const [isOpen, setIsOpen] = useState(false);

    const debouncedSetUrl = debounce((value: string) => setUrl(value), 300);

    const debouncedSetWidth = debounce((value: string) => setWidth(value), 300);

    const debouncedSetHeight = debounce((value: string) => setHeight(value), 300);

    const handleApply = useCallback(() => {
        const widthNum = Math.max(320, parseInt(width, 10)) || 640;
        const heightNum = Math.max(180, parseInt(height, 10)) || 480;

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: widthNum,
                height: heightNum,
            });
            setUrl("");
            setWidth("640");
            setHeight("480");
            setIsOpen(false);
        } else {
            alert("Please enter a valid YouTube URL");
        }
    }, [editor, url, width, height]);

    return (
        <CustomToolTip content={<p>Embed YouTube Video</p>}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <Youtube size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex flex-col gap-2">
                    <Input
                        placeholder="Paste YouTube URL"
                        value={url}
                        onChange={(e) => debouncedSetUrl(e.target.value)}
                        className="w-64"
                    />
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Width"
                            value={width}
                            onChange={(e) => debouncedSetWidth(e.target.value)}
                            min="320"
                            max="1024"
                            className="w-32"
                        />
                        <Input
                            type="number"
                            placeholder="Height"
                            value={height}
                            onChange={(e) => debouncedSetHeight(e.target.value)}
                            min="180"
                            max="720"
                            className="w-32"
                        />
                    </div>
                    <Button size="sm" onClick={handleApply}>
                        Apply
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
YoutubeButton.displayName = "YoutubeButton";
