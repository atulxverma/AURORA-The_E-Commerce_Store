"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full bg-white z-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]"></div>
      <div className="absolute h-full w-full bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {/* Beams */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-[100px] animate-beam-1 mix-blend-multiply"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vh] bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-[100px] animate-beam-2 mix-blend-multiply"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vh] bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-[100px] animate-beam-3 mix-blend-multiply"></div>
      
      <style jsx>{`
        @keyframes beam-1 { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(100px, 100px) rotate(180deg); } 100% { transform: translate(0, 0) rotate(360deg); } }
        @keyframes beam-2 { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-100px, 50px) rotate(-180deg); } 100% { transform: translate(0, 0) rotate(-360deg); } }
        @keyframes beam-3 { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(50px, -100px) rotate(90deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        .animate-beam-1 { animation: beam-1 20s infinite alternate ease-in-out; }
        .animate-beam-2 { animation: beam-2 25s infinite alternate ease-in-out; }
        .animate-beam-3 { animation: beam-3 30s infinite alternate ease-in-out; }
        .bg-grid-pattern { background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px); background-size: 40px 40px; }
      `}</style>
    </div>
  );
};