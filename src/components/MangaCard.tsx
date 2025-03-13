
import { Link } from "react-router-dom";
import { Manga } from "@/contexts/MangaContext";
import { Badge } from "@/components/ui/badge";

interface MangaCardProps {
  manga: Manga;
}

const MangaCard = ({ manga }: MangaCardProps) => {
  return (
    <Link to={`/manga/${manga.id}`} className="block">
      <div className="manga-card bg-manga-primary rounded-lg overflow-hidden shadow-lg">
        <div className="relative pb-[140%]">
          <img 
            src={manga.coverImage || "/placeholder.svg"} 
            alt={manga.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              variant="secondary" 
              className={`${manga.status === 'ongoing' ? 'bg-blue-600' : 'bg-green-600'} text-white`}
            >
              {manga.status}
            </Badge>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-white line-clamp-1">{manga.title}</h3>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>Ch. {manga.chapters.length}</span>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{manga.rating || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
