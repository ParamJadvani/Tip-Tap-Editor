import React from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Table2, Trash2 } from "lucide-react";
import { CustomToolTip } from "@/components/ui/tooltip";

export const TableButtons = React.memo(({ editor }: { editor: Editor }) => (
    <div>
        <CustomToolTip content={<p>Insert Table</p>}>
            <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                    editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                }
            >
                <Table2 size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Delete Table</p>}>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.commands.deleteTable()}
                disabled={!editor.isActive("table")}
            >
                <Trash2 size={18} />
            </Button>
        </CustomToolTip>
    </div>
));
TableButtons.displayName = "TableButtons";
