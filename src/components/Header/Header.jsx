/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
export default function Header() {
  const [name, setName] = useState("");
  const [inputName, setInputName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [index, setIndex] = useState(0);
  const [showNameModal, setShowNameModal] = useState(false);

  const sentences = [
    "Stay organized one task at a time",
    "Write it down, get it done",
    "Your productivity journey starts here!",
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // load the name from localStorage

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  // Update greeting every 5 minutes
  useEffect(() => {
    setGreeting(getGreeting);
    const interval = setInterval(() => {
      setGreeting(getGreeting);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  // Display sentence every 5 seconds
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 5000);
    return () => clearTimeout(timeOut);
  }, [index]);

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;
    localStorage.setItem("username", trimmed);
    setName(trimmed);
    setInputName("");
    setShowNameModal(false);
  };

  // pre-Fill with current name if editing
  const handleEnterNameCLick = () => {
    setInputName(name);
    setShowNameModal(true);
  };
  return (
    <div className="w-full">
      {/* GREETING HEADER */}
      <div
        className="sticky top-0 z-50 backdrop-blur-lg border-b-2 border-slate-400/15 shadow-lg bg-gradient-to-b from-slate-800/80
      to-slate-900/90"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-wrap items-center justify-between min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-wrap">
              {/* ICON */}
              <div
                className="w-9 h-9 sm:w-13 sm:h-13 rounded-3xl p-1 sm:p-2 flex items-center justify-center shadow-md bg-gradient-to-br from-orange-400 to-orange-600"
                style={{
                  boxShadow: "0 3px 13px rgba(251,146,60,0.8)",
                }}
              >
                <img
                  alt="icon"
                  src="/assets/optimized/icon2.webp"
                  className="w-6 sm:w-8 md:w-11"
                />
              </div>
              {/* === ICON ===*/}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-0.5">
                  <p className="text-lg sm:text-2xl md:text-3xl text-yellow-300 capitalize font-semibold truncate min-w-[8ch]">
                    {greeting}
                  </p>
                  {name ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-2xl md:text-3xl text-yellow-300 capitalize font-semibold truncate">
                        , {name}
                      </span>
                      <button
                        onClick={handleEnterNameCLick}
                        className="bg-gradient-to-tl from-[#C9C0C0] to-[#FFFDFD] rounded-2xl px-1 py-1 hover:bg-neutral-950 cursor-pointer transition text-white font-bold
                        shadow-lg text-xs sm:text-sm"
                        style={{
                          boxShadow: "0 5px 22px rgba(0,0,0,.8)",
                        }}
                      >
                        ✏️
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnterNameCLick}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl px-2 py-0.5 sm:px-3 sm:py-1 hover:from-orange-600 hover:to-orange-700 cursor-pointer transition
                      ml-2 text-white font-bold shadow-md text-sm sm:text-base"
                    >
                      Enter Name...
                    </button>
                  )}
                </div>
                {/* SENTENCES */}
                <h3 className="text-sm sm:text-base text-orange-300 italic font-bold min-h-[1.5rem]">
                  {sentences[index]}
                </h3>
                {/*=== SENTENCES ===*/}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*=== GREETING HEADER ===*/}
      {/* NAME INPUT MODAL */}
      {showNameModal && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="max-w-lg w-[80%] p-4 md:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl shadow-xl flex flex-col items-center
            gap-3 md-gap-5 border border-slate-400/30"
            style={{
              boxShadow: "0 5px 32px rgba(34,75,150,.5)",
            }}
          >
            <h2 className="text-2xl text-yellow-300 font-semibold">
              Enter your name:
            </h2>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="border border-slate-400/50 rounded-2xl p-2 md:p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-400
              placeholder:text-md placeholder:text-slate-400 bg-white/10 text-white text-lg backdrop-blur-sm capitalize"
              placeholder="Your Name..."
              autoFocus
              style={{
                boxShadow: "0 3px 12px rgba(255,250,250,.3)",
              }}
            />
            <div className="flex gap-5 mt-2 sm:mt-3">
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="bg-gradient-to-r from-red-400 to-red-600 rounded-2xl px-5 py-3 hover:from-red-700 hover:to-red-800 cursor-pointer transition text-white font-semibold shadow-md text-lg"
                style={{
                  boxShadow: "0 5px 20px rgba(153,27,27,.8)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl px-5 py-3 hover:from-green-700 hover:to-green-800 cursor-pointer transition text-black font-semibold shadow-md text-lg"
                style={{
                  boxShadow: "0 5px 20px rgba(22,101,52,.8)",
                }}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
      {/*=== NAME INPUT MODAL ===*/}
    </div>
  );
}
