
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import MangaGrid from "@/components/MangaGrid";
import { useManga } from "@/contexts/MangaContext";
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, ArrowRight, Library } from 'lucide-react';

const Home = () => {
  const { mangas } = useManga();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'newest' | 'popular'>(
    location.search.includes('filter=newest') 
      ? 'newest' 
      : location.search.includes('filter=popular') 
        ? 'popular' 
        : 'all'
  );

  const filteredMangas = useMemo(() => {
    switch (activeFilter) {
      case 'newest':
        return [...mangas].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'popular':
        return [...mangas].sort((a, b) => 
          (b.views || 0) - (a.views || 0)
        );
      default:
        return mangas;
    }
  }, [mangas, activeFilter]);

  return (
    <div className="min-h-screen bg-manga-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {mangas.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center animate-scale-in">
            <h1 className="text-4xl font-display font-bold mb-6 text-manga-text">Welcome to MangaScribe</h1>
            <p className="text-gray-400 max-w-lg mb-8 font-manga">
              No manga available yet. The admin can add manga from the dashboard.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-3xl font-display font-bold text-manga-text">Manga Library</h2>
              <div className="flex items-center space-x-2 animate-slide-in">
                <Button 
                  variant={activeFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                  className="transition-all duration-300"
                >
                  <Library size={16} className="mr-1" />
                  All
                </Button>
                <Button 
                  variant={activeFilter === 'newest' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter('newest')}
                  className="transition-all duration-300"
                >
                  <Clock size={16} className="mr-1" />
                  Newest
                </Button>
                <Button 
                  variant={activeFilter === 'popular' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter('popular')}
                  className="transition-all duration-300"
                >
                  <TrendingUp size={16} className="mr-1" />
                  Popular
                </Button>
              </div>
            </div>
            
            <MangaGrid mangas={filteredMangas} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
