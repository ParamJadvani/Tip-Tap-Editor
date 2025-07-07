import { create } from "zustand";
import { Editor } from "@tiptap/react";

interface EditorStore {
    html: string;
    editor: Editor | null;
    activeCustomButtonNodeId: string | null;
    setHtml: (html: string) => void;
    setEditor: (editor: Editor | null) => void;
    setActiveCustomButtonNodeId: (id: string | null) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
    html: "",
    editor: null,
    activeCustomButtonNodeId: null,
    setHtml: (html) => set({ html }),
    setEditor: (editor) => set({ editor }),
    setActiveCustomButtonNodeId: (id) => set({ activeCustomButtonNodeId: id }),
}));

export default useEditorStore;
