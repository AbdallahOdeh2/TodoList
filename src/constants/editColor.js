// src/constants/editColor.js
const editColors = {
  title: {
    label: "text-[#2AF81F] font-bold mb-3 block text-base sm:text-lg",
    input: {
      text: "text-[#F1FF5A]",
      bg: "bg-transparent",
      shadow: "shadow-lg",
      borderColor: "border-black",
      placeholder: "placeholder-amber-400",
      boxShadow: "0 2px 20px rgba(255,255,255, 0.4)",
    },
    emojiPicker: {
      bg: "bg-[#F0D210]",
      boxShadow: "0 2px 20px rgba(240,210,16, 0.6)",
      icon: "text-lg sm:text-xl",
    },
    colorPicker: {
      bg: "bg-[#F0D210]",
      boxShadow: "0 2px 20px rgba(240,210,16, 0.6)",
      icon: "text-black",
    },
    colorSwatch: {
      boxShadow: "0 5px 20px rgba(255, 255, 255, 0.2) ",
    },
  },
  description: {
    label: "text-[#2AF81F] font-bold mb-3 block text-base sm:text-lg",
    textarea: {
      text: "text-[#F1FF5A]",
      bg: "bg-transparent",
      placeholder: "placeholder-amber-400",
      borderColor: "border-black",
      shadow: "shadow-md",
      boxShadow: "0 5px 20px rgba(255,255,255, 0.4)",
    },
  },
  category: {
    label: "block text-[#2AF81F] font-bold text-base sm:text-lg",
    addCategory: {
      bg: "bg-[#F0D210]",
      icon: "text-black text-lg sm:text-xl",
      boxShadow: "0 2px 20px rgba(240,210,16, 0.6)",
    },
    warning: {
      colorText: "text-red-600",
    },
  },
  priority: {
    label: "block text-[#2AF81F] font-bold text-base sm:text-lg",
    card: "bg-yellow-400 text-black",
  },
  date: {
    label: "block text-[#2AF81F] font-bold mb-4 text-base sm:text-lg",
    textColor: "text-[#F1FF5A]",
    placeholder: "placeholder-[#3E2D08]",
    textFont: "font-semibold",
    bg: "bg-transparent",
    borderColor: "border-black",
    boxShadow: "0 5px 20px rgba(255,255,255, 0.4)",
    button: {
      bg: "bg-[#F0D210] ",
      color: "text-[#070404]",
      hover: "hover:bg-yellow-600",
      border: "border-2 border-orange-400",
      boxShadow: "0 2px 20px rgba(240,210,16, 0.6)",
    },
  },
  formButtons: {
    save: "bg-[#44FFA2] text-black",
    cancel: "bg-[#FFC0C8] text-black",
    boxShdowCancel: "0 5px 20px rgba(255,100,120, 0.5)",
    boxShdowSave: "0 5px 20px rgba(68,255,162,.4)",
  },
};

export default editColors;
