/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useId } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  dockBg,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      <FloatingDockDesktop
        items={items}
        className={desktopClassName}
        dockBg={dockBg}
      />
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        dockBg={dockBg}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  dockBg,
  isOpen,
  setIsOpen,
}) => {
  const buttonRef = useRef(null);
  const id = useId();
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  return (
    <>
      {isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div
              className="fixed flex flex-col gap-2 py-4 px-5 rounded-3xl bg-gray-800/90 backdrop-blur-lg md:hidden items-center scrollbar-hide z-50"
              style={{
                bottom: buttonRef.current
                  ? `${
                      window.innerHeight -
                      buttonRef.current.getBoundingClientRect().top -
                      15
                    }px`
                  : "10%",
                right: buttonRef.current
                  ? `${
                      window.innerWidth -
                      buttonRef.current.getBoundingClientRect().right
                    }px`
                  : "5%",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {items.map((item) => (
                <div key={item.title} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={twMerge(
                      "flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-opacity-75",
                      item.color
                    )}
                    style={{
                      boxShadow: item.buttonShadow,
                    }}
                    tabIndex={0}
                    onFocus={(e) => e.currentTarget.classList.add("scale-110")}
                    onBlur={(e) =>
                      e.currentTarget.classList.remove("scale-110")
                    }
                    onMouseEnter={(e) =>
                      e.currentTarget.classList.add("scale-110")
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.classList.remove("scale-110")
                    }
                  >
                    <div className="h-6 w-6">{item.icon}</div>
                  </button>

                  <span className="mt-1 text-xs text-white/80 select-none font-semibold">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </>,
          document.body
        )}
      <div
        ref={buttonRef}
        className={twMerge(
          "relative block md:hidden rounded-full",
          className,
          dockBg
        )}
        style={{
          boxShadow:
            "0 6px 16px rgba(251,191,36,0.5), 0 2px 8px rgba(251,191,36,0.75)",
        }}
      >
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 cursor-pointer"
        >
          <IconLayoutNavbarCollapse className="h-5 w-5 text-white" />
        </button>
      </div>
    </>
  );
};

const FloatingDockDesktop = ({ items, className, dockBg }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={twMerge(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl px-4 pb-3 md:flex",
        dockBg || "bg-gray-50 dark:bg-neutral-900",
        className
      )}
      style={{
        boxShadow:
          "0 6px 16px rgba(251,191,36,0.5), 0 2px 8px rgba(251,191,36,0.75)",
      }}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onClick,
  color,
  buttonShadow,
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const id = useId();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={title}
      aria-labelledby={id}
      style={{ all: "unset", cursor: "pointer" }}
      tabIndex={0}
    >
      <motion.div
        id={id}
        ref={ref}
        style={{ width, height: width, boxShadow: buttonShadow }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileFocus={{
          scale: 1.1,
          boxShadow: "0 0 8px 3px rgba(251,191,36,0.8)",
        }}
        className={twMerge(
          "relative flex aspect-square items-center justify-center rounded-full",
          color,
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-opacity-75"
        )}
      >
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
          >
            {title}
          </motion.div>
        )}
        <div className="flex items-center justify-center h-1/2 w-1/2">
          {icon}
        </div>
      </motion.div>
    </button>
  );
}
