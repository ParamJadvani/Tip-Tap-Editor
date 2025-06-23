import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { CustomToolTip } from "@/components/ui/tooltip";

export const ClearFormattingButton = React.memo(({ editor }: { editor: Editor }) => (
    <CustomToolTip content={<p>Clear Formatting</p>}>
        <Button
            size="sm"
            variant="ghost"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
            <Eraser size={18} />
        </Button>
    </CustomToolTip>
));
ClearFormattingButton.displayName = "ClearFormattingButton";
