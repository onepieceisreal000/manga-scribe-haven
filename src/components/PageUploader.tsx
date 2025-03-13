
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, ArrowDown, Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import ImageUploader from "./ImageUploader";

interface PageUploaderProps {
  pages: string[];
  onChange: (pages: string[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
}

const PageUploader = ({ pages, onChange, onUploadStateChange }: PageUploaderProps) => {
  const [showUploader, setShowUploader] = useState(false);

  const addPage = (imageUrl: string) => {
    if (imageUrl) {
      onChange([...pages, imageUrl]);
      setShowUploader(false);
      if (onUploadStateChange) onUploadStateChange(false);
    }
  };

  const removePage = (index: number) => {
    const newPages = [...pages];
    newPages.splice(index, 1);
    onChange(newPages);
  };

  const movePage = (fromIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && fromIndex === 0) || 
      (direction === 'down' && fromIndex === pages.length - 1)
    ) {
      return;
    }

    const newPages = [...pages];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    const [movedItem] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedItem);
    onChange(newPages);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-medium">Chapter Pages</h3>
        <Button
          size="sm"
          onClick={() => {
            setShowUploader(true);
            if (onUploadStateChange) onUploadStateChange(true);
          }}
          disabled={showUploader}
          className="bg-manga-accent hover:bg-manga-accent/90 transition-all duration-300"
        >
          <Plus size={16} className="mr-2" />
          Add Page
        </Button>
      </div>

      {showUploader && (
        <div className="glass-card p-5 rounded-md border border-gray-700 animate-scale-in">
          <h4 className="font-medium mb-3 font-display">Add New Page</h4>
          <ImageUploader onImageSelected={addPage} />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setShowUploader(false);
              if (onUploadStateChange) onUploadStateChange(false);
            }}
            className="mt-3 transition-all duration-300"
          >
            Cancel
          </Button>
        </div>
      )}

      {pages.length > 0 ? (
        <ScrollArea className="h-[400px] border border-gray-700 rounded-md p-2 scrollbar">
          <div className="space-y-3">
            {pages.map((page, index) => (
              <div 
                key={index} 
                className="flex items-center p-3 glass-card rounded-md border border-gray-700 transition-all hover:border-manga-accent/50 duration-300"
              >
                <GripVertical size={16} className="mr-2 text-gray-500" />
                <div className="w-16 h-16 relative overflow-hidden rounded-md mr-3 border border-gray-700">
                  <img 
                    src={page} 
                    alt={`Page ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-manga">Page {index + 1}</p>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-8 w-8 transition-colors duration-300 hover:border-manga-accent/50"
                    onClick={() => movePage(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp size={14} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="h-8 w-8 transition-colors duration-300 hover:border-manga-accent/50"
                    onClick={() => movePage(index, 'down')}
                    disabled={index === pages.length - 1}
                  >
                    <ArrowDown size={14} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    className="h-8 w-8 transition-colors duration-300"
                    onClick={() => removePage(index)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="py-10 text-center border border-dashed border-gray-700 rounded-md animate-fade-in">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 font-manga">No pages added yet. Add pages to create a chapter.</p>
        </div>
      )}
    </div>
  );
};

export default PageUploader;
