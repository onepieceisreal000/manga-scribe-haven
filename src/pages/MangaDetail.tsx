
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import { BookOpen, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import ChapterList from '@/components/ChapterList';
import { formatDistanceToNow } from 'date-fns';

const MangaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getManga, updateManga } = useManga();
  
  const manga = getManga(id || '');

  useEffect(() => {
    if (manga) {
      // Update view count
      updateManga(manga.id, { views: (manga.views || 0) + 1 });
    }
  }, [manga?.id]);

  if (!manga) {
    return (
      <div className="min-h-screen bg-manga-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="neo-glass p-8 rounded-2xl text-center animate-fade-in">
            <h1 className="text-2xl font-bold mb-4 text-gradient">Manga Not Found</h1>
            <p className="text-gray-400 mb-6">The manga you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button className="premium-button premium-glow">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const latestChapter = manga.chapters.length > 0 
    ? manga.chapters.reduce((latest, current) => 
        current.number > latest.number ? current : latest
      )
    : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-manga-primary to-manga-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="neo-glass rounded-2xl overflow-hidden">
          {/* Banner section */}
          <div className="relative h-40 sm:h-60 md:h-80 bg-gradient-to-r from-blue-900/80 to-indigo-900/80">
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center blur-sm"
              style={{ backgroundImage: `url(${manga.coverImage})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-manga-primary/80 to-transparent"></div>
          </div>
          
          {/* Manga info section */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col md:flex-row">
              {/* Cover image */}
              <div className="w-32 sm:w-48 md:w-56 -mt-16 sm:-mt-24 md:-mt-32 mx-auto md:mx-0 relative z-10">
                <div className="overflow-hidden rounded-xl shadow-xl gradient-border">
                  <img 
                    src={manga.coverImage || "/placeholder.svg"} 
                    alt={manga.title} 
                    className="w-full object-cover aspect-[3/4]"
                  />
                </div>
                <div className="mt-4 flex flex-col space-y-3">
                  {manga.chapters.length > 0 && (
                    <Link to={`/manga/${manga.id}/chapter/${manga.chapters[0].id}`}>
                      <Button className="w-full premium-button">Start Reading</Button>
                    </Link>
                  )}
                  {latestChapter && (
                    <Link to={`/manga/${manga.id}/chapter/${latestChapter.id}`}>
                      <Button variant="outline" className="w-full bg-white/5 border-white/20 hover:bg-white/10">
                        Latest Chapter
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="md:ml-8 mt-6 md:mt-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className={`${
                    manga.status === 'ongoing' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500' 
                      : 'bg-gradient-to-r from-green-600 to-green-500'
                  } text-white border-0`}>
                    {manga.status}
                  </Badge>
                  
                  {manga.isNsfw && (
                    <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white border-0 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      18+
                    </Badge>
                  )}
                  
                  {manga.genres.map((genre, index) => (
                    <Badge key={index} variant="outline" className="border-white/20 bg-white/5">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient">{manga.title}</h1>
                
                <div className="mt-4 text-gray-300 space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <User size={16} className="mr-2 text-blue-400" />
                      <span>{manga.author}</span>
                    </div>
                    <div className="flex items-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <BookOpen size={16} className="mr-2 text-indigo-400" />
                      <span>{manga.chapters.length} Chapters</span>
                    </div>
                    <div className="flex items-center p-2 rounded-lg bg-white/5 border border-white/10">
                      <Calendar size={16} className="mr-2 text-purple-400" />
                      <span>Updated {formatDistanceToNow(new Date(manga.updatedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 line-clamp-3 md:line-clamp-none">
                    {manga.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chapters section */}
        <div className="mt-8 neo-glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-gradient">Chapters</h2>
          <ChapterList mangaId={manga.id} chapters={manga.chapters} />
        </div>
      </div>
      
      {/* Background elements */}
      <div className="fixed bottom-20 right-20 h-64 w-64 rounded-full opacity-20 blur-3xl bg-blue-600/30 z-0" />
      <div className="fixed top-40 left-20 h-40 w-40 rounded-full opacity-20 blur-3xl bg-indigo-500/30 z-0" />
    </div>
  );
};

export default MangaDetail;
