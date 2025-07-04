import React, { useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Undo2, Redo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";

interface HistoryButtonsProps {
    editor: Editor;
}

export const HistoryButtons = ({ editor }: HistoryButtonsProps) => {
    const onUndo = useCallback(() => editor.chain().focus().undo().run(), [editor]);
    const onRedo = useCallback(() => editor.chain().focus().redo().run(), [editor]);

    return (
        <div className="flex gap-1">
            <CustomToolTip content="Undo">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onUndo}
                    // disabled={!editor.can().undo()}
                    aria-label="Undo"
                >
                    <Undo2 size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Redo">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRedo}
                    // disabled={!editor.can().redo()}
                    aria-label="Redo"
                >
                    <Redo2 size={18} />
                </Button>
            </CustomToolTip>
        </div>
    );
}
