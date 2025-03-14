
import { Manga } from '@/types/manga';

// Storage key constant
const STORAGE_KEY = 'mangascribe-mangas';

export const getMangasFromStorage = (): Manga[] | null => {
  try {
    const storedMangas = localStorage.getItem(STORAGE_KEY);
    if (!storedMangas) return null;
    
    const parsedMangas = JSON.parse(storedMangas);
    console.log('Loading mangas from localStorage:', parsedMangas);
    return parsedMangas;
  } catch (error) {
    console.error('Failed to parse stored mangas', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const saveMangasToStorage = (mangas: Manga[]): void => {
  try {
    console.log('Saving mangas to localStorage:', mangas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mangas));
    
    // Dispatch a custom event to notify other tabs about the change
    window.dispatchEvent(new CustomEvent('manga-storage-updated'));
  } catch (error) {
    console.error('Failed to save mangas to localStorage', error);
  }
};

// Listen for storage changes from other tabs
export const setupStorageListener = (callback: (mangas: Manga[]) => void): () => void => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const updatedMangas = JSON.parse(event.newValue);
        callback(updatedMangas);
      } catch (error) {
        console.error('Failed to parse updated mangas from storage event', error);
      }
    }
  };
  
  // Listen for our custom event for same-tab updates
  const handleCustomEvent = () => {
    const mangas = getMangasFromStorage();
    if (mangas) {
      callback(mangas);
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('manga-storage-updated', handleCustomEvent);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('manga-storage-updated', handleCustomEvent);
  };
};
