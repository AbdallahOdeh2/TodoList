import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useCategories } from "../../contexts/CategoryContext";
import { useTodos } from "../../contexts/TodoContext";
import { Progress } from "../ui/Progress";

export default function CategoryBar() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categoryRefs = useRef([]);
  const filterBarRef = useRef(null);
  const { categories } = useCategories();
  const { todos, setFilterMethod } = useTodos();

  // Clean refs on categories change to avoid stale refs
  useEffect(() => {
    categoryRefs.current = categoryRefs.current.slice(0, categories.length);
  }, [categories]);

  // Handle category button click (toggle selection)
  const handleCategoryClick = useCallback(
    (category) => {
      try {
        setSelectedCategories((prevSelected) => {
          let newSelectedCategories;
          if (prevSelected.includes(category)) {
            // Remove if already selected
            newSelectedCategories = prevSelected.filter((c) => c !== category);
          } else {
            // Add if not selected
            newSelectedCategories = [...prevSelected, category];
          }
          // Update filter method in context
          if (newSelectedCategories.length > 0) {
            setFilterMethod(`category_${newSelectedCategories.join("_")}`);
          } else {
            setFilterMethod("all");
          }
          return newSelectedCategories;
        });
      } catch (error) {
        console.error("Error handling category click:", error);
      }
    },
    [setFilterMethod]
  );

  // Get the number of todos for a given category
  const getTodoCount = useCallback(
    (categoryValue) => {
      try {
        return todos.filter(
          (todo) =>
            todo.categories &&
            Array.isArray(todo.categories) &&
            todo.categories.includes(categoryValue)
        ).length;
      } catch (error) {
        console.error("Error getting todo count:", error);
        return 0;
      }
    },
    [todos]
  );

  // Get a contrasting text color (black/white) for a given rgb color
  function getRelativeLuminance(r, g, b) {
    // Convert sRGB component (0-255) to linear value (0-1)
    const srgbToLinear = (c) => {
      const cs = c / 255;
      return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
    };

    const R = srgbToLinear(r);
    const G = srgbToLinear(g);
    const B = srgbToLinear(b);

    // Relative luminance formula
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }

  function hexToRgba(color, alpha = 1) {
    if (!color) return `rgba(255,255,255,${alpha})`;

    // rgb() format
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]},${rgbMatch[2]},${rgbMatch[3]},${alpha})`;
    }

    // Full hex
    const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hexMatch) {
      const r = parseInt(hexMatch[1], 16);
      const g = parseInt(hexMatch[2], 16);
      const b = parseInt(hexMatch[3], 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    // Shorthand hex like #f00
    const shortHexMatch = color.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
    if (shortHexMatch) {
      const r = parseInt(shortHexMatch[1] + shortHexMatch[1], 16);
      const g = parseInt(shortHexMatch[2] + shortHexMatch[2], 16);
      const b = parseInt(shortHexMatch[3] + shortHexMatch[3], 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    return `rgba(255,255,255,${alpha})`;
  }

  function getContrastRatio(lum1, lum2) {
    // lum1 and lum2 are relative luminances; lum1 should be lighter
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  function parseColor(color) {
    // Returns [r, g, b] from hex or rgb string
    if (!color) return [255, 255, 255];

    let r, g, b;
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1]);
      g = parseInt(rgbMatch[2]);
      b = parseInt(rgbMatch[3]);
    } else {
      const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      if (hexMatch) {
        r = parseInt(hexMatch[1], 16);
        g = parseInt(hexMatch[2], 16);
        b = parseInt(hexMatch[3], 16);
      } else {
        // Default fallback color
        return [255, 255, 255];
      }
    }
    return [r, g, b];
  }

  function getContrastColor(backgroundColor) {
    const [r, g, b] = parseColor(backgroundColor);

    const bgLum = getRelativeLuminance(r, g, b);
    const whiteLum = getRelativeLuminance(255, 255, 255);
    const blackLum = getRelativeLuminance(0, 0, 0);

    const contrastWithWhite = getContrastRatio(bgLum, whiteLum);
    const contrastWithBlack = getContrastRatio(bgLum, blackLum);

    // Return the color with better contrast and meets WCAG minimum (4.5:1)
    if (contrastWithWhite >= 4.5 || contrastWithWhite > contrastWithBlack) {
      return "#FFFFFF"; // white text
    } else {
      return "#000000"; // black text
    }
  }

  // For filter bar color, use the first selected category's color, or fallback
  const filterColor = useMemo(() => {
    const firstCat = categories.find((c) => c.value === selectedCategories[0]);
    return firstCat?.color || "#f59e42";
  }, [categories, selectedCategories]);

  // Calculate completed todos count and progress percentage
  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );
  const progressPercent = useMemo(() => {
    return todos.length > 0
      ? Math.round((completedCount / todos.length) * 100)
      : 0;
  }, [completedCount, todos.length]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between mb-6 sm:mb-8 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
          {/* Icons for categories */}
          <div
            className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center p-1.5 shadow-lg"
            style={{ boxShadow: "0 4px 15px rgba(226,232,240,0.8)" }}
          >
            <img
              src="/assets/optimized/category.webp"
              className="w-6 sm:w-8"
              alt="Category icon"
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl text-yellow-300 font-semibold">
              Categories
            </h2>
            <p className="text-xs sm:text-sm text-orange-300 italic font-bold">
              Organize your tasks by category
            </p>
          </div>
        </div>
        {/* Category count */}
        <div className="text-right flex items-center flex-col">
          <div
            className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-t from-amber-200 to-amber-300 flex items-center justify-center rounded-full shadow-md"
            style={{ boxShadow: "0 3px 12px rgba(250,250,0,0.9)" }}
          >
            <span className="text-lg sm:text-xl text-black font-bold">
              {categories.length}
            </span>
          </div>
          <div className="text-xs sm:text-sm mt-1 text-white/80 font-semibold">
            Categories
          </div>
        </div>
      </div>
      {/* === HEADER SECTION === */}

      {/* 3D CATEGORY BAR CONTAINER */}
      <div className="relative z-10">
        <div
          className="flex flex-col items-stretch p-3 sm:p-4 mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90
            border-2 border-slate-700/60 backdrop-blur-xl transition-all duration-100 shadow-xl"
          style={{
            boxShadow:
              "0 16px 48px 5px rgba(31,38,135,0.55), 0 8px 29px 5px #334155",
            border: "2px solid #334155",
            background:
              "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(30,41,59,0.85) 100%)",
            borderRadius: "1.5rem",
          }}
        >
          {/* Horizontal scrollable category buttons */}
          <div
            className="flex gap-3 sm:gap-5 rounded-2xl overflow-x-auto scrollbar-hide category-scrollbar px-2 sm:px-3 py-2 sm:py-4"
            style={{
              transform: "translateZ(0)",
              willChange: "scroll-position",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((cat, index) => {
              const todoCount = getTodoCount(cat.value);
              const isSelected = selectedCategories.includes(cat.value);
              const textColor = getContrastColor(cat.color);
              const totalTodos = todos.length;
              const progressPercentage =
                totalTodos > 0
                  ? Math.min((todoCount / totalTodos) * 100, 100)
                  : 0;

              return (
                <button
                  key={cat.id}
                  ref={(el) => (categoryRefs.current[index] = el)}
                  data-category={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`group relative overflow-hidden rounded-2xl p-2 sm:p-3 transition-all duration-100 cursor-pointer flex-shrink-0
                    min-w-[130px] sm:min-w-[190px] max-w-[150px] sm:max-w-[260px] h-[78px] sm:h-[100px] z-10
                    
                    ${
                      isSelected
                        ? "ring-4 ring-yellow-400 ring-offset-4 scale-105"
                        : "hover:scale-105"
                    }`}
                  style={{
                    backgroundColor: cat.color,
                    // FIX 2: Unified shadow handling with proper RGBA conversion
                    boxShadow: `
                        0 0 8px ${hexToRgba(cat.color, 0.5)},
  0 0 12px ${hexToRgba(cat.color, 0.6)},
  0 0 20px ${hexToRgba(cat.color, 0.4)}
                    `,
                    border: isSelected ? `2.5px solid ${cat.color}` : undefined,
                  }}
                >
                  {/* Category content */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.15)",
                      borderRadius: "inherit",
                      pointerEvents: "none",
                    }}
                  />

                  <div className="relative z-10 w-full">
                    <div className="flex items-center justify-between -mb-0.5 sm:-mb-2">
                      <span className="text-sm sm:text-xl filter drop-shadow-xl sm:-mt-2 flex items-center justify-between">
                        {cat.label || "📝"}
                      </span>

                      <div className="bg-white/40 backdrop-blur-lg rounded-full px-2 py-0.5 sm:px-3 sm:py-1 border-2 border-white/50 flex items-center justify-center min-w-[10px]">
                        <span
                          className="text-xs font-bold leading-none"
                          style={{ color: textColor }}
                        >
                          {todoCount}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-xs sm:text-sm font-semibold sm:mb-2 -mb-0.5"
                      style={{ color: textColor }}
                    >
                      {cat.value || "Unknown"}
                    </div>

                    {/* Updated Progress Bar Section */}
                    <div className="relative">
                      <div className="text-center mb-0.5 sm:mb-1">
                        <span
                          className="text-xs font-bold"
                          style={{ color: textColor }}
                        >
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="relative">
                        <Progress
                          aria-label={`Progress for category ${
                            cat.label || cat.value
                          }: ${progressPercentage.toFixed(1)} percent`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={Math.round(progressPercentage)}
                          value={progressPercentage}
                          className="h-2 bg-black/20"
                          style={{
                            "--progress-color":
                              todoCount > 0
                                ? progressPercentage === 100
                                  ? "#14D109"
                                  : cat.color
                                : "transparent",
                          }}
                        />
                        {todoCount > 0 && progressPercentage < 100 && (
                          <div className="absolute top-0 left-0 h-full w-full rounded-full bg-white/30 animate-pulse" />
                        )}
                      </div>
                    </div>
                    {/* End of Progress Bar Section */}
                  </div>

                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      {selectedCategories.length > 0 && (
        <div className="mt-6" ref={filterBarRef}>
          <div
            className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-md border rounded-3xl p-3 sm:p-5 max-w-full"
            style={{
              border: `2.5px solid ${filterColor}`,
              boxShadow: `4px 4px 10px ${hexToRgba(
                filterColor,
                0.7
              )}, -2px 2px 8px ${hexToRgba(
                filterColor,
                0.4
              )}, 0 4px 16px  #334155`,
              color: "#fff",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium flex flex-wrap gap-x-2 gap-y-1 items-center text-sm sm:text-base">
                    Filtered by:{" "}
                    {selectedCategories.map((catVal) => {
                      const cat = categories.find((c) => c.value === catVal);
                      if (!cat) return null;
                      return (
                        <span
                          key={catVal}
                          className="inline-flex items-center gap-1 sm:gap-2 font-bold px-2 py-0.5 sm:px-3 sm:py-1 mb-1 sm:mb-2 rounded-full shadow-md text-xs sm:text-sm transition-all duration-200 hover:scale-105"
                          style={{
                            color: getContrastColor(cat.color),
                            background: cat.color,
                            // FIX 2: Consistent shadow for all category chips
                            boxShadow: `0 5px 30px ${hexToRgba(
                              cat.color,
                              0.7
                            )}`,
                            border: `2.5px solid ${hexToRgba(
                              getContrastColor(cat.color),
                              0.2
                            )}`,
                          }}
                        >
                          <span className="text-xs sm:text-lg">
                            {cat.label || "🏷️"}
                          </span>
                          <span className="text-xs sm:text-sm font-bold">
                            {catVal}
                          </span>
                          <span
                            className="ml-1 text-xs bg-red-200 hover:bg-red-400 rounded-full px-1 py-0.5 sm:px-2 sm:py-1 cursor-pointer"
                            style={{ fontSize: "0.85em", lineHeight: 1 }}
                            onClick={() => {
                              const newSelected = selectedCategories.filter(
                                (c) => c !== catVal
                              );
                              setSelectedCategories(newSelected);
                              if (newSelected.length === 0)
                                setFilterMethod("all");
                              else
                                setFilterMethod(
                                  `category_${newSelected.join("_")}`
                                );
                            }}
                          >
                            X
                          </span>
                        </span>
                      );
                    })}
                  </p>
                  <p className="text-[10px] sm:text-xs mt-1 font-semibold text-white">
                    Showing{" "}
                    {selectedCategories
                      .map((catVal) => getTodoCount(catVal))
                      .reduce((a, b) => a + b, 0)}{" "}
                    tasks in these categories
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setFilterMethod("all");
                }}
                className="px-2 py-1 sm:px-6 sm:py-3 bg-[#f07373] hover:bg-red-500 rounded-2xl cursor-pointer text-white font-bold transition-all duration-200 hover:scale-105 hover:shadow-xl flex items-center gap-2 border border-orange-400/30"
              >
                <span className="text-xs sm:text-sm">Clear Filter</span>
                <span className="text-xs sm:text-sm text-black bg-gray-300 hover:bg-gray-500 px-1 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  ✕
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats section */}
      <div className="w-full mt-4">
        <div
          className="flex flex-row items-center justify-between rounded-2xl bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90
            border border-slate-700/60 backdrop-blur-2xl divide-x divide-slate-600/40 px-2 py-1 sm:px-4 sm:py-2 gap-1 sm:gap-2"
          style={{
            boxShadow: "0 4px 16px 0 rgba(31,38,135,0.12), 0 1px 4px 0 #334155",
            border: "1.5px solid #334155",
            background:
              "linear-gradient(135deg, rgba(30,41,59,0.92) 0%, rgba(30,41,59,.85) 100%)",
            borderRadius: "1rem",
            minHeight: "48px",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
            <span className="text-lg sm:text-2xl font-bold text-pink-300 flex items-center gap-1">
              <img
                src="/assets/optimized/task.webp"
                className="w-5 sm:w-6"
                alt="Tasks"
              />
              {todos.length}
            </span>
            <span className="mt-0.5 text-[9px] sm:text-xs text-pink-300 font-semibold tracking-wide uppercase whitespace-nowrap">
              Total
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
            <span className="text-lg sm:text-2xl font-bold text-green-300 flex items-center gap-1">
              <img
                src="/assets/optimized/checked.webp"
                className="w-5 sm:w-6 mr-0.5"
                alt="Completed"
              />
              {completedCount}
            </span>
            <span className="mt-0.5 text-[9px] sm:text-xs text-green-200 font-semibold tracking-wide uppercase whitespace-nowrap">
              Completed
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
            <span className="text-lg sm:text-2xl font-bold text-orange-300 flex items-center gap-1">
              <img
                src="/assets/optimized/work-in-progress.webp"
                className="w-5 sm:w-6 mr-0.5"
                alt="Progress"
              />
              {progressPercent > 0 ? `${progressPercent}%` : "0%"}
            </span>
            <span className="mt-0.5 text-[9px] sm:text-xs text-orange-300/90 font-semibold tracking-wide uppercase whitespace-nowrap">
              Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
