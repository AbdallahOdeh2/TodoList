import React from "react";

export default function EmptyState({ todos, filteredTodos }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 rounded-2xl bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 shadow-2xl border border-slate-600/40 backdrop-blur-xl">
      <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
        <span className="text-2xl sm:text-4xl">📭</span>
      </div>
      <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
        No tasks found
      </h3>
      <p className="text-sm sm:text-lg text-blue-200 font-semibold mb-1 sm:mb-2">
        {todos.length === 0
          ? "Create your first task to get started!"
          : "Try adjusting your search or filter criteria."}
      </p>
    </div>
  );
}
