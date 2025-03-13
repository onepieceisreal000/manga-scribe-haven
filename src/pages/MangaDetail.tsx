
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import { BookOpen, Calendar, User, Clock } from 'lucide-react';
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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Manga Not Found</h1>
            <p className="text-gray-400 mb-6">The manga you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>Return to Home</Button>
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
    <div className="min-h-screen bg-manga-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-manga-primary rounded-lg shadow-lg overflow-hidden">
          {/* Banner section */}
          <div className="relative h-40 sm:h-60 md:h-80 bg-gradient-to-r from-blue-900 to-indigo-900">
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center" 
              style={{ backgroundImage: `url(${manga.coverImage})` }}
            ></div>
          </div>
          
          {/* Manga info section */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col md:flex-row">
              {/* Cover image */}
              <div className="w-32 sm:w-48 md:w-56 -mt-16 sm:-mt-24 md:-mt-32 mx-auto md:mx-0 relative z-10">
                <img 
                  src={manga.coverImage || "/placeholder.svg"} 
                  alt={manga.title} 
                  className="w-full rounded-lg shadow-xl object-cover aspect-[3/4]"
                />
                <div className="mt-4 flex flex-col space-y-2">
                  {manga.chapters.length > 0 && (
                    <Link to={`/manga/${manga.id}/chapter/${manga.chapters[0].id}`}>
                      <Button className="w-full">Start Reading</Button>
                    </Link>
                  )}
                  {latestChapter && (
                    <Link to={`/manga/${manga.id}/chapter/${latestChapter.id}`}>
                      <Button variant="outline" className="w-full">
                        Latest Chapter
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="md:ml-8 mt-6 md:mt-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className={`${manga.status === 'ongoing' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>
                    {manga.status}
                  </Badge>
                  {manga.genres.map((genre, index) => (
                    <Badge key={index} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{manga.title}</h1>
                
                <div className="mt-4 text-gray-300 space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <User size={16} className="mr-1 text-gray-400" />
                      <span>{manga.author}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={16} className="mr-1 text-gray-400" />
                      <span>{manga.chapters.length} Chapters</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-400" />
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
        <div className="mt-8 bg-manga-primary rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Chapters</h2>
          <ChapterList mangaId={manga.id} chapters={manga.chapters} />
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;
