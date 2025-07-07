import React, { useCallback } from "react";
import { Table2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";
import useEditorStore from '@/store/use-editor-store';


export const TableButtons = React.memo(() => {
    const { editor } = useEditorStore();
    const onInsert = useCallback(
        () => editor?.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
        [editor]
    );
    const onDelete = useCallback(() => {
        return editor?.chain().focus().deleteSelection().run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    // Disable the delete button if there's no active selection, table, image, or video
    const canDelete =
        editor.isActive("table") ||
        editor.isActive("image") ||
        editor.isActive("video") ||
        !editor.state.selection.empty;

    if (!editor) {
        return null;
    }

    return (
        <div className="flex gap-1">
            <CustomToolTip content="Insert Table">
                <Button size="sm" variant="ghost" onClick={onInsert} aria-label="Insert table">
                    <Table2 size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Remove Content">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    disabled={!canDelete}
                    aria-label="Remove content"
                >
                    <Trash2 size={18} />
                </Button>
            </CustomToolTip>
        </div>
    );
});

TableButtons.displayName = "TableButtons";
