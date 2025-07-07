import React, { useCallback } from "react";
import { Eraser } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";
import useEditorStore from '@/store/use-editor-store';


export const ClearFormattingButton =React.memo(() => {
    const { editor } = useEditorStore();
    const onClear = useCallback(
        () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
        [editor]
    );

    if (!editor) {
        return null;
    }

    return (
        <CustomToolTip content="Clear formatting">
            <Button size="sm" variant="ghost" onClick={onClear} aria-label="Clear formatting">
                <Eraser size={18} />
            </Button>
        </CustomToolTip>
    );
});

ClearFormattingButton.displayName = "ClearFormattingButton";
