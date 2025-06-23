import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomToolTip } from "@/components/ui/tooltip";

export const PreviewButton = React.memo(() => {
    const router = useRouter();
    const getContent = useCallback(() => router.push("/preview"), [router]);

    return (
        <CustomToolTip content={<p>Get Preview</p>}>
            <Button size="sm" variant="ghost" onClick={getContent}>
                <Eye size={18} />
            </Button>
        </CustomToolTip>
    );
});
PreviewButton.displayName = "PreviewButton";
