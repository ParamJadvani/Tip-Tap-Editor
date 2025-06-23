import React, { useRef, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { ImagePlusIcon } from "lucide-react";
import { CustomToolTip } from "@/components/ui/tooltip";

export const ImageUploadButton = React.memo(({ editor }: { editor: Editor }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                editor.chain().focus().setImage({ src: imageUrl }).run();
            }
        },
        [editor]
    );

    const openFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <CustomToolTip content={<p>Upload Image</p>}>
            <div>
                <Button size="sm" variant="ghost" onClick={openFileInput}>
                    <ImagePlusIcon size={18} />
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
            </div>
        </CustomToolTip>
    );
});
ImageUploadButton.displayName = "ImageUploadButton";
