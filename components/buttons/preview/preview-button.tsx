import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";

export const PreviewButton = React.memo(() => {
    const router = useRouter();
    const go = useCallback(() => router.push("/preview"), [router]);

    return (
        <CustomToolTip content="Preview">
            <Button size="sm" variant="ghost" onClick={go} aria-label="Preview document">
                <Eye size={18} />
            </Button>
        </CustomToolTip>
    );
});

PreviewButton.displayName = "PreviewButton";
