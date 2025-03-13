
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FilePlus, FileText, TrendingUp, Users, BookMarked, Activity } from 'lucide-react';

const Dashboard = () => {
  const { mangas } = useManga();
  const { admin } = useAuth();
  
  const totalChapters = useMemo(() => {
    return mangas.reduce((acc, manga) => acc + manga.chapters.length, 0);
  }, [mangas]);
  
  const latestManga = useMemo(() => {
    if (mangas.length === 0) return null;
    return [...mangas].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [mangas]);
  
  const latestChapter = useMemo(() => {
    if (mangas.length === 0) return null;
    const allChapters = mangas.flatMap(manga => 
      manga.chapters.map(chapter => ({ ...chapter, mangaTitle: manga.title, mangaId: manga.id }))
    );
    if (allChapters.length === 0) return null;
    return allChapters.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [mangas]);
  
  const mostViewedManga = useMemo(() => {
    if (mangas.length === 0) return null;
    return [...mangas].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
  }, [mangas]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="neo-glass p-8 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-display font-semibold mb-3 text-white text-gradient">Dashboard</h1>
            <p className="text-gray-300">Welcome back, <span className="text-blue-400 font-medium">{admin?.username}</span></p>
          </div>
          <Link to="/admin/manga/create">
            <Button className="premium-button text-white group shadow-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              Create New Manga
            </Button>
          </Link>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="neo-glass border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-300 flex items-center">
                <BookOpen className="h-5 w-5 text-blue-400 mr-2 group-hover:scale-110 transition-transform" />
                Total Manga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{mangas.length}</div>
                <div className="p-2 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="neo-glass border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-300 flex items-center">
                <FileText className="h-5 w-5 text-indigo-400 mr-2 group-hover:scale-110 transition-transform" />
                Total Chapters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{totalChapters}</div>
                <div className="p-2 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
                  <Activity className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="neo-glass border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-300 flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-400 mr-2 group-hover:scale-110 transition-transform" />
                Most Viewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate text-white">
                {mostViewedManga ? mostViewedManga.title : "N/A"}
              </div>
              {mostViewedManga && (
                <div className="mt-1 text-sm text-gray-400 flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-blue-400" />
                  {mostViewedManga.views || 0} views
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="neo-glass border-0 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-300 flex items-center">
                <Users className="h-5 w-5 text-purple-400 mr-2 group-hover:scale-110 transition-transform" />
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">1</div>
                <div className="p-2 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Activity className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Latest activity section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="neo-glass border-0 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-xl font-display text-gray-200 flex items-center">
                <BookMarked className="h-5 w-5 text-blue-400 mr-2" />
                Latest Manga
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {latestManga ? (
                <div className="flex space-x-4 items-center">
                  <div className="flex-shrink-0 w-20 h-28 overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={latestManga.coverImage || "/placeholder.svg"} 
                      alt={latestManga.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-xl">{latestManga.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{latestManga.description}</p>
                    <div>
                      <Link to={`/admin/manga/${latestManga.id}/chapters`}>
                        <Button size="sm" variant="outline" className="bg-white/5 hover:bg-white/10 border border-white/20 text-white">
                          Manage Chapters
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-400">No manga created yet.</p>
                  <Link to="/admin/manga/create" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block hover:underline">
                    Create your first manga
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="neo-glass border-0 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-xl font-display text-gray-200 flex items-center">
                <FileText className="h-5 w-5 text-indigo-400 mr-2" />
                Latest Chapter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {latestChapter ? (
                <div>
                  <h3 className="font-semibold text-white text-xl">
                    Chapter {latestChapter.number}: {latestChapter.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    From <span className="text-indigo-400">{latestChapter.mangaTitle}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {latestChapter.pages.length} pages
                  </p>
                  <div className="mt-3">
                    <Link to={`/admin/manga/${latestChapter.mangaId}/chapters`}>
                      <Button size="sm" variant="outline" className="bg-white/5 hover:bg-white/10 border border-white/20 text-white">
                        Manage Chapters
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-400">No chapters created yet.</p>
                  {mangas.length > 0 && (
                    <Link 
                      to={`/admin/manga/${mangas[0].id}/chapters/create`} 
                      className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block hover:underline"
                    >
                      Create your first chapter
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick actions */}
        <Card className="neo-glass border-0 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-xl font-display text-gray-200">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/manga/create">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-8 bg-gradient-to-br from-blue-500/10 to-blue-800/10 hover:from-blue-500/20 hover:to-blue-800/20 border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <BookOpen className="h-8 w-8 mb-3 text-blue-400" />
                  <span className="font-medium">Create Manga</span>
                </Button>
              </Link>
              
              <Link to="/admin/manga" className="h-full">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-8 bg-gradient-to-br from-indigo-500/10 to-indigo-800/10 hover:from-indigo-500/20 hover:to-indigo-800/20 border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <FileText className="h-8 w-8 mb-3 text-indigo-400" />
                  <span className="font-medium">Manage Manga</span>
                </Button>
              </Link>
              
              {latestManga && (
                <Link to={`/admin/manga/${latestManga.id}/chapters/create`} className="h-full">
                  <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-8 bg-gradient-to-br from-purple-500/10 to-purple-800/10 hover:from-purple-500/20 hover:to-purple-800/20 border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                    <FilePlus className="h-8 w-8 mb-3 text-purple-400" />
                    <span className="font-medium">Add Chapter</span>
                  </Button>
                </Link>
              )}
              
              <Link to="/" className="h-full">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-8 bg-gradient-to-br from-green-500/10 to-green-800/10 hover:from-green-500/20 hover:to-green-800/20 border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <Users className="h-8 w-8 mb-3 text-green-400" />
                  <span className="font-medium">View Site</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
