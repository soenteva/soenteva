import { useEffect } from "react";
import { useI18n } from "@/i18n";

// Sets the browser tab title, the page description and the html lang attribute of the current page.
export function useDocumentMeta(title, description) {
    const { lang, S } = useI18n();
    useEffect(() => {
        document.documentElement.lang = lang;
        document.title = title ? `${title} | ${S.meta.suffix}` : S.meta.defaultTitle;
        if (description) {
            const meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute("content", description);
        }
    }, [lang, S, title, description]);
}
