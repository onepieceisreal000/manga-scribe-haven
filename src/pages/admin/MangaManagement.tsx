
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Manga</h1>
            <p className="text-gray-400">Create, edit, and delete manga</p>
          </div>
          <Link to="/admin/manga/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Manga
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-manga-primary border-gray-700"
            />
          </div>
        </div>
        
        <div className="bg-manga-primary rounded-md border border-gray-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-manga-primary/50 border-gray-800">
                <TableHead className="w-[80px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Chapters</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
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
                  <TableRow key={manga.id} className="hover:bg-manga-primary/50 border-gray-800">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-14 mr-3 overflow-hidden rounded">
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
                        variant="outline"
                        className={`${manga.status === 'ongoing' ? 'border-blue-600 text-blue-400' : 'border-green-600 text-green-400'}`}
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
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-manga-primary border-gray-700">
                          <Link to={`/manga/${manga.id}`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <BookOpen className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/admin/manga/${manga.id}/chapters`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" />
                              Manage Chapters
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/admin/manga/${manga.id}/chapters/create`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <FilePlus className="mr-2 h-4 w-4" />
                              Add Chapter
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500 focus:text-red-500"
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
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!mangaToDelete} onOpenChange={() => setMangaToDelete(null)}>
        <AlertDialogContent className="bg-manga-primary border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the manga and all its chapters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-manga-secondary border-gray-700 hover:bg-manga-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteManga}
              className="bg-red-600 hover:bg-red-700"
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
