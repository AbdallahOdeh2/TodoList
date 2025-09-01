/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useContext, createContext } from "react";

import { v4 as uuidv4 } from "uuid";

const TodoContext = createContext();

const defaultTodos = [];

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem("todos");
    let loaded = stored ? JSON.parse(stored) : defaultTodos;
    // Ensure all todos have a pinned property
    loaded = loaded.map((todo) => ({
      ...todo,
      pinned: typeof todo.pinned === "boolean" ? todo.pinned : false,
    }));
    return loaded;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [sortBy, setSortBy] = useState("custom");
  const [filterBy, setFilterBy] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Search functionality with error handling
  useEffect(() => {
    try {
      if (!searchQuery.trim()) {
        setFilteredTodos(todos);
        return;
      }

      const query = searchQuery.toLowerCase().trim();
      const filtered = todos.filter((todo) => {
        // Search in title
        if (todo.title && todo.title.toLowerCase().includes(query)) return true;

        // Search in description
        if (todo.description && todo.description.toLowerCase().includes(query))
          return true;

        // Search in categories
        if (
          todo.categories &&
          Array.isArray(todo.categories) &&
          todo.categories.some(
            (cat) => cat && cat.toLowerCase().includes(query)
          )
        )
          return true;

        return false;
      });

      setFilteredTodos(filtered);
    } catch (error) {
      console.error("Search error:", error);
      setFilteredTodos(todos);
    }
  }, [searchQuery, todos]);

  // Sort and filter functionality with error handling
  useEffect(() => {
    try {
      setIsLoading(true);
      let processedTodos = [...todos];

      // Apply filters
      switch (filterBy) {
        case "completed":
          processedTodos = processedTodos.filter((todo) => todo.completed);
          break;
        case "pending":
          processedTodos = processedTodos.filter((todo) => !todo.completed);
          break;
        case "high_priority":
          processedTodos = processedTodos.filter(
            (todo) => todo.priority === "high"
          );
          break;
        case "medium_priority":
          processedTodos = processedTodos.filter(
            (todo) => todo.priority === "medium"
          );
          break;
        case "low_priority":
          processedTodos = processedTodos.filter(
            (todo) => todo.priority === "low"
          );
          break;
        case "pinned":
          processedTodos = processedTodos.filter(
            (todo) => todo.pinned === true
          );
          break;
        case "overdue":
          processedTodos = processedTodos.filter((todo) => {
            if (!todo.endDate) return false;
            return new Date(todo.endDate) < new Date() && !todo.completed;
          });
          break;
        default:
          // Handle category filters
          if (filterBy.startsWith("category_")) {
            const categoryValue = filterBy.replace("category_", "");
            processedTodos = processedTodos.filter(
              (todo) =>
                todo.categories &&
                Array.isArray(todo.categories) &&
                todo.categories.includes(categoryValue)
            );
          }
          break;
      }

      // If sortBy is a priority filter, apply it on top of the existing filter
      if (
        sortBy === "high_priority" ||
        sortBy === "medium_priority" ||
        sortBy === "low_priority"
      ) {
        const priority = sortBy.replace("_priority", "");
        processedTodos = processedTodos.filter(
          (todo) => todo.priority === priority
        );
      }

      // Apply sorting
      switch (sortBy) {
        case "alphabetical":
          processedTodos.sort((a, b) => {
            const titleA = a.title || "";
            const titleB = b.title || "";
            return titleA.localeCompare(titleB);
          });
          break;
        case "dueDate":
          processedTodos.sort((a, b) => {
            if (!a.endDate && !b.endDate) return 0;
            if (!a.endDate) return 1;
            if (!b.endDate) return -1;
            return new Date(a.endDate) - new Date(b.endDate);
          });
          break;
        case "dateCreated":
          processedTodos.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
          });
          break;
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          processedTodos.sort((a, b) => {
            const aPriority = priorityOrder[a.priority] || 0;
            const bPriority = priorityOrder[b.priority] || 0;
            return bPriority - aPriority;
          });
          break;
        }
        case "status":
          processedTodos.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          });
          break;
        // Do not sort for high_priority, medium_priority, low_priority (already filtered)
        default:
          // Custom sorting: pinned first, then by creation date
          processedTodos.sort((a, b) => {
            // Pinned items first
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            // Then by creation date (newest first)
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
          });
          break;
      }

      setFilteredTodos(processedTodos);
    } catch (error) {
      console.error("Filter/Sort error:", error);
      setFilteredTodos(todos);
    } finally {
      setIsLoading(false);
    }
  }, [todos, sortBy, filterBy]);

  const addTodo = (todoData) => {
    try {
      const newTodo = {
        id: uuidv4(),
        title: todoData.title || "Untitled Task",
        description: todoData.description || "",
        categories: Array.isArray(todoData.categories)
          ? todoData.categories
          : [],
        priority: todoData.priority || "medium",
        startDate: todoData.startDate
          ? new Date(todoData.startDate).toISOString()
          : null,
        endDate: todoData.endDate
          ? new Date(todoData.endDate).toISOString()
          : null,
        completed: todoData.completed || false,
        pinned: todoData.pinned || false,
        emoji: todoData.emoji || "📝",
        color: todoData.color || "rgb(131, 92, 240)",
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error("Add todo error:", error);
    }
  };

  const deleteTodo = (id) => {
    try {
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Delete todo error:", error);
    }
  };

  const updateTodo = (id, updates) => {
    try {
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
      );
    } catch (error) {
      console.error("Update todo error:", error);
    }
  };

  const toggleTodoComplete = (id) => {
    try {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      console.error("Toggle complete error:", error);
    }
  };

  const toggleTodoPin = (id) => {
    try {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, pinned: !todo.pinned } : todo
        )
      );
    } catch (error) {
      console.error("Toggle pin error:", error);
    }
  };

  const searchTodos = (query) => {
    try {
      setSearchQuery(query);
    } catch (error) {
      console.error("Search todos error:", error);
    }
  };

  const clearSearch = () => {
    try {
      setSearchQuery("");
    } catch (error) {
      console.error("Clear search error:", error);
    }
  };

  const setSortMethod = (method) => {
    try {
      setSortBy(method);
    } catch (error) {
      console.error("Set sort method error:", error);
    }
  };

  const setFilterMethod = (method) => {
    try {
      setFilterBy(method);
    } catch (error) {
      console.error("Set filter method error:", error);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        filteredTodos,
        searchQuery,
        sortBy,
        filterBy,
        isLoading,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodoComplete,
        toggleTodoPin,
        searchTodos,
        clearSearch,
        setSortMethod,
        setFilterMethod,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
