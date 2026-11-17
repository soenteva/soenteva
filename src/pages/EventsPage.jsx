import PageHero from "@/components/PageHero";
import Photo from "@/components/Photo";
import Section from "@/components/Section";
import { EVENT_PHOTOS } from "@/data/images";
import { useI18n } from "@/i18n";
import { useDocumentMeta } from "@/lib/useDocumentMeta";

// Heading and intro text of the source events page; the photos are its whole gallery, loaded lazily.
// The alt text of every photo is the heading of the page.
export default function EventsPage() {
    const { S } = useI18n();
    const e = S.events;
    useDocumentMeta(e.title, e.intro);
    return (
        <>
            <PageHero title={e.title} crumbs={[{ label: e.title }]} lead={e.intro} />
            <Section tone="teal" pad="md" testid="events-gallery">
                <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4">
                    {EVENT_PHOTOS.map((file) => (
                        <li key={file} className="mb-4 break-inside-avoid">
                            <Photo file={file} alt={e.title} className="w-full rounded-2xl border border-white/10 bg-deep-card" />
                        </li>
                    ))}
                </ul>
            </Section>
        </>
    );
}
