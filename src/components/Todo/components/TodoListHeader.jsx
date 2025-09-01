import React from "react";
import FloatingDockActions from "./FloatingDockActions";

const taskIconShadow =
  "0 3px 22px 0 rgba(250,110,35,0.4), 0 3.5px 5px 0 rgba(250,140,35,0.7)";

export default function TodoListHeader({
  filteredTodos,
  todos,
  handleDockAction,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-2 sm:gap-4 min-w-0">
      {/* Left Side: Title & Count */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className="w-8 h-8 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center bg-amber-300 shadow-lg"
          style={{ boxShadow: taskIconShadow }}
        >
          <img
            src="/assets/optimized/todo2.webp"
            className="w-5 sm:w-7"
            alt="task icon"
          />
        </div>

        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-lime-300">Tasks</h2>
          <p className="text-xs sm:text-sm text-gray-200 font-mono">
            {filteredTodos.length} of {todos.length} tasks
          </p>
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center justify-center h-10">
        <FloatingDockActions
          onEdit={() => handleDockAction("edit")}
          onDelete={() => handleDockAction("delete")}
          onPin={() => handleDockAction("pin")}
          onAdd={() => handleDockAction("add")}
          onMarkCompleted={() => handleDockAction("completed")}
          onEditCategory={() => handleDockAction("category")}
        />
      </div>
    </div>
  );
}
