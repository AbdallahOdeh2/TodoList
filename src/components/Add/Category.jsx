import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import WarningIcon from "@mui/icons-material/Warning";
import addColors from "../../constants/addColor";
import CloseIcon from "@mui/icons-material/Close";

export default function Category({
  categories,
  formData,
  handleCategoryToggle,
  getContrastColor,
  styleConfig = addColors,
}) {
  const navigate = useNavigate();
  const categoryGridRef = useRef(null);
  const addButtonRef = useRef(null);
  const warningRef = useRef(null);

  // Safe access to style config with fallbacks
  const getStyleValue = (path, fallback = "") => {
    try {
      const keys = path.split(".");
      let value = styleConfig;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || fallback;
    } catch {
      return fallback;
    }
  };

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });
    // Animate add button
    tl.fromTo(
      addButtonRef.current,
      { opacity: 0, scale: 0.8, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          // Clear GSAP transforms to allow CSS hover effects
          gsap.set(addButtonRef.current, { clearProps: "transform" });
        },
      }
    );
    // Animate category cards with stagger
    if (categoryGridRef.current) {
      const categoryCards = categoryGridRef.current.children;
      gsap.fromTo(
        categoryCards,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.1,
          delay: 0.5,
          onComplete: () => {
            // Clear GSAP transforms to allow CSS hover effects
            gsap.set(categoryCards, { clearProps: "transform" });
          },
        }
      );
    }
  }, [categories]);

  // Animate category selection
  const handleCategoryClick = (categoryValue) => {
    const categoryElement = document.querySelector(
      `[data-category="${categoryValue}"]`
    );
    if (categoryElement) {
      // Quick bounce animation that doesn't interfere with final state
      gsap.to(categoryElement, {
        scale: 1.08,
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(categoryElement, {
            scale: 1,
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
              // Clear GSAP transforms to allow CSS to take over
              gsap.set(categoryElement, { clearProps: "transform" });
            },
          });
        },
      });
    }
    handleCategoryToggle(categoryValue);
  };

  // Animate add button click
  const handleAddClick = () => {
    gsap.to(addButtonRef.current, {
      scale: 1.1,
      rotation: 180,
      duration: 0.3,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(addButtonRef.current, {
          scale: 1,
          rotation: 0,
          duration: 0.2,
          ease: "power2.out",
        });
        navigate("/categories");
      },
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <label
          className={getStyleValue(
            "category.label",
            "text-black font-bold text-base sm:text-lg"
          )}
        >
          Categories (Max 3) *
        </label>
        <Tooltip title="Add new category" placement="top">
          <div
            ref={addButtonRef}
            className={`w-10 h-10 sm:w-12 sm:h-12  ${getStyleValue(
              "category.addCategory.bg",
              "bg-gray-100"
            )} rounded-2xl flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer`}
            style={{
              boxShadow: `0 5px 20px ${getStyleValue(
                "category.addCategory.shadow",
                "rgba(0, 0, 0, 0.7)"
              )}, 0 2px 5px ${getStyleValue(
                "category.addCategory.shadow",
                "rgba(0, 0, 0, 0.1)"
              )}`,
            }}
          >
            <IconButton type="button" onClick={handleAddClick}>
              <AddIcon
                style={{
                  fontSize: "22px",
                }}
                className={getStyleValue(
                  "category.addCategory.icon",
                  "text-gray-600"
                )}
              />
            </IconButton>
          </div>
        </Tooltip>
      </div>
      {/* CATEGORIES SELECTION */}
      <div
        ref={categoryGridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-2 min-w-0"
      >
        {categories.map((category) => {
          const isSelected = formData.categories.includes(category.value);
          const textColor = getContrastColor(category.color);
          const boxShadow = `0 5px 20px ${category.color
            .replace("rgb", "rgba")
            .replace(")", ", 0.5)")}, 0 2px 8px ${category.color
            .replace("rgb", "rgba")
            .replace(")", ", 0.25)")}`;
          const isDisabled = !isSelected && formData.categories.length >= 3;
          return (
            <div
              key={category.id}
              data-category={category.value}
              className={`relative group rounded-2xl p-3 sm:p-4 transition-transform duration-300
  ${
    isSelected
      ? "ring-4 ring-yellow-400 ring-offset-4 ring-offset-slate-800"
      : ""
  }
  ${
    isDisabled
      ? "opacity-50 cursor-not-allowed"
      : isSelected
      ? "hover:scale-105 cursor-pointer"
      : "hover:scale-105 cursor-pointer"
  }
`}
              style={{
                background: category.color,
                color: textColor,
                boxShadow,
                border: isSelected
                  ? `2.5px solid ${category.color}`
                  : undefined,
              }}
              onClick={() => {
                if (!isDisabled) handleCategoryClick(category.value);
              }}
              title={isDisabled ? "Maximum 3 categories allowed" : undefined}
            >
              {/* Modern background pattern for visual interest */}
              <div className="absolute inset-0 opacity-15 pointer-events-none"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span
                    className="text-base sm:text-xl"
                    style={{ color: textColor }}
                  >
                    {category.label}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-semibold"
                    style={{ color: textColor }}
                  >
                    {category.value}
                  </span>
                </div>
                {isSelected && (
                  <span
                    className="text-base sm:text-lg"
                    style={{
                      color: textColor,
                      textShadow: `0 0 6px ${textColor}`,
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
              {/* EDIT BUTTON */}
              <Tooltip title="Edit category" placement="top">
                <IconButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-category/${category.id}`);
                  }}
                  className="absolute top-2 right-2"
                >
                  <EditIcon
                    style={{ fontSize: "17px" }}
                    className="text-neutral-700"
                  />
                </IconButton>
              </Tooltip>
            </div>
          );
        })}
      </div>
      {/* SELECTED CATEGORIES DISPLAY */}
      <div className="mt-6">
        {formData.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.categories.map((categoryValue) => {
              const category = categories.find(
                (cat) => cat.value === categoryValue
              );
              return (
                <div
                  key={categoryValue}
                  className="flex items-center gap-1 sm:gap-2 text-white px-2 sm:px-3 py-1 rounded-full shadow-md relative text-xs sm:text-sm"
                  style={{
                    backgroundColor: category?.color || "#666",
                    boxShadow: `0 5px 20px ${
                      category?.color
                        ? category.color
                            .replace("rgb", "rgba")
                            .replace(")", ", 0.5)")
                        : "rgba(0, 0, 0, 0.3)"
                    }`,
                    color: getContrastColor(category?.color || "#666"),
                  }}
                >
                  <span className="text-base sm:text-xl">
                    {category?.label || "🏷️"}
                  </span>
                  <span className="font-semibold">
                    {category?.value || categoryValue}
                  </span>
                  <button
                    onClick={() => handleCategoryToggle(categoryValue)}
                    className="ml-2 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-500 cursor-pointer text-white text-xs leading-none"
                  >
                    <CloseIcon style={{ fontSize: "14px" }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* WARNING FOR CATEGORY LIMIT */}
      {formData.categories.length >= 3 && (
        <div
          ref={warningRef}
          className={`mt-4 flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white/80 p-3 rounded-full ${getStyleValue(
            "category.warning.colorText",
            "text-red-500"
          )}`}
        >
          <WarningIcon fontSize="small" />
          <span>Maximum 3 categories reached</span>
        </div>
      )}
    </div>
  );
}
