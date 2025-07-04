import {
    AlignCenterIcon,
    AlignJustifyIcon,
    AlignLeftIcon,
    AlignRightIcon,
    CheckSquareIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
    ListIcon,
    ListOrderedIcon,
    TextIcon,
} from "lucide-react";

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
    { value: "task", label: "Task List", icon: CheckSquareIcon },
];

export const TEXT_COLORS = [
    { name: "Default", color: "#000000" },
    { name: "Purple", color: "#9333EA" },
    { name: "Red", color: "#E00000" },
    { name: "Yellow", color: "#EAB308" },
    { name: "Blue", color: "#2563EB" },
    { name: "Green", color: "#008A00" },
    { name: "Orange", color: "#FFA500" },
    { name: "Pink", color: "#BA4081" },
    { name: "Gray", color: "#A8A29E" },
];

export const HIGHLIGHT_COLORS = [
    { name: "Default", color: "transparent" },
    { name: "Purple", color: "#9333EA" },
    { name: "Red", color: "#E00000" },
    { name: "Yellow", color: "#EAB308" },
    { name: "Blue", color: "#2563EB" },
    { name: "Green", color: "#008A00" },
    { name: "Orange", color: "#FFA500" },
    { name: "Pink", color: "#BA4081" },
    { name: "Gray", color: "#A8A29E" },
];

export type FontName = "Roboto" | "Open Sans" | "Lato" | "Montserrat" | "Oswald" | "Raleway" | "PT Sans" | "Merriweather" | "Ubuntu" | "Poppins" | "Noto Sans" | "Noto Serif" | "Noto Sans JP";

export const ALL_GOOGLE_FONTS: FontName[] = [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Oswald",
    "Raleway",
    "PT Sans",
    "Merriweather",
    "Ubuntu",
    "Poppins",
    "Noto Sans",
    "Noto Serif",
    "Noto Sans JP",
] as const;
