
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

export interface Chapter {
  id: string;
  mangaId: string;
  title: string;
  number: number;
  pages: string[]; // Array of image URLs
  createdAt: string;
}

export interface Manga {
  id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  genres: string[];
  status: 'ongoing' | 'completed';
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  rating?: number;
  views?: number;
}

interface MangaContextType {
  mangas: Manga[];
  addManga: (manga: Omit<Manga, 'id' | 'createdAt' | 'updatedAt' | 'chapters'>) => void;
  updateManga: (id: string, data: Partial<Manga>) => void;
  deleteManga: (id: string) => void;
  getManga: (id: string) => Manga | undefined;
  addChapter: (mangaId: string, chapter: Omit<Chapter, 'id' | 'mangaId' | 'createdAt'>) => void;
  updateChapter: (mangaId: string, chapterId: string, data: Partial<Chapter>) => void;
  deleteChapter: (mangaId: string, chapterId: string) => void;
  getChapter: (mangaId: string, chapterId: string) => Chapter | undefined;
}

const MangaContext = createContext<MangaContextType | undefined>(undefined);

export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load mangas from localStorage
    const storedMangas = localStorage.getItem('mangas');
    if (storedMangas) {
      try {
        setMangas(JSON.parse(storedMangas));
      } catch (error) {
        console.error('Failed to parse stored mangas', error);
        localStorage.removeItem('mangas');
      }
    }
  }, []);

  // Save mangas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mangas', JSON.stringify(mangas));
  }, [mangas]);

  const addManga = (manga: Omit<Manga, 'id' | 'createdAt' | 'updatedAt' | 'chapters'>) => {
    const now = new Date().toISOString();
    const newManga: Manga = {
      ...manga,
      id: crypto.randomUUID(),
      chapters: [],
      createdAt: now,
      updatedAt: now,
      views: 0,
      rating: 0
    };
    setMangas(prev => [...prev, newManga]);
    toast({
      title: "Manga created",
      description: `${manga.title} has been added successfully`,
    });
  };

  const updateManga = (id: string, data: Partial<Manga>) => {
    setMangas(prev => prev.map(manga => {
      if (manga.id === id) {
        return { ...manga, ...data, updatedAt: new Date().toISOString() };
      }
      return manga;
    }));
    toast({
      title: "Manga updated",
      description: "Manga has been updated successfully",
    });
  };

  const deleteManga = (id: string) => {
    setMangas(prev => prev.filter(manga => manga.id !== id));
    toast({
      title: "Manga deleted",
      description: "Manga has been deleted successfully",
      variant: "destructive"
    });
  };

  const getManga = (id: string) => {
    return mangas.find(manga => manga.id === id);
  };

  const addChapter = (mangaId: string, chapter: Omit<Chapter, 'id' | 'mangaId' | 'createdAt'>) => {
    const newChapter: Chapter = {
      ...chapter,
      id: crypto.randomUUID(),
      mangaId,
      createdAt: new Date().toISOString(),
    };

    setMangas(prev => prev.map(manga => {
      if (manga.id === mangaId) {
        return {
          ...manga,
          chapters: [...manga.chapters, newChapter],
          updatedAt: new Date().toISOString(),
        };
      }
      return manga;
    }));
    toast({
      title: "Chapter added",
      description: `Chapter ${chapter.number} has been added successfully`,
    });
  };

  const updateChapter = (mangaId: string, chapterId: string, data: Partial<Chapter>) => {
    setMangas(prev => prev.map(manga => {
      if (manga.id === mangaId) {
        return {
          ...manga,
          chapters: manga.chapters.map(chapter => {
            if (chapter.id === chapterId) {
              return { ...chapter, ...data };
            }
            return chapter;
          }),
          updatedAt: new Date().toISOString(),
        };
      }
      return manga;
    }));
    toast({
      title: "Chapter updated",
      description: "Chapter has been updated successfully",
    });
  };

  const deleteChapter = (mangaId: string, chapterId: string) => {
    setMangas(prev => prev.map(manga => {
      if (manga.id === mangaId) {
        return {
          ...manga,
          chapters: manga.chapters.filter(chapter => chapter.id !== chapterId),
          updatedAt: new Date().toISOString(),
        };
      }
      return manga;
    }));
    toast({
      title: "Chapter deleted",
      description: "Chapter has been deleted successfully",
      variant: "destructive"
    });
  };

  const getChapter = (mangaId: string, chapterId: string) => {
    const manga = mangas.find(m => m.id === mangaId);
    if (!manga) return undefined;
    return manga.chapters.find(c => c.id === chapterId);
  };

  return (
    <MangaContext.Provider
      value={{
        mangas,
        addManga,
        updateManga,
        deleteManga,
        getManga,
        addChapter,
        updateChapter,
        deleteChapter,
        getChapter,
      }}
    >
      {children}
    </MangaContext.Provider>
  );
};

export const useManga = () => {
  const context = useContext(MangaContext);
  if (context === undefined) {
    throw new Error('useManga must be used within a MangaProvider');
  }
  return context;
};
