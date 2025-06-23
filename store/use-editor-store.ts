import { create } from "zustand";
import { Editor } from "@tiptap/react";

interface EditorStore {
    editor: Editor | null;
    html: string;
    setEditor: (editor: Editor | null) => void;
    setHtml: (html: string) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
    editor: null,
    html: "",
    setEditor: (editor) => set({ editor }),
    setHtml: (html) => set({ html }),
}));

export default useEditorStore;
