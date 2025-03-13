
import { Link } from "react-router-dom";
import { Chapter } from "@/contexts/MangaContext";
import { formatDistanceToNow } from "date-fns";

interface ChapterListProps {
  mangaId: string;
  chapters: Chapter[];
}

const ChapterList = ({ mangaId, chapters }: ChapterListProps) => {
  // Sort chapters by number in descending order (newest first)
  const sortedChapters = [...chapters].sort((a, b) => b.number - a.number);

  if (chapters.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-400">No chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="py-4 chapter-list">
      <div className="space-y-2">
        {sortedChapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/manga/${mangaId}/chapter/${chapter.id}`}
            className="flex items-center justify-between p-3 bg-manga-primary rounded-md hover:bg-blue-900/20 transition"
          >
            <div className="flex items-center">
              <span className="font-medium">Chapter {chapter.number}</span>
              <span className="ml-3 text-gray-400 text-sm line-clamp-1">{chapter.title}</span>
            </div>
            <div className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(chapter.createdAt), { addSuffix: true })}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChapterList;
