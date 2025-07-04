import { create } from "zustand";
import { Editor } from "@tiptap/react";

interface EditorStore {
    html: string;
    editor:Editor|null
    setHtml: (html: string) => void;
    setEditor: (editor: Editor|null) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
    html: "",
    editor: null,
    setHtml: (html) => set({ html }),
    setEditor: (editor) => set({ editor }),
}));

export default useEditorStore;
