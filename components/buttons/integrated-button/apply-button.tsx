import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useEditorStore from "@/store/use-editor-store";

export const ApplyButton = () => {
    const editor = useEditorStore((state) => state.editor);
    const [label, setLabel] = useState("New Custom Button");
    const [open, setOpen] = useState(false);

    const add = useCallback(() => {
        if (!editor) return;
        editor.chain().focus().addCustomButton({ label }).run();
        setLabel("New Custom Button");
        setOpen(false);
    }, [editor, label]);

    if (!editor) {
        return null;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button>Add Custom Button</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
                <Label htmlFor="btn-label">Label</Label>
                <Input
                    id="btn-label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="mb-4"
                />
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button size="sm" onClick={add}>
                        Add
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
