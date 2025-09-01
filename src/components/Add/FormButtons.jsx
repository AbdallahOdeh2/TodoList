import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FormButtons({ navigate }) {
  const buttonsContainerRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const createButtonRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.2 });
    tl.fromTo(
      buttonsContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
    )
      .fromTo(
        cancelButtonRef.current,
        { opacity: 0, scale: 0.8, x: -30 },
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.3"
      )
      .fromTo(
        createButtonRef.current,
        { opacity: 0, scale: 0.8, x: 30 },
        { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.2"
      );
  }, []);

  // Animate cancel button click
  const handleCancelClick = () => {
    gsap.to(cancelButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(cancelButtonRef.current, {
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => navigate("/"),
        });
      },
    });
  };

  // Animate create button click
  const handleCreateClick = () => {
    gsap.to(createButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(createButtonRef.current, {
          scale: 1,
          duration: 0.1,
          ease: "power2.out",
        });
      },
    });
  };

  // Optimized video component to replace heavy GIFs
  const OptimizedVideo = ({ src, className }) => (
    <video
      src={src}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      draggable={false}
    />
  );

  return (
    <div
      ref={buttonsContainerRef}
      className="flex flex-row items-center justify-between gap-3 sm:gap-4 mt-8 min-w-0"
    >
      <button
        ref={cancelButtonRef}
        type="button"
        onClick={handleCancelClick}
        onMouseEnter={() =>
          gsap.to(cancelButtonRef.current, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
          })
        }
        onMouseLeave={() =>
          gsap.to(cancelButtonRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          })
        }
        className="w-full sm:w-auto px-4 sm:px-5 py-3 bg-red-500 hover:bg-red-700 rounded-3xl text-slate-900 font-bold transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 focus:outline-none cursor-pointer text-base sm:text-lg"
        style={{
          boxShadow:
            "0 5px 20px rgba(239,68,68,0.5), 0 4px 17px  rgba(239,68,75,0.9)",
        }}
      >
        <span className="text-2xl flex items-center justify-center w-6 h-6 rounded-full bg-white/40 shadow-lg">
          <OptimizedVideo
            src="/assets/cancel.mp4"
            className="w-6 rounded-full"
            alt="Cancel"
          />
        </span>
        <span className="text-md">Cancel</span>
      </button>
      <button
        ref={createButtonRef}
        type="submit"
        onClick={handleCreateClick}
        onMouseEnter={() =>
          gsap.to(createButtonRef.current, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
          })
        }
        onMouseLeave={() =>
          gsap.to(createButtonRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          })
        }
        className="w-full sm:w-auto px-4 sm:px-5 py-3 bg-green-600 hover:bg-green-700 rounded-2xl text-slate-900 font-bold transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer text-base sm:text-lg"
        style={{
          boxShadow:
            "0 5px 20px  rgba(74,222,128,0.5), 0 4px 17px  rgba(34,197,94,0.9)",
        }}
      >
        <span className="text-2xl flex items-center justify-center w-6 h-6 rounded-full bg-white/40 shadow-lg">
          <OptimizedVideo
            src="/assets/create.mp4"
            className="w-6 rounded-full"
            alt="Create"
          />
        </span>
        <span className="text-md">Create</span>
      </button>
    </div>
  );
}
