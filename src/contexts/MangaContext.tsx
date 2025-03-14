
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Manga, Chapter, MangaContextType } from '@/types/manga';
import { getMangasFromStorage, saveMangasToStorage, setupStorageListener } from '@/utils/storage';

const MangaContext = createContext<MangaContextType | undefined>(undefined);

export const MangaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const { toast } = useToast();

  // Load mangas from localStorage
  useEffect(() => {
    console.log("MangaProvider: Loading mangas from storage");
    const loadedMangas = getMangasFromStorage();
    setMangas(loadedMangas);
    
    // Setup listener for storage changes
    const cleanup = setupStorageListener((updatedMangas) => {
      console.log("Storage updated, refreshing mangas:", updatedMangas);
      setMangas(updatedMangas);
    });
    
    return cleanup;
  }, []);

  // We don't need to save mangas to localStorage on every change anymore
  // because we're explicitly calling saveMangasToStorage in all our methods

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
    
    const updatedMangas = [...mangas, newManga];
    setMangas(updatedMangas);
    saveMangasToStorage(updatedMangas);
    
    toast({
      title: "Manga created",
      description: `${manga.title} has been added successfully`,
    });
  };

  const updateManga = (id: string, data: Partial<Manga>) => {
    const updatedMangas = mangas.map(manga => {
      if (manga.id === id) {
        return { ...manga, ...data, updatedAt: new Date().toISOString() };
      }
      return manga;
    });
    
    setMangas(updatedMangas);
    saveMangasToStorage(updatedMangas);
    
    toast({
      title: "Manga updated",
      description: "Manga has been updated successfully",
    });
  };

  const deleteManga = (id: string) => {
    const updatedMangas = mangas.filter(manga => manga.id !== id);
    setMangas(updatedMangas);
    saveMangasToStorage(updatedMangas);
    
    toast({
      title: "Manga deleted",
      description: "Manga has been deleted successfully",
      variant: "destructive"
    });
  };

  const getManga = (id: string) => {
    return mangas.find(manga => manga.id === id);
  };

  const getMangaById = (id: string) => {
    return mangas.find(manga => manga.id === id);
  };

  const addChapter = (mangaId: string, chapter: Omit<Chapter, 'id' | 'mangaId' | 'createdAt'>) => {
    const newChapter: Chapter = {
      ...chapter,
      id: crypto.randomUUID(),
      mangaId,
      createdAt: new Date().toISOString(),
    };

    const updatedMangas = mangas.map(manga => {
      if (manga.id === mangaId) {
        return {
          ...manga,
          chapters: [...manga.chapters, newChapter],
          updatedAt: new Date().toISOString(),
        };
      }
      return manga;
    });
    
    setMangas(updatedMangas);
    saveMangasToStorage(updatedMangas);
    
    toast({
      title: "Chapter added",
      description: `Chapter ${chapter.number} has been added successfully`,
    });
  };

  const updateChapter = (mangaId: string, chapterId: string, data: Partial<Chapter>) => {
    const updatedMangas = mangas.map(manga => {
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
    });
    
    setMangas(updatedMangas);
    saveMangasToStorage(updatedMangas);
    
    toast({
      title: "Chapter updated",
      description: "Chapter has been updated successfully",
    });
  };

  const deleteChapter = (mangaId: string, chapterId: string) => {
    const updatedMangas = mangas.map(manga => {
      if (manga.id === mangaId) {
        return {
          ...manga,
          chapters: manga.chapters.filter(chapter => chapter.id !== chapterId),
          updatedAt: new Date().toISOString(),
        };
      }
      return manga;
    });
    
    setMangas(updatedMangas);
    saveMangasToStorage(updatedMangas);
    
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
        getMangaById,
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

export type { Manga, Chapter };
