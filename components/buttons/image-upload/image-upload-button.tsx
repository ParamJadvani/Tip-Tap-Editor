import React, { useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import { ImagePlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";

interface ImageUploadButtonProps {
    editor: Editor;
}

export const ImageUploadButton = ({ editor }: ImageUploadButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const onUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            editor.chain().focus().setImage({ src: url }).run();
        },
        [editor]
    );
    const openPicker = useCallback(() => inputRef.current?.click(), []);

    return (
        <CustomToolTip content="Upload image">
            <span>
                <Button size="sm" variant="ghost" onClick={openPicker} aria-label="Upload image">
                    <ImagePlusIcon size={18} />
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="hidden"
                />
            </span>
        </CustomToolTip>
    );
}
