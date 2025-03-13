
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import MangaGrid from "@/components/MangaGrid";
import { useManga } from "@/contexts/MangaContext";
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, ArrowRight } from 'lucide-react';

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
      
      <div className="container mx-auto px-4 py-6">
        {mangas.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to MangaScribe</h1>
            <p className="text-gray-400 max-w-lg mb-8">
              No manga available yet. The admin can add manga from the dashboard.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Manga Library</h2>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={activeFilter === 'all' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={activeFilter === 'newest' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter('newest')}
                >
                  <Clock size={16} className="mr-1" />
                  Newest
                </Button>
                <Button 
                  variant={activeFilter === 'popular' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveFilter('popular')}
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
