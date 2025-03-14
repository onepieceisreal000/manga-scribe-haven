
import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import MangaGrid from "@/components/MangaGrid";
import { useManga } from "@/contexts/MangaContext";
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, ArrowRight, Library, Search, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Home = () => {
  const { mangas } = useManga();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'newest' | 'popular' | 'nsfw'>(
    location.search.includes('filter=newest') 
      ? 'newest' 
      : location.search.includes('filter=popular') 
        ? 'popular'
        : location.search.includes('filter=nsfw')
          ? 'nsfw'
          : 'all'
  );
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNsfw, setShowNsfw] = useState(false);

  // Load NSFW preference from localStorage
  useEffect(() => {
    const savedNsfwPref = localStorage.getItem('mangascribe-show-nsfw');
    if (savedNsfwPref) {
      setShowNsfw(savedNsfwPref === 'true');
    }
  }, []);

  // Save NSFW preference to localStorage
  useEffect(() => {
    localStorage.setItem('mangascribe-show-nsfw', showNsfw.toString());
  }, [showNsfw]);

  const filteredMangas = useMemo(() => {
    let filtered = [...mangas];
    
    // Apply NSFW filter based on activeFilter and showNsfw
    if (activeFilter === 'nsfw') {
      filtered = filtered.filter(manga => manga.isNsfw);
    } else if (!showNsfw) {
      filtered = filtered.filter(manga => !manga.isNsfw);
    }
    
    // Apply search filter if searchTerm exists
    if (searchTerm.trim()) {
      filtered = filtered.filter(manga => 
        manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manga.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manga.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply sort filter
    switch (activeFilter) {
      case 'newest':
        return filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'popular':
        return filtered.sort((a, b) => 
          (b.views || 0) - (a.views || 0)
        );
      default:
        return filtered;
    }
  }, [mangas, activeFilter, searchTerm, showNsfw]);

  // Get NSFW manga count for badge
  const nsfwCount = useMemo(() => {
    return mangas.filter(manga => manga.isNsfw).length;
  }, [mangas]);

  // Simple animation on page load
  useEffect(() => {
    const header = document.querySelector('.header-animation');
    const filters = document.querySelector('.filters-animation');
    
    if (header) {
      header.classList.add('animate-fade-in');
    }
    
    if (filters) {
      setTimeout(() => {
        filters.classList.add('animate-slide-in');
      }, 300);
    }
  }, []);

  return (
    <div className="min-h-screen bg-manga-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {mangas.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center animate-scale-in">
            <h1 className="text-4xl font-display font-bold mb-6 text-manga-text">Welcome to MangaScribe</h1>
            <p className="text-gray-400 max-w-lg mb-8 font-sans">
              No manga available yet. The admin can add manga from the dashboard.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 header-animation opacity-0">
              <h2 className="text-3xl font-display font-bold text-manga-text">Manga Library</h2>
              
              <div className="flex items-center gap-4">
                {/* NSFW Toggle */}
                <div className="flex items-center space-x-2 neo-glass px-3 py-2 rounded-full">
                  <Label htmlFor="nsfw-toggle" className="text-sm cursor-pointer flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 text-red-400" />
                    Show 18+
                  </Label>
                  <Switch 
                    id="nsfw-toggle"
                    checked={showNsfw} 
                    onCheckedChange={setShowNsfw}
                    className="data-[state=checked]:bg-red-500"
                  />
                </div>
                
                <div className="relative">
                  {searchVisible && (
                    <div className="absolute right-0 top-0 w-64 animate-scale-in">
                      <input
                        type="text"
                        placeholder="Search manga..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="premium-input w-full text-sm"
                      />
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSearchVisible(!searchVisible)}
                    className={`transition-all duration-300 ml-2 ${searchVisible ? 'opacity-50' : ''}`}
                  >
                    <Search size={16} className="mr-1" />
                    {searchVisible ? '' : 'Search'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-8 filters-animation opacity-0 overflow-x-auto custom-scrollbar pb-2">
              <Button 
                variant={activeFilter === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveFilter('all')}
                className="transition-all duration-300 rounded-full"
              >
                <Library size={16} className="mr-1" />
                All
              </Button>
              <Button 
                variant={activeFilter === 'newest' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveFilter('newest')}
                className="transition-all duration-300 rounded-full"
              >
                <Clock size={16} className="mr-1" />
                Newest
              </Button>
              <Button 
                variant={activeFilter === 'popular' ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveFilter('popular')}
                className="transition-all duration-300 rounded-full"
              >
                <TrendingUp size={16} className="mr-1" />
                Popular
              </Button>
              {nsfwCount > 0 && (
                <Button 
                  variant={activeFilter === 'nsfw' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => {
                    setActiveFilter('nsfw');
                    if (!showNsfw) setShowNsfw(true);
                  }}
                  className="transition-all duration-300 rounded-full relative"
                >
                  <AlertTriangle size={16} className="mr-1 text-red-400" />
                  18+ Content
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {nsfwCount}
                  </span>
                </Button>
              )}
            </div>
            
            {filteredMangas.length === 0 ? (
              <div className="py-12 text-center animate-fade-in neo-glass p-8 rounded-2xl">
                {searchTerm ? (
                  <>
                    <p className="text-gray-400 mb-4">No results found for "{searchTerm}"</p>
                    <Button variant="outline" onClick={() => setSearchTerm('')}>
                      Clear Search
                    </Button>
                  </>
                ) : activeFilter === 'nsfw' ? (
                  <p className="text-gray-400">No 18+ content available</p>
                ) : !showNsfw ? (
                  <p className="text-gray-400">No manga available for current filters</p>
                ) : (
                  <p className="text-gray-400">No manga available</p>
                )}
              </div>
            ) : (
              <MangaGrid 
                mangas={filteredMangas} 
                title={activeFilter === 'nsfw' ? '18+ Content' : undefined}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
