
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, Trash2, FileText } from "lucide-react";
import { useManga } from "@/contexts/MangaContext";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ChapterManagement = () => {
  const { id } = useParams();
  const { getMangaById, deleteChapter } = useManga();
  const [manga, setManga] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const mangaData = getMangaById(id);
      setManga(mangaData);
      setIsLoading(false);
    }
  }, [id, getMangaById]);

  const handleDeleteChapter = (chapterId: string) => {
    setChapterToDelete(chapterId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (chapterToDelete && id) {
      deleteChapter(id, chapterToDelete);
      toast.success("Chapter deleted successfully");
      setDeleteDialogOpen(false);
      // Refresh manga data
      const mangaData = getMangaById(id);
      setManga(mangaData);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!manga) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-lg mb-4">Manga not found</p>
          <Link to="/admin/manga">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Manga List
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{manga.title} - Chapters</h1>
            <p className="text-muted-foreground">Manage chapters for this manga</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/manga">
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link to={`/admin/manga/${id}/chapters/create`}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Chapter
              </Button>
            </Link>
          </div>
        </div>

        {manga.chapters && manga.chapters.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chapter</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manga.chapters.map((chapter: any) => (
                <TableRow key={chapter.id}>
                  <TableCell>{chapter.number}</TableCell>
                  <TableCell>{chapter.title}</TableCell>
                  <TableCell>{chapter.pages?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/manga/${id}/chapter/${chapter.id}`}>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteChapter(chapter.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 border rounded-lg">
            <p className="text-muted-foreground mb-4">No chapters added yet</p>
            <Link to={`/admin/manga/${id}/chapters/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Chapter
              </Button>
            </Link>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chapter and all its pages. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ChapterManagement;
