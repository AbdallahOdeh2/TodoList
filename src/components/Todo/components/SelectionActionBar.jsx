import React, { useMemo } from "react";

export default function SelectionActionBar({
  selectionMode,
  selectedTasks,
  allSelectedPinned,
  allSelectedCompleted,
  handleConfirmAction,
  clearSelection,
}) {
  const taskCount = selectedTasks.length;

  const canEdit = useMemo(() => selectionMode === "edit", [selectionMode]);
  const canDelete = useMemo(() => selectionMode === "delete", [selectionMode]);
  const canPin = useMemo(() => selectionMode === "pin", [selectionMode]);
  const canComplete = useMemo(
    () => selectionMode === "completed",
    [selectionMode]
  );

  if (!selectionMode) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {canEdit && taskCount > 1 && (
        <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold text-center border border-yellow-300 shadow">
          You can only edit one task at a time. Please deselect extra tasks.
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {canDelete && (
          <ActionButton
            label="Delete Selected"
            onClick={() => handleConfirmAction("delete")}
            disabled={taskCount === 0}
            bg="bg-red-500"
            hoverBg="hover:bg-red-700"
            textColor="text-neutral-900"
            shadowColor="rgba(239,68,68,0.9)"
          />
        )}
        {canPin && (
          <ActionButton
            label={allSelectedPinned ? "Unpin Selected" : "Pin Selected"}
            onClick={() => handleConfirmAction("pin")}
            disabled={taskCount === 0}
            bg="bg-yellow-400"
            hoverBg="hover:bg-yellow-600"
            textColor="text-black"
            shadowColor="rgba(234,179,8,0.9)"
          />
        )}
        {canEdit && (
          <ActionButton
            label="Edit Selected"
            onClick={() => handleConfirmAction("edit")}
            disabled={taskCount !== 1}
            bg="bg-blue-700"
            hoverBg="hover:bg-blue-900"
            textColor="text-white/80"
            shadowColor="rgba(59,130,246,0.8)"
          />
        )}
        {canComplete && (
          <ActionButton
            label={
              allSelectedCompleted ? "Mark as Incomplete" : "Mark as Completed"
            }
            onClick={() => handleConfirmAction("completed")}
            disabled={taskCount === 0}
            bg="bg-green-500"
            hoverBg="hover:bg-green-700"
            textColor="text-neutral-800"
            shadowColor="rgba(34,197,94,.9)"
          />
        )}
        <ActionButton
          label="Cancel"
          onClick={clearSelection}
          bg="bg-gray-300"
          hoverBg="hover:bg-gray-500"
          textColor="text-black"
          shadowColor="rgba(243,244,246,0.3)"
        />
      </div>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  bg,
  hoverBg,
  textColor,
  shadowColor,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 ${bg} ${textColor} font-semibold rounded-xl cursor-pointer transition-all duration-200 ease-in-out
        ${hoverBg} disabled:opacity-60 disabled:cursor-not-allowed`}
      style={{
        boxShadow: `0 2px 8px ${shadowColor}`,
      }}
    >
      {label}
    </button>
  );
}
