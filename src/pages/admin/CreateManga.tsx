
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useManga } from '@/contexts/MangaContext';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 
  'Sports', 'Supernatural', 'Thriller'
];

const CreateManga = () => {
  const { addManga } = useManga();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'ongoing' | 'completed'>('ongoing');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !author || !coverImage || selectedGenres.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate a delay for better UX
    setTimeout(() => {
      addManga({
        title,
        description,
        author,
        coverImage,
        genres: selectedGenres,
        status,
      });
      
      setIsSubmitting(false);
      navigate('/admin/manga');
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Manga</h1>
          <p className="text-gray-400">Add a new manga to your library</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter manga title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-manga-primary border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Enter author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-manga-primary border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter manga description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] bg-manga-primary border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <RadioGroup 
                  value={status} 
                  onValueChange={(value) => setStatus(value as 'ongoing' | 'completed')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ongoing" id="ongoing" />
                    <Label htmlFor="ongoing" className="cursor-pointer">Ongoing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id="completed" />
                    <Label htmlFor="completed" className="cursor-pointer">Completed</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Genres (select up to 5)</Label>
                <ScrollArea className="h-[120px] border border-gray-700 rounded-md p-3 bg-manga-primary">
                  <div className="flex flex-wrap gap-2">
                    {GENRE_OPTIONS.map((genre) => (
                      <Badge
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedGenres.includes(genre) 
                            ? "bg-blue-600 hover:bg-blue-700" 
                            : "hover:bg-manga-secondary"
                        }`}
                        onClick={() => toggleGenre(genre)}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
                {selectedGenres.length > 0 && (
                  <div className="text-sm text-gray-400">
                    Selected: {selectedGenres.join(', ')}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUploader 
                onImageSelected={setCoverImage} 
                className="bg-manga-primary border border-gray-700 rounded-md p-4"
              />
              <p className="text-xs text-gray-400 mt-2">
                Upload a cover image for your manga or provide a URL.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/manga')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title || !description || !author || !coverImage || selectedGenres.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Manga'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateManga;
