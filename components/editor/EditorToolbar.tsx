import React, { useState, useRef, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Highlighter,
    Link2,
    List,
    Minus,
    Quote,
    Undo2,
    Redo2,
    Table2,
    Trash2,
    Eraser,
    AlignLeft,
    ImagePlusIcon,
    Youtube,
    Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SketchPicker, ColorResult } from "react-color";
import { ALIGNMENTS, FONT_FAMILIES, HEADINGS, LIST_TYPES } from "@/constants/editor-constants";
import { Level } from "@tiptap/extension-heading";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CustomToolTip, TooltipProvider } from "@/components/ui/tooltip";
import { useTheme } from "@/context/ThemeContext";
import { debounce } from "lodash";

const TextColorButton = React.memo(({ editor }: { editor: Editor }) => {
    const color = editor?.getAttributes("textStyle").color || "#000000";

    const handleChange = useCallback(
        (color: ColorResult) => {
            editor?.chain().focus().setColor(color.hex).run();
        },
        [editor]
    );

    return (
        <CustomToolTip content={<p>Text Color</p>}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <span className="text-xs">A</span>
                        <div className="h-1 w-4" style={{ backgroundColor: color }} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    <SketchPicker color={color} onChange={handleChange} />
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
TextColorButton.displayName = "TextColorButton";

const HighlightColorButton = React.memo(({ editor }: { editor: Editor }) => {
    const color = editor?.getAttributes("highlight").color || "#ffffff";

    const handleChange = useCallback(
        (color: ColorResult) => {
            editor?.chain().focus().setHighlight({ color: color.hex }).run();
        },
        [editor]
    );

    return (
        <CustomToolTip content={<p>Highlight Color</p>}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <Highlighter size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0">
                    <SketchPicker color={color} onChange={handleChange} />
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
HighlightColorButton.displayName = "HighlightColorButton";

const LinkButton = React.memo(({ editor }: { editor: Editor }) => {
    const [url, setUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const getCurrentLink = useCallback(() => {
        const linkAttrs = editor.getAttributes("link");
        return linkAttrs.href || "";
    }, [editor]);

    const debouncedSetUrl = useCallback(
        debounce((value: string) => setUrl(value), 300),
        []
    );

    const handleOpenChange = useCallback(
        (open: boolean) => {
            setIsOpen(open);
            if (open && editor.isActive("link")) {
                setUrl(getCurrentLink());
            } else {
                setUrl("");
            }
        },
        [editor, getCurrentLink]
    );

    const handleApply = useCallback(() => {
        let finalUrl = url.trim();
        if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
            finalUrl = `https://${finalUrl}`;
        }
        try {
            new URL(finalUrl);
            if (finalUrl) {
                editor?.chain().focus().toggleLink({ href: finalUrl }).run();
            } else {
                editor?.chain().focus().unsetLink().run();
            }
            setUrl("");
            setIsOpen(false);
        } catch {
            alert("Please enter a valid URL");
        }
    }, [editor, url]);

    return (
        <CustomToolTip content={<p>Insert/Edit Link</p>}>
            <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant={editor?.isActive("link") ? "secondary" : "ghost"}>
                        <Link2 size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex items-center gap-2">
                    <Input
                        placeholder="Paste or type URL"
                        value={url}
                        onChange={(e) => debouncedSetUrl(e.target.value)}
                        className="w-40"
                    />
                    <Button size="sm" onClick={handleApply}>
                        Apply
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
LinkButton.displayName = "LinkButton";

const ImageUploadButton = React.memo(({ editor }: { editor: Editor }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                editor.chain().focus().setImage({ src: imageUrl }).run();
            }
        },
        [editor]
    );

    const openFileInput = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <CustomToolTip content={<p>Upload Image</p>}>
            <div>
                <Button size="sm" variant="ghost" onClick={openFileInput}>
                    <ImagePlusIcon size={18} />
                </Button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
            </div>
        </CustomToolTip>
    );
});
ImageUploadButton.displayName = "ImageUploadButton";

const YoutubeButton = React.memo(({ editor }: { editor: Editor }) => {
    const [url, setUrl] = useState("");
    const [width, setWidth] = useState("640");
    const [height, setHeight] = useState("480");
    const [isOpen, setIsOpen] = useState(false);

    const debouncedSetUrl = debounce((value: string) => setUrl(value), 300);

    const debouncedSetWidth = debounce((value: string) => setWidth(value), 300);

    const debouncedSetHeight = debounce((value: string) => setHeight(value), 300);

    const handleApply = useCallback(() => {
        const widthNum = Math.max(320, parseInt(width, 10)) || 640;
        const heightNum = Math.max(180, parseInt(height, 10)) || 480;

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: widthNum,
                height: heightNum,
            });
            setUrl("");
            setWidth("640");
            setHeight("480");
            setIsOpen(false);
        } else {
            alert("Please enter a valid YouTube URL");
        }
    }, [editor, url, width, height]);

    return (
        <CustomToolTip content={<p>Embed YouTube Video</p>}>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                        <Youtube size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 flex flex-col gap-2">
                    <Input
                        placeholder="Paste YouTube URL"
                        value={url}
                        onChange={(e) => debouncedSetUrl(e.target.value)}
                        className="w-64"
                    />
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            placeholder="Width"
                            value={width}
                            onChange={(e) => debouncedSetWidth(e.target.value)}
                            min="320"
                            max="1024"
                            className="w-32"
                        />
                        <Input
                            type="number"
                            placeholder="Height"
                            value={height}
                            onChange={(e) => debouncedSetHeight(e.target.value)}
                            min="180"
                            max="720"
                            className="w-32"
                        />
                    </div>
                    <Button size="sm" onClick={handleApply}>
                        Apply
                    </Button>
                </DropdownMenuContent>
            </DropdownMenu>
        </CustomToolTip>
    );
});
YoutubeButton.displayName = "YoutubeButton";

const HistoryButtons = React.memo(({ editor }: { editor: Editor }) => (
    <>
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
    </>
));
HistoryButtons.displayName = "HistoryButtons";

const FormattingButtons = React.memo(({ editor }: { editor: Editor }) => (
    <>
        <CustomToolTip content={<p>Bold</p>}>
            <Button
                size="sm"
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Italic</p>}>
            <Button
                size="sm"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Underline</p>}>
            <Button
                size="sm"
                variant={editor.isActive("underline") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline size={18} />
            </Button>
        </CustomToolTip>
        <CustomToolTip content={<p>Strikethrough</p>}>
            <Button
                size="sm"
                variant={editor.isActive("strike") ? "secondary" : "ghost"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough size={18} />
            </Button>
        </CustomToolTip>
    </>
));
FormattingButtons.displayName = "FormattingButtons";

const ListButtons = React.memo(({ editor }: { editor: Editor }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
                <List size={18} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm w-48">
            {LIST_TYPES.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                    key={value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onSelect={() => {
                        if (value === "bullet") editor.chain().focus().toggleBulletList().run();
                        else if (value === "ordered")
                            editor.chain().focus().toggleOrderedList().run();
                        else editor.chain().focus().toggleTaskList().run();
                    }}
                >
                    <Icon size={16} />
                    <span>{label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
));
ListButtons.displayName = "ListButtons";

const AlignmentButtons = React.memo(({ editor }: { editor: Editor }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
                <AlignLeft size={18} />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm w-48">
            {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                    key={value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                    onSelect={() => editor.chain().focus().setTextAlign(value).run()}
                >
                    <Icon size={16} />
                    <span>{label}</span>
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
));
AlignmentButtons.displayName = "AlignmentButtons";

const FontButtons = React.memo(({ editor }: { editor: Editor }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="gap-1">
                Font Family
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm w-48">
            <DropdownMenuItem
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onSelect={() => editor.chain().focus().unsetFontFamily().run()}
            >
                Default
            </DropdownMenuItem>
            {FONT_FAMILIES.map((family) => (
                <DropdownMenuItem
                    key={family.value}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onSelect={() => editor.chain().focus().setFontFamily(family.value).run()}
                >
                    {family.label}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
));
FontButtons.displayName = "FontButtons";

const TableButtons = React.memo(({ editor }: { editor: Editor }) => (
    <>
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
    </>
));
TableButtons.displayName = "TableButtons";

const ClearFormattingButton = React.memo(({ editor }: { editor: Editor }) => (
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

const PreviewButton = React.memo(() => {
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

export const EditorToolbar = ({ editor }: { editor: Editor }) => {
    const { theme, toggleTheme } = useTheme();

    const setHeading = useCallback(
        (value: string) => {
            if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
            } else {
                const level = Number(value.replace("h", "")) as Level;
                editor.chain().focus().setNode("heading", { level }).run();
            }
        },
        [editor]
    );
    if (!editor) return null;

    return (
        <TooltipProvider>
            <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                <CustomToolTip content={<p>Toggle Theme</p>}>
                    <Button size="sm" variant="ghost" onClick={toggleTheme}>
                        {theme === "light" ? "🌙" : "☀️"}
                    </Button>
                </CustomToolTip>
                <HistoryButtons editor={editor} />
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <Select onValueChange={setHeading} defaultValue="paragraph">
                    <SelectTrigger className="py-2 px-3 w-40">
                        <SelectValue placeholder="Heading" />
                    </SelectTrigger>
                    <SelectContent>
                        {HEADINGS.map(({ value, label, icon: Icon }) => (
                            <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                    <Icon size={16} />
                                    <span>{label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <FormattingButtons editor={editor} />
                <TextColorButton editor={editor} />
                <HighlightColorButton editor={editor} />
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <ListButtons editor={editor} />
                <AlignmentButtons editor={editor} />
                <CustomToolTip content={<p>Code</p>}>
                    <Button
                        size="sm"
                        variant={editor.isActive("code") ? "secondary" : "ghost"}
                        onClick={() => editor.chain().focus().toggleCode().run()}
                    >
                        <Code size={18} />
                    </Button>
                </CustomToolTip>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <LinkButton editor={editor} />
                <CustomToolTip content={<p>Blockquote</p>}>
                    <Button
                        size="sm"
                        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote size={18} />
                    </Button>
                </CustomToolTip>
                <CustomToolTip content={<p>Horizontal Rule</p>}>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    >
                        <Minus size={18} />
                    </Button>
                </CustomToolTip>
                <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
                <FontButtons editor={editor} />
                <TableButtons editor={editor} />
                <ImageUploadButton editor={editor} />
                <YoutubeButton editor={editor} />
                <ClearFormattingButton editor={editor} />
                <PreviewButton />
            </div>
        </TooltipProvider>
    );
};
