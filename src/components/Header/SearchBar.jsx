/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useMemo } from "react";
import { useTodos } from "../../contexts/TodoContext";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import all from "/assets/optimized/all.webp";
import { gsap } from "gsap";

export default function SearchBar() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(() => {
    return localStorage.getItem("selectedFilter") || "All";
  });
  const [selectedSort, setSelectedSort] = useState(() => {
    return localStorage.getItem("selectedSort") || "Alphabetical";
  });

  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");
  const filterDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  const filterDropdownMenuRef = useRef(null);
  const sortButtonRef = useRef(null);
  const sortDropdownMenuRef = useRef(null);

  const { searchTodos, clearSearch, setFilterMethod, setSortMethod, todos } =
    useTodos();

  const debounceTimeoutRef = useRef(null);

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous debounce timer
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new debounce timer (e.g., 300ms)
    debounceTimeoutRef.current = setTimeout(() => {
      try {
        searchTodos(value);
      } catch (error) {
        console.error("Error handling search change:", error);
        setError("Failed to search tasks");
      }
    }, 300);
  };

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle clear search
  const handleClearSearch = () => {
    try {
      setSearchValue("");
      clearSearch();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    } catch (error) {
      console.error("Error clearing search:", error);
      setError("Failed to clear search");
    }
  };

  const getThemeColor = useMemo(() => {
    return () => {
      if (!todos || todos.length === 0) return "rgb(225,225,48)";
      const colorCounts = {};
      todos.forEach((todo) => {
        if (todo.color) {
          colorCounts[todo.color] = (colorCounts[todo.color] || 0) + 1;
        }
      });
      const mostCommonColor = Object.keys(colorCounts).reduce(
        (a, b) => (colorCounts[a] > colorCounts[b] ? a : b),
        Object.keys(colorCounts)[0]
      );
      return mostCommonColor || "rgb(225,225,48)";
    };
  }, [todos]);

  const themeColor = useMemo(() => getThemeColor(), [todos, getThemeColor]);

  const filterOptions = useMemo(
    () => [
      {
        label: "All",
        icon: <img src={all} className="w-4 sm:w-5" alt="all icon" />,
        bgColor: "from-purple-600/20 to-purple-800/20",
        borderColor: "border-purple-500/30",
        hoverColor: "hover:from-purple-600/30 hover:to-purple-800/30",
        textColor: "text-purple-300",
        selectedBg: "bg-purple-600/30",
        selectedBorder: "border-purple-500/50",
        value: "all",
        color: "rgb(168, 85, 247)", // purple-500
      },
      {
        label: "Completed",
        icon: (
          <img
            src="/assets/optimized/completed.webp"
            className="w-4 sm:w-5"
            alt="completed icon"
          />
        ),
        bgColor: "from-emerald-600/20 to-emerald-800/20",
        borderColor: "border-emerald-500/30",
        hoverColor: "hover:from-emerald-600/30 hover:to-emerald-800/30",
        textColor: "text-emerald-300",
        selectedBg: "bg-emerald-600/30",
        selectedBorder: "border-emerald-500/50",
        value: "completed",
        color: "rgb(16, 185, 129)", // emerald-500
      },
      {
        label: "Pinned",
        icon: (
          <img
            src="/assets/optimized/pin.webp"
            className="w-4 sm:w-5"
            alt="pin icon"
          />
        ),
        bgColor: "from-yellow-400/20 to-yellow-600/20",
        borderColor: "border-yellow-400/30",
        hoverColor: "hover:from-yellow-400/30 hover:to-yellow-600/30",
        textColor: "text-yellow-400",
        selectedBg: "bg-yellow-400/30",
        selectedBorder: "border-yellow-400/50",
        value: "pinned",
        color: "rgb(251, 191, 36)", // yellow-400
      },
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      {
        label: "Alphabetical",
        icon: (
          <img
            src="/assets/optimized/abc-block.webp"
            className="w-4 sm:w-5"
            alt="abc icon"
          />
        ),
        bgColor: "from-blue-600/20 to-blue-800/20",
        borderColor: "border-blue-500/30",
        hoverColor: "hover:from-blue-600/30 hover:to-blue-800/30",
        textColor: "text-blue-300",
        selectedBg: "bg-blue-600/30",
        selectedBorder: "border-blue-500/50",
        value: "alphabetical",
        color: "rgb(59, 130, 246)", // blue-500
      },
      {
        label: "Date Created",
        icon: (
          <img
            src="/assets/optimized/schedule.webp"
            className="w-4 sm:w-5"
            alt="time table icon"
          />
        ),
        bgColor: "from-orange-600/20 to-orange-800/20",
        borderColor: "border-orange-500/30",
        hoverColor: "hover:from-orange-600/30 hover:to-orange-800/30",
        textColor: "text-orange-300",
        selectedBg: "bg-orange-600/30",
        selectedBorder: "border-orange-400/50",
        value: "dateCreated",
        color: "rgb(249, 115, 22)", // orange-500
      },
      {
        label: "High",
        icon: (
          <img
            src="/assets/optimized/high.webp"
            className="w-4 sm:w-5"
            alt="high priority"
          />
        ),
        bgColor: "from-red-600/20 to-red-800/20",
        borderColor: "border-red-500/30",
        hoverColor: "hover:from-red-600/30 hover:to-red-800/30",
        textColor: "text-red-300",
        selectedBg: "bg-red-600/30",
        selectedBorder: "border-red-500/50",
        value: "priority",
        color: "rgb(239, 68, 68)", // red-500
      },
      {
        label: "Medium",
        icon: (
          <img
            src="/assets/optimized/medium.webp"
            className="w-4 sm:w-5"
            alt="medium priority"
          />
        ),
        bgColor: "from-yellow-400/20 to-yellow-600/20",
        borderColor: "border-yellow-400/30",
        hoverColor: "hover:from-yellow-400/30 hover:to-yellow-600/30",
        textColor: "text-yellow-400",
        selectedBg: "bg-yellow-400/30",
        selectedBorder: "border-yellow-400/50",
        value: "medium_priority",
        color: "rgb(251, 180, 36)", // yellow-400
      },
      {
        label: "Low",
        icon: (
          <img
            src="/assets/optimized/low.webp"
            className="w-4 sm:w-5"
            alt="low priority"
          />
        ),
        bgColor: "from-green-400/20 to-green-600/20",
        borderColor: "border-green-400/30",
        hoverColor: "hover:from-green-400/30 hover:to-green-600/30",
        textColor: "text-green-400",
        selectedBg: "bg-green-400/30",
        selectedBorder: "border-green-400/50",
        value: "low_priority",
        color: "rgb(34, 197, 94)", // green-500
      },
    ],
    []
  );

  useEffect(() => {
    if (openFilter && filterDropdownMenuRef.current) {
      gsap.fromTo(
        filterDropdownMenuRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power4.out",
        }
      );
    }
  }, [openFilter]);

  useEffect(() => {
    if (openSort && sortDropdownMenuRef.current) {
      gsap.fromTo(
        sortDropdownMenuRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        }
      );
    }
  }, [openSort]);

  useEffect(() => {
    const backdrop = document.querySelector(".searchbar-backdrop");
    if (backdrop) {
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power1.out" }
      );
    }
  }, [openFilter, openSort]);

  const handleFilterChange = (option) => {
    try {
      // Immediately update state and storage
      setSelectedFilter(option.label);
      setFilterMethod(option.value);
      setOpenFilter(false);
      localStorage.setItem("selectedFilter", option.label);

      // Run bounce animation
      safeGsapAnimation(() => {
        gsap.fromTo(
          filterButtonRef.current,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.3,
            ease: "elastic.out(1.2, 0.75)",
            yoyo: true,
            repeat: 1,
          }
        );
      });
    } catch (error) {
      console.error("Error changing filter:", error);
      setError("Failed to change filter");
    }
  };

  const safeGsapAnimation = (animationFn) => {
    try {
      animationFn();
    } catch (error) {
      console.error("GSAP animation error:", error);
    }
  };

  const handleSortChange = (option) => {
    try {
      // Immediately update state and storage
      setSelectedSort(option.label);
      setSortMethod(option.value);
      setOpenSort(false);
      localStorage.setItem("selectedSort", option.label);

      // Run bounce animation
      safeGsapAnimation(() => {
        gsap.fromTo(
          sortButtonRef.current,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.3,
            ease: "elastic.out(1.2, 0.75)",
            yoyo: true,
            repeat: 1,
          }
        );
      });
    } catch (error) {
      console.error("Error changing sort:", error);
      setError("Failed to change sort");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      try {
        if (
          filterDropdownRef.current &&
          !filterDropdownRef.current.contains(e.target)
        ) {
          setOpenFilter(false);
        }
        if (
          sortDropdownRef.current &&
          !sortDropdownRef.current.contains(e.target)
        ) {
          setOpenSort(false);
        }
      } catch (error) {
        console.error("Error handling click outside:", error);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ensure filter and sort are applied on mount if loaded from localStorage
  useEffect(() => {
    const savedFilter = localStorage.getItem("selectedFilter");
    if (savedFilter) {
      const filterOption = filterOptions.find(
        (opt) => opt.label === savedFilter
      );
      if (filterOption) setFilterMethod(filterOption.value);
    }
    const savedSort = localStorage.getItem("selectedSort");
    if (savedSort) {
      const sortOption = sortOptions.find((opt) => opt.label === savedSort);
      if (sortOption) setSortMethod(sortOption.value);
    }
  }, [filterOptions, sortOptions, setFilterMethod, setSortMethod]);

  const allFilterOptions = useMemo(() => [...filterOptions], [filterOptions]);

  // Get current filter option styling
  const currentFilterOption = allFilterOptions.find(
    (opt) => opt.label === selectedFilter
  );

  // Get current sort option styling
  const currentSortOption =
    sortOptions.find((opt) => opt.label === selectedSort) || sortOptions[0];

  // Handle errors gracefully
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-400 hover:text-red-300"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      {(openFilter || openSort) && (
        <div
          className="searchbar-backdrop fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
          style={{ pointerEvents: "auto" }}
          onClick={() => {
            setOpenFilter(false);
            setOpenSort(false);
          }}
        />
      )}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full min-w-0 items-center">
        {/* SEARCH BAR */}
        <div className="w-full sm:w-auto sm:flex-1">
          <div
            className="flex items-center gap-2 backdrop-blur-xl text-white font-mono px-3 sm:px-6 py-2 sm:py-5 rounded-2xl 
             shadow-xl duration-300 border border-white/80 w-full min-w-0
             focus-within:scale-[1.02] focus-within:shadow-[0_0_0_6px_rgba(255,255,255,0.5)] 
             focus-within:ring-2 focus-within:ring-white/60 flex-1 transition-transform transform-gpu
"
            style={{
              background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}10)`,
              backgroundColor: `${themeColor}30`,
              boxShadow: `0 2px 12px 0 rgba(140, 150, 250, 0.7), 0 2px 10px 0 rgba(140, 155, 255, 0.9)`,
              "--tw-ring-color": `#fff8`,
            }}
          >
            <SearchIcon
              className="text-gray-300 search-icon"
              style={{ fontSize: "20px" }}
            />
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search for tasks..."
              className="focus:outline-none text-sm sm:text-md text-orange-300 font-black placeholder:text-yellow-400 placeholder:font-black w-full
              min-w-0 flex-1 bg-transparent overflow-x-auto whitespace-nowrap"
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="text-red-400 text-xl hover:text-red-600 flex items-center justify-center p-0.5 sm:p-1 rounded-full bg-white/20 cursor-pointer hover:bg-white/70"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        {/* FILTER BUTTON */}
        <div className="flex flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto items-center">
          <div className="relative w-1/2 sm:w-auto" ref={filterDropdownRef}>
            <button
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-6 py-2 sm:py-4 bg-gradient-to-r ${currentFilterOption?.bgColor} backdrop-blur-2xl rounded-2xl text-white text-xs sm:text-sm cursor-pointer font-medium border ${currentFilterOption?.borderColor} ${currentFilterOption?.hoverColor}  shadow-lg hover:shadow-xl w-full transition-colors duration-200`}
              ref={filterButtonRef}
              onClick={() => {
                setOpenFilter(!openFilter);
                setOpenSort(false);
              }}
              style={{
                boxShadow:
                  currentFilterOption && currentFilterOption.color
                    ? `0 6px 16px ${currentFilterOption.color
                        .replace("rgb", "rgba")
                        .replace(
                          ")",
                          ", 0.5)"
                        )}, 0 2px 8px ${currentFilterOption.color
                        .replace("rgb", "rgba")
                        .replace(")", ", 0.25)")}`
                    : undefined,
                backgroundColor:
                  currentFilterOption && currentFilterOption.color
                    ? currentFilterOption.color
                    : undefined,
              }}
            >
              <span className="flex items-center">
                {
                  allFilterOptions.find((opt) => opt.label === selectedFilter)
                    ?.icon
                }
              </span>
              <span className="min-w-0 text-xs sm:text-sm font-semibold truncate">
                {selectedFilter}
              </span>
              <span
                className={`transform transition-transform duration-100 ${
                  openFilter ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openFilter && (
              <div
                ref={filterDropdownMenuRef}
                className="absolute right-0 bottom-full mb-2 p-2 sm:p-4 w-48 sm:w-64 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl z-50 border border-gray-600/50 max-h-72 overflow-y-auto scrollbar-hide flex flex-col gap-y-1 sm:gap-y-2"
              >
                {allFilterOptions.map((option, index) => (
                  <div
                    key={option.label}
                    onClick={() => {
                      handleFilterChange(option);
                      setOpenFilter(false);
                    }}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer text-white rounded-2xl transition-all duration-200 hover:bg-gradient-to-r ${
                      option.bgColor
                    } hover:border ${option.borderColor} ${
                      option.label === selectedFilter
                        ? `${option.selectedBg} border ${option.selectedBorder} font-semibold`
                        : "hover:border border-transparent"
                    }`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      boxShadow: option.color
                        ? `0 6px 16px ${option.color
                            .replace("rgb", "rgba")
                            .replace(")", ", 0.5)")}, 0 2px 8px ${option.color
                            .replace("rgb", "rgba")
                            .replace(")", ", 0.25)")}`
                        : undefined,
                      backgroundColor: option.color,
                    }}
                  >
                    <span className={option.textColor}>{option.icon}</span>
                    <span className="text-xs sm:text-sm">{option.label}</span>
                    {option.label === selectedFilter && (
                      <span className="ml-auto text-gray-900">
                        <CheckIcon style={{ fontSize: "22px" }} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* SORT BUTTON */}
          <div className="relative w-1/2 sm:w-auto" ref={sortDropdownRef}>
            <button
              ref={sortButtonRef}
              onClick={() => {
                setOpenSort(!openSort);
                setOpenFilter(false);
              }}
              className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-6 py-2 sm:py-4 bg-gradient-to-r ${currentSortOption?.bgColor} backdrop-blur-2xl rounded-2xl text-white text-xs sm:text-sm cursor-pointer font-medium border ${currentSortOption?.borderColor} ${currentSortOption?.hoverColor}  shadow-lg hover:shadow-xl w-full transition-colors duration-200`}
              style={{
                boxShadow:
                  currentSortOption && currentSortOption.color
                    ? `0 6px 16px ${currentSortOption.color
                        .replace("rgb", "rgba")
                        .replace(
                          ")",
                          ", 0.5)"
                        )}, 0 2px 8px ${currentSortOption.color
                        .replace("rgb", "rgba")
                        .replace(")", ", 0.25)")}`
                    : undefined,
                backgroundColor:
                  currentSortOption && currentSortOption.color
                    ? currentSortOption.color
                    : undefined,
              }}
            >
              <span className="flex items-center">
                {currentSortOption.icon}
              </span>
              <span className="min-w-0 text-xs sm:text-sm font-semibold truncate">
                {currentSortOption.label}
              </span>
              <span
                className={`transform transition-transform duration-100 ${
                  openSort ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openSort && (
              <div
                ref={sortDropdownMenuRef}
                className="absolute right-0 bottom-full mb-2 p-2 sm:p-4 w-48 sm:w-64 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl z-50 border border-gray-600/50 max-h-72 overflow-y-auto scrollbar-hide flex flex-col gap-y-1 sm:gap-y-2"
              >
                {sortOptions.map((option, index) => (
                  <div
                    key={option.label}
                    onClick={() => {
                      handleSortChange(option);
                      setOpenSort(false);
                    }}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer text-white rounded-2xl transition-all duration-200 hover:bg-gradient-to-r ${
                      option.bgColor
                    } hover:border ${option.borderColor} ${
                      option.label === selectedSort
                        ? `${option.selectedBg} border ${option.selectedBorder} font-semibold`
                        : "hover:border border-transparent"
                    }`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      boxShadow: option.color
                        ? `0 6px 16px ${option.color
                            .replace("rgb", "rgba")
                            .replace(")", ", 0.5)")}, 0 2px 8px ${option.color
                            .replace("rgb", "rgba")
                            .replace(")", ", 0.25)")}`
                        : undefined,
                      backgroundColor: option.color,
                    }}
                  >
                    <span className={option.textColor}>{option.icon}</span>
                    <span className="text-xs sm:text-sm">{option.label}</span>
                    {option.label === selectedSort && (
                      <span className="ml-auto text-gray-900">
                        <CheckIcon style={{ fontSize: "22px" }} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
