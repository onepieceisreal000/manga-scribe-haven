
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploaderProps {
  onImageSelected: (imageUrl: string) => void;
  className?: string;
  defaultImage?: string;
}

const ImageUploader = ({ onImageSelected, className, defaultImage }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelected(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      setPreview(imageUrl);
      onImageSelected(imageUrl);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelected("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-64 rounded-md object-cover mx-auto"
            onError={() => setPreview("/placeholder.svg")}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="url">Image URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-700 rounded-md p-8 text-center cursor-pointer hover:border-gray-500 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </TabsContent>
          <TabsContent value="url">
            {/* Fix: Use div instead of form to avoid nesting forms */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="url"
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleUrlSubmit}>
                  <LinkIcon size={16} className="mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ImageUploader;
