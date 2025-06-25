// TipTapExtension.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CustomToolTip } from "@/components/ui/tooltip";

import {
    AlignLeft,
    Eraser,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Undo2,
    Redo2,
    ImagePlusIcon,
    Link2,
    List,
    Table2,
    Trash2,
    Eye,
    Youtube as YoutubeIcon,
    ChevronDownIcon,
    CheckIcon,
    WrapTextIcon,
} from "lucide-react";
import {
    ALIGNMENTS,
    ALL_GOOGLE_FONTS,
    HIGHLIGHT_COLORS,
    LIST_TYPES,
    TEXT_COLORS,
} from "@/constants/editor-constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/context/ThemeContext";
import { buildGoogleFontsUrl } from "@/lib/utils";

/** Alignment Buttons */
export function AlignmentButtons({ editor }: { editor: Editor }) {
    const onSelect = useCallback(
        (align: string) => editor.chain().focus().setTextAlign(align).run(),
        [editor]
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" aria-label="Text align">
                    <AlignLeft size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        onSelect={() => onSelect(value)}
                        className="flex items-center gap-2 px-3 py-2"
                    >
                        <Icon size={16} />
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** Clear all formatting */
export function ClearFormattingButton({ editor }: { editor: Editor }) {
    const onClear = useCallback(
        () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
        [editor]
    );
    return (
        <CustomToolTip content="Clear formatting">
            <Button size="sm" variant="ghost" onClick={onClear} aria-label="Clear formatting">
                <Eraser size={18} />
            </Button>
        </CustomToolTip>
    );
}

const BATCH_SIZE = 5;

export function FontButtons({ editor }: { editor: Editor }) {
    const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
    const [selected, setSelected] = useState<string>("");
    const loadedFonts = useRef(new Set<string>());

    // Inject a <link> tag for this font if not already loaded
    const loadFont = useCallback((font: (typeof ALL_GOOGLE_FONTS)[number]) => {
        if (loadedFonts.current.has(font)) return;

        const url = buildGoogleFontsUrl(font);
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);

        loadedFonts.current.add(font);
    }, []);

    // On mount, restore from localStorage and preload first batch
    useEffect(() => {
        const stored = localStorage.getItem("tiptap-font") as
            | (typeof ALL_GOOGLE_FONTS)[number]
            | null;
        if (stored && ALL_GOOGLE_FONTS.includes(stored)) {
            setSelected(stored);
            loadFont(stored);
            editor.chain().focus().setFontFamily(stored).run();
        }

        // preload first batch
        ALL_GOOGLE_FONTS.slice(0, BATCH_SIZE).forEach(loadFont);
    }, [editor, loadFont]);

    // Whenever we expand the list, preload newly visible fonts
    useEffect(() => {
        ALL_GOOGLE_FONTS.slice(0, visibleCount).forEach(loadFont);
    }, [visibleCount, loadFont]);

    const onDefault = useCallback(() => {
        setSelected("");
        localStorage.removeItem("tiptap-font");
        editor.chain().focus().unsetFontFamily().run();
    }, [editor]);

    const commit = useCallback(
        (font: (typeof ALL_GOOGLE_FONTS)[number]) => {
            setSelected(font);
            localStorage.setItem("tiptap-font", font);
            editor.chain().focus().setFontFamily(font).run();
        },
        [editor]
    );

    const handleLoadMore = useCallback(() => {
        setVisibleCount((v) => Math.min(ALL_GOOGLE_FONTS.length, v + BATCH_SIZE));
    }, []);

    return (
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
                    <DropdownMenuItem onSelect={onDefault}>Default</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {ALL_GOOGLE_FONTS.slice(0, visibleCount).map((font) => (
                        <DropdownMenuItem
                            key={font}
                            onMouseEnter={() => loadFont(font)}
                            onSelect={() => commit(font)}
                            className={selected === font ? "font-bold" : ""}
                            style={{ fontFamily: font }}
                        >
                            {font}
                        </DropdownMenuItem>
                    ))}

                    {visibleCount < ALL_GOOGLE_FONTS.length && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={handleLoadMore}>
                                Load More…
                            </DropdownMenuItem>
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** Text formatting buttons */
export function FormattingButtons({ editor }: { editor: Editor }) {
    const onBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor]);
    const onItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor]);
    const onUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor]);
    const onStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor]);

    return (
        <div className="flex gap-1">
            <CustomToolTip content="Bold">
                <Button
                    size="sm"
                    variant={editor.isActive("bold") ? "default" : "ghost"}
                    onClick={onBold}
                    aria-label="Bold"
                >
                    <Bold size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Italic">
                <Button
                    size="sm"
                    variant={editor.isActive("italic") ? "default" : "ghost"}
                    onClick={onItalic}
                    aria-label="Italic"
                >
                    <Italic size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Underline">
                <Button
                    size="sm"
                    variant={editor.isActive("underline") ? "default" : "ghost"}
                    onClick={onUnderline}
                    aria-label="Underline"
                >
                    <Underline size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content="Strikethrough">
                <Button
                    size="sm"
                    variant={editor.isActive("strike") ? "default" : "ghost"}
                    onClick={onStrike}
                    aria-label="Strikethrough"
                >
                    <Strikethrough size={18} />
                </Button>
            </CustomToolTip>
        </div>
    );
}

/** Undo/Redo */
export function HistoryButtons({ editor }: { editor: Editor }) {
    const onUndo = useCallback(() => editor.chain().focus().undo().run(), [editor]);
    const onRedo = useCallback(() => editor.chain().focus().redo().run(), [editor]);

    return (
        <div className="flex gap-1">
            <CustomToolTip content="Undo">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onUndo}
                    disabled={!editor.can().undo()}
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
                    disabled={!editor.can().redo()}
                    aria-label="Redo"
                >
                    <Redo2 size={18} />
                </Button>
            </CustomToolTip>
        </div>
    );
}

/** Image upload */
export function ImageUploadButton({ editor }: { editor: Editor }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const onUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            editor.chain().focus().setImage({ src: url }).run();
        },
        [editor]
    );
    const openPicker = useCallback(() => inputRef.current?.click(), []);

    return (
        <CustomToolTip content="Upload image">
            <span>
                <Button size="sm" variant="ghost" onClick={openPicker} aria-label="Upload image">
                    <ImagePlusIcon size={18} />
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onUpload}
                    className="hidden"
                />
            </span>
        </CustomToolTip>
    );
}

/** Link insertion */
export function LinkButton({ editor }: { editor: Editor }) {
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);

    const getHref = useCallback(() => editor.getAttributes("link").href || "", [editor]);
    const onOpen = useCallback(
        (o: boolean) => {
            setOpen(o);
            setUrl(o && editor.isActive("link") ? getHref() : "");
        },
        [editor, getHref]
    );
    const onApply = useCallback(() => {
        let href = url.trim();
        if (href && !/^https?:\/\//i.test(href)) href = `https://${href}`;
        try {
            new URL(href);
            editor
                .chain()
                .focus()
                .toggleLink({ href: href || "" })
                .run();
            setUrl("");
            setOpen(false);
        } catch {
            alert("Invalid URL");
        }
    }, [editor, url]);
    const onRemove = useCallback(() => editor.chain().focus().unsetLink().run(), [editor]);

    return (
        <CustomToolTip content="Insert/edit link">
            <DropdownMenu open={open} onOpenChange={onOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="sm"
                        variant={editor.isActive("link") ? "default" : "ghost"}
                        aria-label="Insert or edit link"
                    >
                        <Link2 size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex gap-2">
                    <Input
                        placeholder="Paste URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-40"
                    />
                    <Button size="sm" onClick={onApply}>
                        Apply
                    </Button>
                    {editor.isActive("link") && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onRemove}
                            aria-label="Remove link"
                        >
                            <Trash2 size={16} />
                        </Button>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
}

/** List types */
export function ListButtons({ editor }: { editor: Editor }) {
    const onSelect = useCallback(
        (type: string) => {
            if (type === "bullet") editor.chain().focus().toggleBulletList().run();
            else if (type === "ordered") editor.chain().focus().toggleOrderedList().run();
            else editor.chain().focus().toggleTaskList().run();
        },
        [editor]
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                    <List size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                {LIST_TYPES.map(({ value, label, icon: Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        onSelect={() => onSelect(value)}
                        className="flex items-center gap-2 px-3 py-2"
                    >
                        <Icon size={16} />
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/** Preview */
export function PreviewButton() {
    const router = useRouter();
    const go = useCallback(() => router.push("/preview"), [router]);

    return (
        <CustomToolTip content={<p>Preview</p>}>
            <Button size="sm" variant="ghost" onClick={go}>
                <Eye size={18} />
            </Button>
        </CustomToolTip>
    );
}

/** Table insert/delete */
export function TableButtons({ editor }: { editor: Editor }) {
    const onInsert = useCallback(
        () => editor.commands.insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
        [editor]
    );
    const onDelete = useCallback(() => editor.commands.deleteTable(), [editor]);

    return (
        <div className="flex gap-1">
            <CustomToolTip content={<p>Insert Table</p>}>
                <Button size="sm" variant="ghost" onClick={onInsert}>
                    <Table2 size={18} />
                </Button>
            </CustomToolTip>
            <CustomToolTip content={<p>Delete Table</p>}>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDelete}
                    disabled={!editor.isActive("table")}
                >
                    <Trash2 size={18} />
                </Button>
            </CustomToolTip>
        </div>
    );
}

export function ColorPickerButton({ editor }: { editor: Editor }) {
    const { theme } = useTheme();

    const highlightTextColor = theme === "light" ? "#000" : "#fff";

    const activeText =
        TEXT_COLORS.find((c) => editor.isActive("textStyle", { color: c.color })) ??
        (theme === "light" ? TEXT_COLORS[0] : { color: "white" });

    const unsetText = () => editor.commands.unsetColor();
    const applyText = (color: string) => {
        editor.commands.unsetColor();
        if (color !== TEXT_COLORS[0].color) {
            editor.chain().focus().setColor(color).run();
        }
    };

    const activeHighlight =
        HIGHLIGHT_COLORS.find((c) => editor.isActive("highlight", { color: c.color })) ??
        HIGHLIGHT_COLORS[0];

    const unsetHighlight = () => editor.commands.unsetHighlight();
    const applyHighlight = (color: string) => editor.chain().focus().setHighlight({ color }).run();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-1" aria-label="Text color">
                    <span
                        className="rounded-sm px-1 font-medium"
                        style={{
                            color: activeText.color,
                            backgroundColor: activeHighlight.color,
                        }}
                    >
                        A
                    </span>
                    <ChevronDownIcon size={18} />
                </Button>
            </PopoverTrigger>

            <PopoverContent sideOffset={4} align="start" className="w-56 p-2">
                {/* Text Color Section */}
                <div className="px-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Text Color
                </div>
                {TEXT_COLORS.map(({ name, color }, idx) => (
                    <Button
                        key={name}
                        onClick={() => {
                            unsetText();
                            if (name !== "Default") applyText(color);
                        }}
                        variant="ghost"
                        className="flex w-full items-center justify-between gap-2 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-0"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="h-5 w-5 rounded-sm border flex items-center justify-center"
                                style={{
                                    color: idx === 0 ? highlightTextColor : color,
                                }}
                            >
                                A
                            </div>
                            <span>{name}</span>
                        </div>
                        {editor.isActive("textStyle", { color }) && <CheckIcon size={16} />}
                    </Button>
                ))}

                {/* Highlight Color Section */}
                <div className="mt-3 px-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Highlight Color
                </div>
                {HIGHLIGHT_COLORS.map(({ name, color }) => (
                    <Button
                        key={name}
                        onClick={() => {
                            unsetHighlight();
                            if (name !== "Default") applyHighlight(color);
                        }}
                        variant="ghost"
                        className="flex w-full items-center justify-between gap-2 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-0 "
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="h-5 w-5 rounded-sm border flex items-center justify-center"
                                style={{
                                    backgroundColor: color,
                                    color: highlightTextColor,
                                }}
                            >
                                A
                            </div>
                            <span>{name}</span>
                        </div>
                        {editor.isActive("highlight", { color }) && <CheckIcon size={16} />}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    );
}

/** YouTube embed */
export function YoutubeButton({ editor }: { editor: Editor }) {
    const [url, setUrl] = useState("");
    const [w, setW] = useState("640");
    const [h, setH] = useState("480");
    const [open, setOpen] = useState(false);

    const onApply = useCallback(() => {
        const width = Math.max(320, parseInt(w, 10)) || 640;
        const height = Math.max(180, parseInt(h, 10)) || 480;
        if (!url) return alert("Enter a valid URL");
        const bool = editor.commands.setYoutubeVideo({ src: url, width, height });
        if (!bool) editor.commands.insertVimeoVideo({ src: url });
        setUrl("");
        setW("640");
        setH("480");
        setOpen(false);
    }, [editor.commands, h, setH, setUrl, setW, url, w]);

    return (
        <CustomToolTip content={<p>YouTube</p>}>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <YoutubeIcon size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex flex-col gap-2">
                    <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="W"
                            value={w}
                            onChange={(e) => setW(e.target.value)}
                            className="w-32"
                        />
                        <Input
                            type="number"
                            placeholder="H"
                            value={h}
                            onChange={(e) => setH(e.target.value)}
                            className="w-32"
                        />
                    </div>
                    <Button size="sm" onClick={onApply}>
                        Apply
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
}

export function HardBreakButton({ editor }: { editor: Editor }) {
    const onApply = useCallback(() => {
        editor.chain().focus().setHardBreak().run();
    }, [editor]);

    return (
        <CustomToolTip content={<p>Hard Break</p>}>
            <Button size="sm" variant="ghost" onClick={onApply} aria-label="Hard Break">
                <WrapTextIcon size={18} />
            </Button>
        </CustomToolTip>
    );
}
