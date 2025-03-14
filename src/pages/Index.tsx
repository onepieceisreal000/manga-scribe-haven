
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { useManga } from '@/contexts/MangaContext';
import MangaGrid from '@/components/MangaGrid';

const Index = () => {
  const { mangas } = useManga();
  console.log("Index page mangas:", mangas);
  
  // Get the 6 most recent manga for the featured section
  const featuredMangas = [...mangas]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  useEffect(() => {
    // Animation for elements on load
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 150 * (index + 1));
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-manga-primary to-manga-secondary px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-blue-600/20 filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-indigo-600/20 filter blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="container mx-auto py-20">
        <div className="max-w-3xl mx-auto text-center z-10 mb-16">
          <div className="animate-on-load opacity-0 mb-8" style={{ transform: 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full ios-gradient flex items-center justify-center shadow-xl mb-6">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-display font-semibold mb-4 text-white">
              MangaScribe
            </h1>
            <p className="text-xl text-gray-300 font-sans">
              Your premium manga reading experience
            </p>
          </div>
          
          <div className="flex gap-4 flex-wrap justify-center animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.7s ease-out' }}>
            <Link to="/home">
              <Button className="premium-button text-white group">
                Explore Library
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="bg-white/5 hover:bg-white/10 border border-white/20 text-white">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
        
        {mangas.length > 0 && (
          <div className="animate-on-load opacity-0 mt-12" style={{ transform: 'translateY(20px)', transition: 'all 0.8s ease-out' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-semibold text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Featured Manga
              </h2>
              <Link to="/home" className="text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <MangaGrid mangas={featuredMangas} />
          </div>
        )}
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neo-glass p-6 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.9s ease-out' }}>
            <h3 className="text-xl font-display mb-2">Premium Content</h3>
            <p className="text-gray-400 text-sm">Access high-quality manga with our curated library of titles</p>
          </div>
          
          <div className="neo-glass p-6 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 1s ease-out' }}>
            <h3 className="text-xl font-display mb-2">Modern Interface</h3>
            <p className="text-gray-400 text-sm">Enjoy a sleek, iOS-inspired reading experience designed for comfort</p>
          </div>
          
          <div className="neo-glass p-6 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 1.1s ease-out' }}>
            <h3 className="text-xl font-display mb-2">Regular Updates</h3>
            <p className="text-gray-400 text-sm">Stay current with the latest chapters added to your favorite series</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-16 text-center animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 1.2s ease-out' }}>
          © {new Date().getFullYear()} MangaScribe • Premium Manga Reading Experience
        </div>
      </div>
    </div>
  );
};

export default Index;
