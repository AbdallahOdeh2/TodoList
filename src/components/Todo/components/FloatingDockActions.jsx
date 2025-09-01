import React, { useState, useMemo } from "react";
import { FloatingDock } from "./floating-dock";

export default function FloatingDockActions({
  onEdit,
  onDelete,
  onPin,
  onAdd,
  onMarkCompleted,
  onEditCategory,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action) => {
    action?.();
    setIsOpen(false);
  };

  const OptimizedVideo = ({ src, className }) => (
    <div
      className={`transition-transform duration-75 ease-in-out hover:scale-120 rounded-full ${className}`}
      style={{ position: "relative" }}
    >
      <video
        src={src}
        className={className}
        autoPlay
        preload="auto"
        loop
        muted
        playsInline
        style={{ width: "100%", height: "100%" }}
        draggable={false}
      />
    </div>
  );

  const links = useMemo(
    () => [
      {
        title: "Edit",
        icon: (
          <OptimizedVideo
            src="/assets/edit2.mp4"
            className="w-full h-full object-cover rounded-full"
            alt="Edit"
          />
        ),
        onClick: () => handleAction(onEdit),
        color: "bg-blue-500 shadow-lg shadow-blue-400/40",
        buttonShadow: "0 2px 14px rgba(59, 130, 246, 0.8)",
      },
      {
        title: "Delete",
        icon: (
          <OptimizedVideo
            src="/assets/trash.mp4"
            className="w-full h-full object-cover rounded-full"
            alt="Delete"
          />
        ),
        onClick: () => handleAction(onDelete),
        color: "bg-red-500 shadow-lg shadow-red-400/40",
        buttonShadow: "0 2px 14px rgba(239, 68, 68, 0.8)",
      },
      {
        title: "Pin",
        icon: (
          <OptimizedVideo
            src="/assets/pin.mp4"
            className="w-full h-full object-cover rounded-full"
            alt="Pin"
          />
        ),
        onClick: () => handleAction(onPin),
        color: "bg-orange-500 shadow-lg shadow-orange-400/40",
        buttonShadow: "0 2px 14px rgba(249, 115, 22, 0.8)",
      },
      {
        title: "Add Task",
        icon: (
          <OptimizedVideo
            src="/assets/add.mp4"
            className="w-full h-full object-cover rounded-full"
            alt="Add"
          />
        ),
        onClick: () => handleAction(onAdd),
        color: "bg-purple-500 shadow-lg",
        buttonShadow: "0 2px 14px rgba(168, 85, 247, 0.8)",
      },
      {
        title: "Mark as Completed",
        icon: (
          <OptimizedVideo
            src="/assets/completed.mp4"
            className="w-full h-full object-cover rounded-full"
            alt="Completed"
          />
        ),
        onClick: () => handleAction(onMarkCompleted),
        color: "bg-emerald-500 shadow-lg shadow-emerald-400/40",
        buttonShadow: "0 2px 14px rgba(16, 185, 129, 0.8)",
      },
      {
        title: "Edit Category",
        icon: (
          <OptimizedVideo
            src="/assets/category.mp4"
            className="w-full h-full object-cover rounded-full"
            alt="Category Edit"
          />
        ),
        onClick: () => handleAction(onEditCategory),
        color: "bg-violet-800 shadow-lg shadow-violet-400/40",
        buttonShadow: "0 2px 14px rgba(91,33,182, 0.8)",
      },
    ],
    [onEdit, onDelete, onPin, onAdd, onMarkCompleted, onEditCategory]
  ); // dependencies

  return (
    <div className="flex items-center justify-center w-full">
      <FloatingDock
        items={links.map((item) => ({
          ...item,
          onClick: (e) => {
            e.preventDefault();
            item.onClick?.();
          },
          titleVisibleOnMobile: true,
        }))}
        dockBg="bg-yellow-500 shadow-xl"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}
