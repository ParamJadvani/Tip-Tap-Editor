import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Eraser } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";

interface ClearFormattingButtonProps {
    editor: Editor;
}

export const ClearFormattingButton =({ editor }: ClearFormattingButtonProps) => {
    const onClear = useCallback(
        () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
        [editor]
    );

    return (
        <CustomToolTip content="Clear formatting">
            <Button size="sm" variant="ghost" onClick={onClear} aria-label="Clear formatting">
                <Eraser size={18} />
            </Button>
        </CustomToolTip>
    );
}
