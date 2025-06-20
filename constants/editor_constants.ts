import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
    ListChecksIcon,
    ListIcon,
    ListOrderedIcon,
    TextIcon,
} from "lucide-react";

export const HIGHLIGHT_COLORS = [
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "pink", label: "Pink" },
    { value: "orange", label: "Orange" },
];

export const FONT_FAMILIES = [
    { value: "sans-serif", label: "Sans Serif" },
    { value: "serif", label: "Serif" },
    { value: "monospace", label: "Monospace" },
];

export const HEADINGS = [
    { value: "paragraph", label: "Normal Text", icon: TextIcon },
    { value: "h1", label: "Heading 1", icon: Heading1Icon },
    { value: "h2", label: "Heading 2", icon: Heading2Icon },
    { value: "h3", label: "Heading 3", icon: Heading3Icon },
    { value: "h4", label: "Heading 4", icon: Heading4Icon },
    { value: "h5", label: "Heading 5", icon: Heading5Icon },
    { value: "h6", label: "Heading 6", icon: Heading6Icon },
];

export const ALIGNMENTS = [
    { value: "left", label: "Left Align", icon: AlignLeftIcon },
    { value: "center", label: "Center Align", icon: AlignCenterIcon },
    { value: "right", label: "Right Align", icon: AlignRightIcon },
    { value: "justify", label: "Justify", icon: AlignJustifyIcon },
];

export const LIST_TYPES = [
    { value: "bullet", label: "Bullet List", icon: ListIcon },
    { value: "ordered", label: "Numbered List", icon: ListOrderedIcon },
    { value: "task", label: "Task List", icon: ListChecksIcon },
];
