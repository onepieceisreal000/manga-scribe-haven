
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Upload, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useManga } from "@/contexts/MangaContext";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import PageUploader from "@/components/PageUploader"; // Fixed import statement

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  number: z.string().min(1, "Chapter number is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateChapter = () => {
  const { id: mangaId } = useParams();
  const navigate = useNavigate();
  const { getMangaById, addChapter } = useManga();
  const [pages, setPages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      number: "",
    },
  });

  const manga = mangaId ? getMangaById(mangaId) : null;

  const onSubmit = (data: FormValues) => {
    if (!mangaId || pages.length === 0) {
      toast.error("Please add at least one page");
      return;
    }

    try {
      const newChapter = {
        id: crypto.randomUUID(),
        title: data.title,
        number: parseInt(data.number, 10), // Convert string to number
        pages: pages,
        createdAt: new Date().toISOString(),
      };

      addChapter(mangaId, newChapter);
      toast.success("Chapter created successfully!");
      navigate(`/admin/manga/${mangaId}/chapters`);
    } catch (error) {
      toast.error("Error creating chapter. Please try again.");
      console.error(error);
    }
  };

  const handleAddPage = (url: string) => {
    setPages([...pages, url]);
  };

  const handleRemovePage = (index: number) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    setPages(newPages);
  };

  // Function to handle page reordering
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newPages = [...pages];
    [newPages[index], newPages[index - 1]] = [newPages[index - 1], newPages[index]];
    setPages(newPages);
  };

  const handleMoveDown = (index: number) => {
    if (index === pages.length - 1) return;
    const newPages = [...pages];
    [newPages[index], newPages[index + 1]] = [newPages[index + 1], newPages[index]];
    setPages(newPages);
  };

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
            <h1 className="text-2xl font-bold tracking-tight">Add New Chapter</h1>
            <p className="text-muted-foreground">Add a new chapter for {manga.title}</p>
          </div>
          <Link to={`/admin/manga/${mangaId}/chapters`}>
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Chapters
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Chapter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isUploading || pages.length === 0}
                >
                  Create Chapter
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Upload Pages</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload images for this chapter. The order matters - first image will be the first page.
              </p>
              <PageUploader 
                pages={pages}
                onChange={setPages}
                onUploadStateChange={setIsUploading}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Pages Preview</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {pages.length} {pages.length === 1 ? 'page' : 'pages'} added
            </p>

            {pages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {pages.map((page, index) => (
                  <div key={index} className="relative group border border-border rounded-md overflow-hidden">
                    <img 
                      src={page} 
                      alt={`Page ${index + 1}`} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <p className="text-white text-xs font-medium">Page {index + 1}</p>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === pages.length - 1}
                        >
                          <ChevronLeft className="h-4 w-4 rotate-180" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemovePage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No pages added yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use the uploader to add pages
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateChapter;
