import React, { useState, useCallback, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";
import { ALL_GOOGLE_FONTS, FontName } from "@/constants/editor-constants";
import { buildGoogleFontsUrl } from "@/lib/utils";
import useEditorStore from '@/store/use-editor-store';

const BATCH_SIZE = 5;

export const FontButtons = React.memo(() => {
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const [selected, setSelected] = useState<string>("");
    const loadedFonts = useRef(new Set<string>());

    const { editor } = useEditorStore();

    const loadFont = useCallback((font: string) => {
        if (loadedFonts.current.has(font)) return;

        const url = buildGoogleFontsUrl(font);
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);

        loadedFonts.current.add(font);
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("tiptap-font") as string | null;
        if (stored && ALL_GOOGLE_FONTS.includes(stored as FontName)) {
            setSelected(stored);
            loadFont(stored);
            editor?.chain().focus().setFontFamily(stored).run();
        }

        ALL_GOOGLE_FONTS.slice(0, BATCH_SIZE).forEach(loadFont);
    }, [editor, loadFont]);

    useEffect(() => {
        ALL_GOOGLE_FONTS.slice(0, visibleCount).forEach(loadFont);
    }, [visibleCount, loadFont]);

    const onDefault = useCallback(() => {
        setSelected("");
        localStorage.removeItem("tiptap-font");
        editor?.chain().focus().unsetFontFamily().run();
    }, [editor]);

    const commit = useCallback(
        (font: string) => {
            setSelected(font);
            localStorage.setItem("tiptap-font", font);
            editor?.chain().focus().setFontFamily(font).run();
        },
        [editor]
    );

    const handleLoadMore = useCallback(() => {
        setVisibleCount((v) => Math.min(ALL_GOOGLE_FONTS.length, v + BATCH_SIZE));
    }, []);

    if (!editor) {
        return null;
    }

    return (
        <CustomToolTip content="Font family">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" aria-label="Font family">
                        Font
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 p-0">
                    <div
                        className="max-h-60 overflow-y-auto overflow-x-hidden"
                        onScroll={(e) => {
                            const el = e.currentTarget;
                            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
                                handleLoadMore();
                            }
                        }}
                    >
                        <DropdownMenuItem
                            onSelect={onDefault}
                            className="cursor-pointer"
                        >
                            Default
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        {ALL_GOOGLE_FONTS.slice(0, visibleCount).map((font) => (
                            <DropdownMenuItem
                                key={font}
                                onMouseEnter={() => loadFont(font)}
                                onSelect={() => commit(font)}
                                className={`${selected === font ? "font-bold" : ""} cursor-pointer`}
                                style={{ fontFamily: font }}
                            >
                                {font}
                            </DropdownMenuItem>
                        ))}

                        {visibleCount < ALL_GOOGLE_FONTS.length && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={handleLoadMore}
                                    className="cursor-pointer"
                                >
                                    Load More…
                                </DropdownMenuItem>
                            </>
                        )}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
})

FontButtons.displayName = "FontButtons";
