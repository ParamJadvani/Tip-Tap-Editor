// app/page.tsx
"use client";
import TiptapEditor from "@/components/editor/TipTapEditor";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Home() {
    return (
        <ThemeProvider>
            <main>
                <TiptapEditor />
            </main>
        </ThemeProvider>
    );
}
