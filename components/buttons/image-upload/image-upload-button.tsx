import React, { useCallback, useRef } from "react";
import { ImagePlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";
import useEditorStore from '@/store/use-editor-store';



export const ImageUploadButton = React.memo(() => {
    const { editor } = useEditorStore();
    const inputRef = useRef<HTMLInputElement>(null);
    const onUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            editor?.chain().focus().setImage({ src: url }).run();
        },
        [editor]
    );
    const openPicker = useCallback(() => inputRef.current?.click(), []);

    if (!editor) {
        return null;
    }

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
});

ImageUploadButton.displayName = "ImageUploadButton";
