import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { CustomToolTip } from "@/components/ui/tooltip";

export const HistoryButtons = React.memo(({ editor }: { editor: Editor }) => (
    <div>
        <CustomToolTip content={<p>Undo</p>}>
            <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Redo</p>}>
            <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 size={18} />
            </Button>
        </CustomToolTip>
    </div>
));
HistoryButtons.displayName = "HistoryButtons";
