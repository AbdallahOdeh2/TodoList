/* eslint-disable react-refresh/only-export-components */
import {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";

const CategoryContext = createContext();

const defaultCategories = [
  {
    id: uuidv4(),
    label: "💻",
    value: "Coding",
    color: "rgb(131,92,240)",
    isFavorite: false,
  },
  {
    id: uuidv4(),
    label: "🏢",
    value: "Work",
    color: "rgb(36,142,255)",
    isFavorite: false,
  },
  {
    id: uuidv4(),
    label: "📚",
    value: "Education",
    color: "rgb(255,158,66)",
    isFavorite: false,
  },
  {
    id: uuidv4(),
    label: "🏡",
    value: "Home",
    color: "rgb(83,228,93)",
    isFavorite: false,
  },
  {
    id: uuidv4(),
    label: "🧔🏻",
    value: "Personal",
    color: "rgb(240,134,254)",
    isFavorite: false,
  },
  {
    id: uuidv4(),
    label: "💪",
    value: "Health/Fitness",
    color: "rgb(254,229,103)",
    isFavorite: false,
  },
];

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem("categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((cat) => ({
          id: cat.id || uuidv4(),
          label: cat.label || "📝",
          value: cat.value || "Unknow",
          color: cat.color || "rgb(131,92,240)",
          isFavorite: cat.isFavorite || false,
        }));
      }
      return defaultCategories;
    } catch (error) {
      console.error("Error loading categories", error);
      return defaultCategories;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories :", error);
    }
  }, [categories]);

  // Memoize all functions to prevent unnecessary re-renders
  const toggleFavorite = useCallback((id) => {
    try {
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, isFavorite: !cat.isFavorite } : cat
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }, []);

  const addCategory = useCallback((newCategory) => {
    try {
      const newId = uuidv4();
      const categoryToAdd = {
        id: newId,
        label: newCategory.label || "📝",
        value: newCategory.value || "New Category",
        color: newCategory.color || "rgb(131,92,240)",
        isFavorite: newCategory.isFavorite || false,
      };
      setCategories((prevCategories) => [...prevCategories, categoryToAdd]);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  }, []);

  const editCategory = useCallback((id, updates) => {
    try {
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat
        )
      );
    } catch (error) {
      console.error("Error editing categories :", error);
    }
  }, []);

  const deleteCategory = useCallback((id) => {
    try {
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
    } catch (error) {
      console.error("Error deleting category :", error);
    }
  }, []);

  const getCategoryByValue = useCallback(
    (value) => {
      try {
        return categories.find((cat) => cat.value === value);
      } catch (error) {
        console.error("Error getting category by value :", error);
        return null;
      }
    },
    [categories]
  );

  const categoryExists = useCallback(
    (value) => {
      try {
        return categories.some((cat) => cat.value === value);
      } catch (error) {
        console.error("Error checking category existence :", error);
        return false;
      }
    },
    [categories]
  );

  const getFavoriteCategories = useCallback(() => {
    try {
      return categories.filter((cat) => cat.isFavorite);
    } catch (error) {
      console.error("Error getting favorite categories", error);
      return [];
    }
  }, [categories]);

  const resetToDefaults = useCallback(() => {
    try {
      setCategories(defaultCategories);
    } catch (error) {
      console.error("Error resetting to defaults:", error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      categories,
      toggleFavorite,
      addCategory,
      deleteCategory,
      editCategory,
      getCategoryByValue,
      categoryExists,
      getFavoriteCategories,
      resetToDefaults,
    }),
    [
      categories,
      toggleFavorite,
      addCategory,
      deleteCategory,
      editCategory,
      getCategoryByValue,
      categoryExists,
      getFavoriteCategories,
      resetToDefaults,
    ]
  );

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("usecategories must be used within a CategoryProvider");
  }
  return context;
};
