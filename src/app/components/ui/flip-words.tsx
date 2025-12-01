"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = words.indexOf(currentWord) + 1;
      setCurrentWord(words[next % words.length]);
    }, 2500); // Change every 2.5 seconds
    return () => clearInterval(interval);
  }, [currentWord, words]);

  return (
    <div className="relative inline-block h-[1.2em] overflow-hidden align-top">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={cn(
            "block whitespace-nowrap", 
            className
          )}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};