
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Home,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReadChapter = () => {
  const { mangaId, chapterId } = useParams<{ mangaId: string; chapterId: string }>();
  const { getManga, getChapter } = useManga();
  const navigate = useNavigate();
  
  const manga = getManga(mangaId || '');
  const chapter = getChapter(mangaId || '', chapterId || '');
  
  const [prevChapterId, setPrevChapterId] = useState<string | null>(null);
  const [nextChapterId, setNextChapterId] = useState<string | null>(null);
  
  useEffect(() => {
    if (manga && chapter) {
      // Sort chapters by number
      const sortedChapters = [...manga.chapters].sort((a, b) => a.number - b.number);
      const currentIndex = sortedChapters.findIndex(c => c.id === chapter.id);
      
      if (currentIndex > 0) {
        setPrevChapterId(sortedChapters[currentIndex - 1].id);
      } else {
        setPrevChapterId(null);
      }
      
      if (currentIndex < sortedChapters.length - 1) {
        setNextChapterId(sortedChapters[currentIndex + 1].id);
      } else {
        setNextChapterId(null);
      }
    }
  }, [manga, chapter]);

  if (!manga || !chapter) {
    return (
      <div className="min-h-screen bg-manga-secondary flex flex-col items-center justify-center px-4">
        <div className="neo-glass p-8 rounded-2xl text-center animate-fade-in">
          <h1 className="text-2xl font-bold mb-4 text-gradient">Chapter Not Found</h1>
          <p className="text-gray-400 mb-6">The chapter you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button className="premium-button premium-glow">Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePageNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && prevChapterId) {
      navigate(`/manga/${manga.id}/chapter/${prevChapterId}`);
    } else if (direction === 'next' && nextChapterId) {
      navigate(`/manga/${manga.id}/chapter/${nextChapterId}`);
    }
  };

  return (
    <div className="min-h-screen bg-manga-secondary flex flex-col">
      {/* Top navigation */}
      <div className="sticky top-0 z-30 neo-glass backdrop-blur-xl py-3 px-4 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/manga/${manga.id}`} className="text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="hidden sm:block">
              <h1 className="font-medium text-gradient">{manga.title}</h1>
              <p className="text-sm text-gray-400">Chapter {chapter.number}: {chapter.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageNavigation('prev')}
              disabled={!prevChapterId}
              className="bg-white/5 border-white/20 hover:bg-white/10"
            >
              <ChevronLeft size={16} className="mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageNavigation('next')}
              disabled={!nextChapterId}
              className="bg-white/5 border-white/20 hover:bg-white/10"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Chapter content */}
      <div className="flex-1 flex flex-col items-center py-6 px-4 animate-fade-in custom-scrollbar">
        {chapter.pages.length > 0 ? (
          chapter.pages.map((page, index) => (
            <div 
              key={index} 
              className="mb-6 max-w-3xl w-full neo-glass rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src={page} 
                alt={`Page ${index + 1}`} 
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          ))
        ) : (
          <div className="py-12 text-center neo-glass p-8 rounded-xl">
            <p className="text-gray-400 mb-6">No pages found for this chapter.</p>
            <Link to={`/manga/${manga.id}`}>
              <Button className="premium-button premium-glow">Return to Manga</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Bottom navigation */}
      <div className="sticky bottom-0 z-30 neo-glass backdrop-blur-xl py-3 px-4 border-t border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <Link to={`/manga/${manga.id}`}>
            <Button variant="ghost" size="sm" className="hover:bg-white/10">
              <List size={16} className="mr-2" />
              Chapters
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageNavigation('prev')}
              disabled={!prevChapterId}
              className="bg-white/5 border-white/20 hover:bg-white/10"
            >
              <ChevronLeft size={16} className="mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageNavigation('next')}
              disabled={!nextChapterId}
              className="bg-white/5 border-white/20 hover:bg-white/10"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="fixed bottom-0 right-0 h-64 w-64 rounded-full opacity-10 blur-3xl bg-blue-600/30 z-0" />
      <div className="fixed top-1/3 right-1/4 h-32 w-32 rounded-full opacity-10 blur-3xl bg-indigo-500/30 z-0" />
    </div>
  );
};

export default ReadChapter;
