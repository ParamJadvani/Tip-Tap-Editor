import { create } from "zustand";

interface EditorStore {
    html: string;
    setHtml: (html: string) => void;
}

const useEditorStore = create<EditorStore>((set) => ({
    html: "",
    setHtml: (html) => set({ html }),
}));

export default useEditorStore;
