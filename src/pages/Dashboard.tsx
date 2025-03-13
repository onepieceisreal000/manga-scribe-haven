
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FilePlus, FileText, TrendingUp, Users } from 'lucide-react';

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {admin?.username}</p>
          </div>
          <Link to="/admin/manga/create">
            <Button>
              <BookOpen className="mr-2 h-4 w-4" />
              Create New Manga
            </Button>
          </Link>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-manga-primary border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-400">Total Manga</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <BookOpen className="mr-3 h-5 w-5 text-blue-400" />
                <div className="text-3xl font-bold">{mangas.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-manga-primary border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-400">Total Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="mr-3 h-5 w-5 text-blue-400" />
                <div className="text-3xl font-bold">{totalChapters}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-manga-primary border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-400">Most Viewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <TrendingUp className="mr-3 h-5 w-5 text-blue-400" />
                <div className="text-xl font-bold truncate">
                  {mostViewedManga ? mostViewedManga.title : "N/A"}
                </div>
              </div>
              {mostViewedManga && (
                <div className="mt-1 text-sm text-gray-400">
                  {mostViewedManga.views || 0} views
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-manga-primary border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-400">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-blue-400" />
                <div className="text-3xl font-bold">1</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Latest activity section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-manga-primary border-gray-800">
            <CardHeader>
              <CardTitle>Latest Manga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestManga ? (
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-16 h-24 overflow-hidden rounded-md">
                    <img 
                      src={latestManga.coverImage || "/placeholder.svg"} 
                      alt={latestManga.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{latestManga.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{latestManga.description}</p>
                    <div className="mt-2">
                      <Link to={`/admin/manga/${latestManga.id}/chapters`}>
                        <Button size="sm" variant="outline">
                          Manage Chapters
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-gray-400">No manga created yet.</p>
                  <Link to="/admin/manga/create" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
                    Create your first manga
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-manga-primary border-gray-800">
            <CardHeader>
              <CardTitle>Latest Chapter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestChapter ? (
                <div>
                  <h3 className="font-semibold">
                    Chapter {latestChapter.number}: {latestChapter.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    From {latestChapter.mangaTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {latestChapter.pages.length} pages
                  </p>
                  <div className="mt-3">
                    <Link to={`/admin/manga/${latestChapter.mangaId}/chapters`}>
                      <Button size="sm" variant="outline">
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
                      className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
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
        <Card className="bg-manga-primary border-gray-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/admin/manga/create">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-6">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span>Create Manga</span>
                </Button>
              </Link>
              
              <Link to="/admin/manga" className="h-full">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-6">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Manage Manga</span>
                </Button>
              </Link>
              
              {latestManga && (
                <Link to={`/admin/manga/${latestManga.id}/chapters/create`} className="h-full">
                  <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-6">
                    <FilePlus className="h-6 w-6 mb-2" />
                    <span>Add Chapter</span>
                  </Button>
                </Link>
              )}
              
              <Link to="/" className="h-full">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center py-6">
                  <Users className="h-6 w-6 mb-2" />
                  <span>View Site</span>
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
