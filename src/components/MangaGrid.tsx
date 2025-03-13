
import { Manga } from "@/contexts/MangaContext";
import MangaCard from "./MangaCard";

interface MangaGridProps {
  mangas: Manga[];
  title?: string;
}

const MangaGrid = ({ mangas, title }: MangaGridProps) => {
  if (mangas.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-semibold mb-4">{title || "Manga Library"}</h2>
        <p className="text-gray-400">No manga available yet. Admin can add manga from the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </div>
  );
};

export default MangaGrid;
