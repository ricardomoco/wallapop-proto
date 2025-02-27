import { useEffect, useState } from "react";

// A custom hook to get the current time updated each minute
export function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000); // Update time every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return time;
}

// A custom hook to handle favorites state
export function useFavorites(initialFavorites: number[] = []) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set(initialFavorites));
  
  const addFavorite = (id: number) => {
    setFavorites(prev => new Set([...Array.from(prev), id]));
  };
  
  const removeFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(Array.from(prev));
      newFavorites.delete(id);
      return newFavorites;
    });
  };
  
  const toggleFavorite = (id: number) => {
    if (favorites.has(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };
  
  const isFavorite = (id: number) => favorites.has(id);
  
  return {
    favorites: Array.from(favorites),
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
