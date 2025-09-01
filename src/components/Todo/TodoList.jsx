import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useTodos } from "../../contexts/TodoContext";
import { useCategories } from "../../contexts/CategoryContext";
import { Alert, CircularProgress } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import ConfirmationDialog from "./components/ConformationDialog";
import SelectionActionBar from "./components/SelectionActionBar";
import TodoListHeader from "./components/TodoListHeader";

// Helper function to convert color to proper format
const getColorForTask = (color) => {
  if (!color || typeof color !== "string") return "rgb(131, 92, 240)";
  if (color.startsWith("rgb")) return color;
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return color;
};

// Helper function to add opacity to color
const getColorWithOpacity = (color, opacity = 0.8) => {
  if (!color) return `rgba(131, 92, 240, ${opacity})`;
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", `rgba(`).replace(")", `, ${opacity})`);
  }
  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// Helper function to get contrast color
const getContrastColor = (rgbColor) => {
  try {
    const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return "#FFFFFF";
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  } catch (error) {
    console.error("Error calculating contrast color:", error);
    return "#FFFFFF";
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "high":
      return (
        <span>
          <img src="/assets/optimized/high.webp" className="w-5" />
        </span>
      );
    case "medium":
      return (
        <span>
          <img src="/assets/optimized/medium.webp" className="w-5" />
        </span>
      );
    case "low":
      return (
        <span>
          <img src="/assets/optimized/low.webp" className="w-5" />
        </span>
      );
    default:
      return "📝";
  }
};
export default function TodoList() {
  const navigate = useNavigate();
  const {
    filteredTodos,
    todos,
    toggleTodoComplete,
    deleteTodo,
    toggleTodoPin,
    isLoading,
  } = useTodos();

  const { categories } = useCategories();
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectionMode, setSelectionMode] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState({});

  //refs for GSAP animations
  const containerRef = useRef(null);
  const todoRefs = useRef([]);

  // Error handling for GSAP animations
  const safeGsapAnimation = (animationFn) => {
    try {
      animationFn();
    } catch (error) {
      console.error("GSAP animation error:", error);
    }
  };

  // GSAP animations - made faster with error handling
  useEffect(() => {
    // Container entrance animation
    if (containerRef.current) {
      safeGsapAnimation(() => {
        gsap.fromTo(
          containerRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.2, ease: "power4.out" }
        );
      });
    }

    // Todo items staggered animation
    if (todoRefs.current.length > 0) {
      safeGsapAnimation(() => {
        gsap.fromTo(
          todoRefs.current,
          {
            y: 100,
            opacity: 0,
            scale: 0.9,
            rotationX: -10,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: "back.out(1.7)",
          }
        );
      });
    }
  }, [filteredTodos]);

  // Handler to toggle selection
  const handleTaskSelect = (taskId) => {
    if (selectionMode === "delete" || selectionMode === "completed") {
      setSelectedTasks((prev) =>
        prev.includes(taskId)
          ? prev.filter((id) => id !== taskId)
          : [...prev, taskId]
      );
    } else if (selectionMode === "pin" || selectionMode === "edit") {
      setSelectedTasks((prev) => (prev[0] === taskId ? [] : [taskId]));
    }
  };

  // Handler to clear selection
  const clearSelection = () => {
    setSelectedTasks([]);
    setSelectionMode(null);
  };

  // Helper to open confirmation dialog
  const openConfirm = (type, onConfirm) => {
    setPendingAction({ type, onConfirm });
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  // Handler to trigger actions from FloatingDockActions
  const handleDockAction = (action) => {
    if (action === "add") {
      navigate("/add-task");
    } else if (action === "completed") {
      setSelectionMode("completed");
      setSelectedTasks([]);
    } else if (action === "delete") {
      setSelectionMode("delete");
      setSelectedTasks([]);
    } else if (action === "pin") {
      setSelectionMode("pin");
      setSelectedTasks([]);
    } else if (action === "edit") {
      setSelectionMode("edit");
      setSelectedTasks([]);
    } else if (action === "category") {
      setSelectionMode("category");
      navigate("/categories");
    }
  };

  // Show confirmation dialog only when user clicks the confirm action button
  const handleConfirmAction = (type) => {
    if (type === "delete") openConfirm("delete", handleDeleteSelected);
    if (type === "pin") openConfirm("pin", handlePinSelected);
    if (type === "edit") openConfirm("edit", handleEditSelected);
    if (type === "completed") openConfirm("completed", handleMarkCompleted);
  };

  // Handler to perform delete
  const handleDeleteSelected = () => {
    selectedTasks.forEach((id) => deleteTodo(id));
    clearSelection();
  };

  // Helper to determine if all selected are pinned/completed
  const allSelectedPinned =
    selectedTasks.length > 0 &&
    selectedTasks.every((id) => {
      const todo = todos.find((t) => t.id === id);
      return todo && todo.pinned;
    });
  const allSelectedCompleted =
    selectedTasks.length > 0 &&
    selectedTasks.every((id) => {
      const todo = todos.find((t) => t.id === id);
      return todo && todo.completed;
    });

  // Handler to perform pin/unpin
  const handlePinSelected = () => {
    selectedTasks.forEach((id) => {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        // If all selected are pinned, unpin; otherwise, pin
        if (allSelectedPinned) {
          if (todo.pinned) toggleTodoPin(id);
        } else {
          if (!todo.pinned) toggleTodoPin(id);
        }
      }
    });
    clearSelection();
  };

  // Handler to mark as completed/incomplete
  const handleMarkCompleted = () => {
    selectedTasks.forEach((id) => {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        // If all selected are completed, mark as incomplete; otherwise, mark as completed
        if (allSelectedCompleted) {
          if (todo.completed) toggleTodoComplete(id);
        } else {
          if (!todo.completed) toggleTodoComplete(id);
        }
      }
    });
    clearSelection();
  };

  // Handler to perform edit
  const handleEditSelected = () => {
    if (selectedTasks[0]) navigate(`/edit-task/${selectedTasks[0]}`);
    clearSelection();
  };

  // Modern confirmation dialog styles (context-aware)
  const getDialogStyles = (type) => {
    switch (type) {
      case "delete":
        return {
          title: "Delete Tasks",
          color: "#000",
          bg: "rgba(240,19,19,0.9)",
          button: "#fafafa",
          buttonCancel: "#fafafa",
          buttonTextColor: "#000",
          textColor: "#E0FFED",
          buttonShadow: "0 2px 8px rgba(255,255,255, 0.9)",
          cancelButtonShadow: "0 2px 8px rgba(253,197,197, 0.9)",
          confirmButtonShadow: "0 2px 8px rgba(214,255,148, 0.9)",
          dialogShadow: "0 5px 20px rgba(239, 68, 68, 0.4)", // ✅ NEW
          hoverConfirm: "#D6FF94",
          hoverCancel: "#FDC5C5",
          message: "Are you sure you want to delete the selected task ?",
        };
      case "pin":
        return {
          title: "Pin Task",
          color: "#000",
          bg: "rgba(250,195,10)",
          button: "#fafafa",
          buttonCancel: "#fafafa",
          buttonTextColor: "#000",
          buttonShadow: "0 2px 8px rgba(255,255,255, 0.9)",
          cancelButtonShadow: "0 2px 8px rgba(253,197,197, 0.9)",
          confirmButtonShadow: "0 2px 8px rgba(214,255,148, 0.9)",
          dialogShadow: "0 5px 20px rgba(220, 150, 10, 0.7)", // ✅ NEW
          textColor: "#441778",
          hoverConfirm: "#D6FF94",
          hoverCancel: "#FDC5C5",
          message: "Pin the selected task(s)?",
        };
      case "edit":
        return {
          title: "Edit Task",
          color: "#fff",
          bg: "rgba(59,130,246,0.9)",
          button: "#fafafa",
          buttonCancel: "#fafafa",
          buttonTextColor: "#000",
          textColor: "#23072e",
          buttonShadow: "0 2px 8px rgba(255,255,255, 0.9)",
          cancelButtonShadow: "0 2px 8px rgba(253,197,197, 0.9)",
          confirmButtonShadow: "0 2px 8px rgba(214,255,148, 0.9)",
          dialogShadow: "0 5px 20px rgba(59,130,246, 0.9)",
          hoverConfirm: "#D6FF94",
          hoverCancel: "#FDC5C5",
          message:
            "Edit the selected task? Only one task can be edited at a time.",
        };
      case "completed":
        return {
          title: "Mark as Completed",
          color: "#fff",
          bg: "rgba(34,197,94,0.8)",
          button: "#4d4d4d",
          buttonCancel: "#4d4d4d",
          buttonTextColor: "#fff",
          textColor: "#11152A",
          buttonShadow: "0 2px 8px rgba(250,250,250, 0.6)",
          cancelButtonShadow: "0 2px 8px rgba(253,197,197, 0.9)",
          confirmButtonShadow: "0 2px 8px rgba(80,160,50, 0.9)",
          dialogShadow: "0 5px 20px rgba(34,210,99, 0.9)",
          hoverConfirm: "#254517",
          hoverCancel: "#FDC5C5",
          message: "Mark the selected task(s) as completed?",
        };
      default:
        return {
          title: "Confirm Action",
          color: "#64748b",
          bg: "rgba(100,116,139,0.1)",
          button: "#64748b",
          buttonTextColor: "#fff",
          textColor: "#1e293b",
          buttonShadow: "0 0 10px rgba(100,116,139,0.4)",
          message: "Are you sure you want to perform this action?",
        };
    }
  };

  // Handle errors gracefully
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8"
    >
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        confirmOpen={confirmOpen}
        closeConfirm={closeConfirm}
        pendingAction={pendingAction}
        getDialogStyles={getDialogStyles}
      />
      {/* Header with Action Buttons */}
      <TodoListHeader
        filteredTodos={filteredTodos}
        todos={todos}
        handleDockAction={handleDockAction}
      />
      {/* Selection Action Bar */}
      <SelectionActionBar
        selectionMode={selectionMode}
        selectedTasks={selectedTasks}
        allSelectedPinned={allSelectedPinned}
        allSelectedCompleted={allSelectedCompleted}
        handleConfirmAction={handleConfirmAction}
        clearSelection={clearSelection}
      />
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <CircularProgress size={40} />
        </div>
      )}
      {/* Todo List */}
      <div
        className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 border-2 border-slate-700/60 backdrop-blur-xl p-2 sm:p-6 mb-6 flex flex-col items-stretch transition-transform duration-100 shadow-2xl overflow-y-auto custom-scrollbar-hide"
        style={{
          boxShadow:
            "0 16px 48px 0 rgba(31, 38, 135, 0.55), 0 4px 24px 0 #334155",
          border: "2px solid #334155",
          background:
            "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(30,41,59,0.85) 100%)",
          borderRadius: "1.5rem",
          maxHeight: "70vh",
          minHeight: "200px",
          height: "auto",
        }}
      >
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] py-8">
              <div className="text-lg font-semibold text-yellow-300 mb-2">
                No tasks found
              </div>
              <div className="text-sm text-gray-300">
                {(() => {
                  const filter =
                    localStorage.getItem("selectedFilter") || "All";
                  const sort =
                    localStorage.getItem("selectedSort") || "Alphabetical";
                  if (filter === "All" && sort === "Alphabetical")
                    return "Try adding a new task or changing your filter.";
                  if (filter !== "All" && sort === "Alphabetical")
                    return `No tasks found for filter: ${filter}.`;
                  if (filter === "All" && sort !== "Alphabetical")
                    return `No tasks found for sort: ${sort}.`;
                  return `No tasks found for filter: ${filter} and sort: ${sort}.`;
                })()}
              </div>
            </div>
          ) : (
            <>
              {filteredTodos.map((todo, index) => {
                const taskColor = getColorForTask(todo.color);
                const isSelected = selectedTasks.includes(todo.id);
                const isDescLong =
                  todo.description && todo.description.length > 120;
                const isExpanded = expandedDesc[todo.id];
                return (
                  <div
                    key={todo.id}
                    ref={(el) => (todoRefs.current[index] = el)}
                    className={`group relative backdrop-blur-xl border border-white/20 rounded-2xl p-2 sm:p-6 transition-transform duration-100 cursor-pointer hover:shadow-2xl hover:scale-[1.02] w-full min-w-0 ${
                      todo.pinned
                        ? "ring-2 ring-yellow-400 ring-opacity-50"
                        : ""
                    } ${
                      isSelected
                        ? selectionMode === "completed"
                          ? "ring-4 ring-green-400 bg-green-100/20"
                          : "ring-4 ring-blue-400"
                        : ""
                    } ${
                      // Add a subtle border or bg for mobile
                      "border-slate-700/40 bg-slate-900/60 sm:bg-transparent"
                    }`}
                    style={{
                      backgroundColor: taskColor
                        ? getColorWithOpacity(taskColor, 0.8)
                        : "rgba(31, 41, 55, 0.5)",
                      boxShadow: taskColor
                        ? `0 5px 32px ${getColorWithOpacity(
                            taskColor,
                            0.6
                          )}, 0 12px 16px ${getColorWithOpacity(
                            taskColor,
                            0.3
                          )}`
                        : "0 8px 32px rgba(0, 0, 0, 0.1)",
                      borderColor: taskColor
                        ? getColorWithOpacity(taskColor, 0.7)
                        : "rgba(255, 255, 255, 0.1)",
                    }}
                    onClick={() => selectionMode && handleTaskSelect(todo.id)}
                  >
                    {/* Selection Checkbox */}
                    {selectionMode && (
                      <label className="absolute top-2 left-2 z-20 w-5 h-5 flex items-center justify-center cursor-pointer sm:top-2 sm:left-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTaskSelect(todo.id)}
                          className="peer appearance-none w-5 h-5 rounded-full border-2 border-black focus:ring-2 focus:ring-black checked:bg-black checked:border-black transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="pointer-events-none absolute w-5 h-5 rounded-full border-2 border-black peer-checked:bg-black peer-checked:border-black transition-colors cursor-pointer" />
                        {/* Optional: checkmark icon */}
                        {isSelected && (
                          <svg
                            className="absolute w-3 h-3 text-white pointer-events-none"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M6 10l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </label>
                    )}
                    {/* Hover Card Effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 rounded-2xl"
                      style={{
                        background: taskColor
                          ? `linear-gradient(135deg, ${getColorWithOpacity(
                              taskColor,
                              0.25
                            )}, ${getColorWithOpacity(taskColor, 0.15)})`
                          : "linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))",
                      }}
                    />
                    <div className="relative z-10 flex flex-col gap-y-1 sm:gap-y-0">
                      {/* Responsive layout: stacked on mobile/medium, single row on large */}
                      <div className="flex flex-row items-center gap-x-3 gap-y-1 justify-between">
                        {/* Emoji + Title */}
                        <div className="flex flex-row items-center gap-1 sm:gap-2 min-w-0">
                          <span className="text-lg sm:text-3xl flex-shrink-0">
                            {todo.emoji || "📝"}
                          </span>
                          <h3
                            className={`text-md sm:text-xl font-bold truncate ${
                              todo.completed ? "line-through" : ""
                            }`}
                            style={{
                              color: taskColor
                                ? todo.completed
                                  ? getColorWithOpacity(
                                      getContrastColor(taskColor),
                                      0.6
                                    )
                                  : getContrastColor(taskColor)
                                : todo.completed
                                ? "#9CA3AF"
                                : "#FFFFFF",
                            }}
                          >
                            {todo.title || "Untitled Task"}
                          </h3>
                        </div>
                        {/* Badges Row: Priority, Pinned, Categories */}
                        <div className="flex flex-wrap md:flex-nowrap items-center gap-x-2 gap-y-1 md:mt-0 justify-end flex-shrink-0">
                          {/* Pin Badge */}
                          {todo.pinned && (
                            <span
                              className="flex items-center gap-1 px-2 py-2 rounded-full font-bold text-xs sm:text-sm border"
                              style={{
                                backgroundColor: "#fef3c9",
                                color: "#b45309",
                                borderColor: "#fbbf24",
                                boxShadow:
                                  "0 0 4px 3px #fbbf24, 0 2px 4px 0 rgba(251,191,36,0.5)",
                              }}
                            >
                              <PushPinIcon
                                style={{ fontSize: 15, color: "#fbbf35" }}
                              />
                            </span>
                          )}
                          {/* Priority Badge */}
                          <div
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm font-bold border"
                            style={{
                              backgroundColor:
                                todo.priority === "high"
                                  ? "#f87171"
                                  : todo.priority === "medium"
                                  ? "#fde047"
                                  : todo.priority === "low"
                                  ? "#4ade80"
                                  : "#9ca3af",
                              color:
                                todo.priority === "high"
                                  ? "#fff"
                                  : todo.priority === "medium"
                                  ? "#b45309"
                                  : todo.priority === "low"
                                  ? "#065f46"
                                  : "#fff",
                              borderColor:
                                todo.priority === "high"
                                  ? "#ef4444"
                                  : todo.priority === "medium"
                                  ? "#eab308"
                                  : todo.priority === "low"
                                  ? "#22c55e"
                                  : "#9ca3af",
                              boxShadow:
                                todo.priority === "high"
                                  ? "0 0 5px 2px #f87171, 0 2px 8px 0 rgba(0,0,0,0.10)"
                                  : todo.priority === "medium"
                                  ? "0 0 5px 2px #fde047, 0 2px 8px 0 rgba(0,0,0,0.10)"
                                  : todo.priority === "low"
                                  ? "0 0 5px 2px #4ade80, 0 2px 8px 0 rgba(0,0,0,0.10)"
                                  : "0 0 5px 2px #9ca3af, 0 2px 8px 0 rgba(0,0,0,0.10)",
                            }}
                          >
                            <span>{getPriorityIcon(todo.priority)}</span>
                          </div>
                          {/* Categories - Show all selected categories */}
                          {todo.categories &&
                            Array.isArray(todo.categories) &&
                            todo.categories.length > 0 &&
                            todo.categories.map((category, catIndex) => {
                              const categoryData = categories.find(
                                (cat) => cat.value === category
                              );
                              return (
                                <span
                                  key={catIndex}
                                  className="px-2 py-1 text-xs sm:text-sm rounded-full font-bold flex items-center gap-1 border-2"
                                  style={{
                                    backgroundColor: categoryData
                                      ? categoryData?.color
                                      : "#6b7280",
                                    color: categoryData
                                      ? getContrastColor(categoryData?.color)
                                      : "#fff",
                                    borderColor:
                                      categoryData?.color || "#6b7285",

                                    boxShadow: `0 0 5px 2px ${
                                      categoryData?.color || "#6b7280"
                                    },0 2px 8px 0 rgba(0,0,0,0.10)`,
                                  }}
                                >
                                  {categoryData?.label || category}
                                </span>
                              );
                            })}
                        </div>
                      </div>
                      {/* Description and Dates Row */}
                      <div className="mt-1 sm:mt-3 flex flex-col gap-5">
                        {todo.description && (
                          <p
                            className="text-xs sm:text-sm font-medium mb-1 mt-0"
                            style={{
                              color: taskColor
                                ? todo.completed
                                  ? getColorWithOpacity(
                                      getContrastColor(taskColor),
                                      0.7
                                    )
                                  : getContrastColor(taskColor)
                                : todo.completed
                                ? "#9CA3AF"
                                : "#D1D5DB",
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                              maxHeight: isExpanded ? "none" : "2.4em", // about 1.5 lines
                              overflow: isExpanded ? "visible" : "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: isExpanded ? "unset" : 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {isDescLong && !isExpanded ? (
                              <>
                                {todo.description.slice(0, 80)}
                                ...{" "}
                                <button
                                  className="text-xs text-blue-500 underline font-mono"
                                  style={{ display: "inline" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedDesc((prev) => ({
                                      ...prev,
                                      [todo.id]: true,
                                    }));
                                  }}
                                >
                                  Show more
                                </button>
                              </>
                            ) : (
                              <>
                                {todo.description}
                                {isDescLong && isExpanded && (
                                  <>
                                    {" "}
                                    <button
                                      className="text-xs text-blue-500 underline font-mono"
                                      style={{ display: "inline" }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedDesc((prev) => ({
                                          ...prev,
                                          [todo.id]: false,
                                        }));
                                      }}
                                    >
                                      Show less
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </p>
                        )}
                        {(todo.startDate || todo.endDate) && (
                          <div
                            className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium mt-0"
                            style={{
                              color: taskColor
                                ? todo.completed
                                  ? getColorWithOpacity(
                                      getContrastColor(taskColor),
                                      0.8
                                    )
                                  : getContrastColor(taskColor)
                                : todo.completed
                                ? "#9CA3AF"
                                : "#9CA3AF",
                            }}
                          >
                            {todo.startDate && (
                              <span>
                                📅 Start:{" "}
                                {new Date(todo.startDate).toLocaleDateString()}
                              </span>
                            )}
                            {todo.endDate && (
                              <span>
                                ⏰ End:{" "}
                                {new Date(todo.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
