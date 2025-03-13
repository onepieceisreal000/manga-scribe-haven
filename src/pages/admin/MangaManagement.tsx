
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BookOpen, 
  FilePlus, 
  FileText, 
  MoreHorizontal, 
  Pencil, 
  Plus, 
  Search, 
  Trash2 
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const MangaManagement = () => {
  const { mangas, deleteManga } = useManga();
  const [searchTerm, setSearchTerm] = useState('');
  const [mangaToDelete, setMangaToDelete] = useState<string | null>(null);
  
  const filteredMangas = mangas.filter(manga => 
    manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manga.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteManga = () => {
    if (mangaToDelete) {
      deleteManga(mangaToDelete);
      setMangaToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="neo-glass p-6 rounded-2xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Manage Manga</h1>
            <p className="text-gray-400">Create, edit, and delete manga</p>
          </div>
          <Link to="/admin/manga/create">
            <Button className="premium-button premium-glow">
              <Plus className="mr-2 h-4 w-4" />
              Create New Manga
            </Button>
          </Link>
        </div>
        
        <div className="neo-glass p-6 rounded-2xl space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 premium-input"
            />
          </div>
          
          <div className="bg-manga-primary/30 rounded-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-manga-primary/50 border-white/10">
                  <TableHead className="w-[80px] text-gray-300">#</TableHead>
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-300">Author</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-300">Status</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-300">Chapters</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-300">Updated</TableHead>
                  <TableHead className="w-[120px] text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMangas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchTerm 
                        ? "No manga found. Try a different search term." 
                        : "No manga available. Create your first manga."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMangas.map((manga, index) => (
                    <TableRow key={manga.id} className="hover:bg-white/5 transition-colors border-white/10">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-14 mr-3 overflow-hidden rounded shadow-md">
                            <img 
                              src={manga.coverImage || "/placeholder.svg"} 
                              alt={manga.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="truncate max-w-[200px]">{manga.title}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{manga.author}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge 
                          className={`${
                            manga.status === 'ongoing' 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500' 
                              : 'bg-gradient-to-r from-green-600 to-green-500'
                          } text-white border-0`}
                        >
                          {manga.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{manga.chapters.length}</TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400">
                        {formatDistanceToNow(new Date(manga.updatedAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-white/10">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="neo-glass border-white/10">
                            <Link to={`/manga/${manga.id}`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                                <BookOpen className="mr-2 h-4 w-4 text-blue-400" />
                                View
                              </DropdownMenuItem>
                            </Link>
                            <Link to={`/admin/manga/${manga.id}/chapters`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                                <FileText className="mr-2 h-4 w-4 text-indigo-400" />
                                Manage Chapters
                              </DropdownMenuItem>
                            </Link>
                            <Link to={`/admin/manga/${manga.id}/chapters/create`}>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
                                <FilePlus className="mr-2 h-4 w-4 text-purple-400" />
                                Add Chapter
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-400 hover:bg-red-950/30 focus:text-red-400"
                              onClick={() => setMangaToDelete(manga.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!mangaToDelete} onOpenChange={() => setMangaToDelete(null)}>
        <AlertDialogContent className="neo-glass border-white/10 rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the manga and all its chapters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteManga}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default MangaManagement;
