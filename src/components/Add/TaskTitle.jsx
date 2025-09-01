/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import EmojiPicker from "emoji-picker-react";
import { SketchPicker } from "react-color";
import { IconButton, Tooltip } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import addColors from "../../constants/addColor";
export default function TaskTitle({
  formData,
  handleInputChange,
  selectedEmoji,
  selectedColor,
  handleEmojiSelect,
  handleColorSelect,
  styleConfig = addColors,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const emojiRef = useRef(null);
  const inputRef = useRef(null);
  const colorRef = useRef(null);
  const colorSwatchRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.08 });
    tl.fromTo(
      emojiRef.current,
      { opacity: 0, scale: 0.7, x: -32 },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 0.22,
        ease: "elastic.out(1, 0.6)",
      }
    )
      .fromTo(
        inputRef.current,
        { opacity: 0, scale: 0.92, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: "power2.out" },
        "-=0.12"
      )
      .fromTo(
        colorRef.current,
        { opacity: 0, scale: 0.7, x: 32 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.22,
          ease: "elastic.out(1, 0.6)",
        },
        "-=0.10"
      )
      .fromTo(
        colorSwatchRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.18, ease: "bounce.out" },
        "-=0.14"
      );
  }, []);

  // Animate emoji picker opening
  const handleEmojiPickerToggle = () => {
    if (!showEmojiPicker) {
      gsap.to(emojiRef.current, {
        scale: 1.18,
        duration: 0.18,
        ease: "elastic.out(1, 0.6)",
        onComplete: () => {
          gsap.to(emojiRef.current, {
            scale: 1,
            duration: 0.12,
            ease: "power2.out",
          });
        },
      });
    }
    setShowEmojiPicker((prev) => !prev);
  };

  // Animate color picker opening
  const handleColorPickerToggle = () => {
    if (!showColorPicker) {
      gsap.to(colorRef.current, {
        scale: 1.18,
        duration: 0.18,
        ease: "elastic.out(1, 0.6)",
        onComplete: () => {
          gsap.to(colorRef.current, {
            scale: 1,
            duration: 0.12,
            ease: "power2.out",
          });
        },
      });
    }
    setShowColorPicker(!showColorPicker);
  };

  // Animate input focus
  const handleInputFocus = () => {
    gsap.to(inputRef.current, {
      scale: 1.04,
      duration: 0.18,
      ease: "power2.out",
    });
  };

  const handleInputBlur = () => {
    gsap.to(inputRef.current, {
      scale: 1,
      duration: 0.18,
      ease: "power2.out",
    });
  };

  // Animate emoji change
  useEffect(() => {
    if (!emojiRef.current) return;
    gsap.fromTo(
      emojiRef.current,
      { scale: 1.18, rotate: -18 },
      { scale: 1, rotate: 0, duration: 0.22, ease: "elastic.out(1, 0.5)" }
    );
  }, [selectedEmoji]);

  // Animate color change
  useEffect(() => {
    if (!colorSwatchRef.current) return;
    gsap.fromTo(
      colorSwatchRef.current,
      { scale: 1.18, rotate: 18 },
      { scale: 1, rotate: 0, duration: 0.22, ease: "elastic.out(1, 0.5)" }
    );
  }, [selectedColor]);

  return (
    <div className="mb-8">
      <label className={styleConfig.title.label}>Task Title *</label>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0 transition-all duration-300">
        {/* Emoji Picker Button */}
        <div
          ref={emojiRef}
          className="relative flex items-center transition-all duration-300"
        >
          <button
            type="button"
            onClick={handleEmojiPickerToggle}
            onMouseEnter={() =>
              gsap.to(emojiRef.current, {
                scale: 1.05,
                duration: 0.2,
                ease: "power2.out",
              })
            }
            onMouseLeave={() =>
              gsap.to(emojiRef.current, {
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
              })
            }
            className={`
    w-10 h-10 sm:w-12 sm:h-12 rounded-2xl
    flex items-center justify-center
    cursor-pointer
    ${styleConfig.title.emojiPicker.bg}
  `}
            style={{ boxShadow: styleConfig.title.emojiPicker.boxShadow }}
          >
            <span className={styleConfig.title.emojiPicker.icon}>
              {selectedEmoji}
            </span>
          </button>
          {showEmojiPicker && (
            <>
              {createPortal(
                <div
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md transition-all duration-300"
                  onClick={() => setShowEmojiPicker(false)}
                  aria-label="Close emoji picker"
                />,
                document.body
              )}
              {createPortal(
                <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2">
                  <ClickAwayListener
                    onClickAway={() => setShowEmojiPicker(false)}
                  >
                    <div>
                      <EmojiPicker
                        onEmojiClick={(emojiObject) => {
                          handleEmojiSelect(emojiObject);
                          setShowEmojiPicker(true);
                        }}
                      />
                    </div>
                  </ClickAwayListener>
                </div>,
                document.body
              )}
            </>
          )}
        </div>
        {/* Input, Color Swatch, Color Picker */}
        <div className="flex-1 min-w-0 relative flex items-center gap-2 sm:gap-3">
          <input
            ref={inputRef}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Enter task title..."
            className={`w-full px-3 py-3 sm:px-6 sm:py-4 backdrop-blur-2xl rounded-2xl text-base sm:text-lg font-mono focus:outline-none focus:ring-2 transition-all
              focus:border-transparent duration-200 focus-within:scale-105 focus-within:mx-1 
              ${styleConfig.title.input?.placeholder}
              ${styleConfig.title.input?.text}
             ${styleConfig.title.input?.bg}  ${styleConfig.title.input?.borderColor} ${styleConfig.title.input?.shadow}} `}
            style={{
              boxShadow: inputFocused
                ? styleConfig.title.input?.focusBoxShadow
                : styleConfig.title.input?.boxShadow,
            }}
          />
          {/* Color Swatch */}
          <span
            ref={colorSwatchRef}
            className="ml-2 sm:ml-4 h-5 w-6.5 sm:h-6 sm:w-7 transition-all duration-200 "
            style={{
              display: "inline-block",
              borderRadius: "50%",
              background: selectedColor,
              border: "2px solid #ccc",
              verticalAlign: "middle",
              boxShadow: styleConfig.title.colorSwatch.boxShadow,
            }}
            title="Current color"
          />
          <Tooltip title="Change task color" placement="top">
            <div
              ref={colorRef}
              onMouseEnter={() =>
                gsap.to(colorRef.current, {
                  scale: 1.05,
                  duration: 0.2,
                  ease: "power2.out",
                })
              }
              onMouseLeave={() =>
                gsap.to(colorRef.current, {
                  scale: 1,
                  duration: 0.2,
                  ease: "power2.out",
                })
              }
              className={`w-10 h-10 sm:w-14 sm:h-12 -mr-1 sm:-mr-3 ml-1 rounded-2xl flex items-center justify-center cursor-pointer
            ${styleConfig.title.colorPicker.bg} `}
              style={{ boxShadow: styleConfig.title.colorPicker.boxShadow }}
            >
              <IconButton
                type="button"
                onClick={handleColorPickerToggle}
                className="ml-1 text-black hover:text-gray-700 transition-colors"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ColorLensIcon
                  style={{ fontSize: "22px" }}
                  className={styleConfig.title.colorPicker.icon}
                />
              </IconButton>
            </div>
          </Tooltip>
          {showColorPicker && (
            <>
              {createPortal(
                <div
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-all duration-300"
                  onClick={() => setShowColorPicker(false)}
                  aria-label="Close color picker"
                />,
                document.body
              )}
              {createPortal(
                <div className="fixed top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2">
                  <ClickAwayListener
                    onClickAway={() => setShowColorPicker(false)}
                  >
                    <div
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                        padding: "12px",
                      }}
                    >
                      <SketchPicker
                        color={selectedColor}
                        onChangeComplete={(color) => {
                          handleColorSelect(color.hex);
                          setShowColorPicker(true);
                        }}
                        styles={{
                          default: { picker: { boxShadow: "none" } },
                        }}
                      />
                    </div>
                  </ClickAwayListener>
                </div>,
                document.body
              )}
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-yellow-200 font-medium mt-2 ml-14 sm:ml-18 text-left w-full">
        {formData.title.length}/40
      </div>
    </div>
  );
}
