
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
  isNsfw?: boolean;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  rating?: number;
  views?: number;
}

export interface MangaContextType {
  mangas: Manga[];
  addManga: (manga: Omit<Manga, 'id' | 'createdAt' | 'updatedAt' | 'chapters'>) => void;
  updateManga: (id: string, data: Partial<Manga>) => void;
  deleteManga: (id: string) => void;
  getManga: (id: string) => Manga | undefined;
  getMangaById: (id: string) => Manga | undefined;
  addChapter: (mangaId: string, chapter: Omit<Chapter, 'id' | 'mangaId' | 'createdAt'>) => void;
  updateChapter: (mangaId: string, chapterId: string, data: Partial<Chapter>) => void;
  deleteChapter: (mangaId: string, chapterId: string) => void;
  getChapter: (mangaId: string, chapterId: string) => Chapter | undefined;
}
