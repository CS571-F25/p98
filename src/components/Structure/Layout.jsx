import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import tower from "../assets/tower.png";
import { Menu, X } from 'lucide-react';

// Layout 只负责全局导航、页脚和基础背景色，不再包含 Canvas 动画
const Layout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#0c0c0e] text-[#e2dcc8] relative overflow-x-hidden font-sans">
      {/* 全局样式注入 */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Cinzel:wght@400;700&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-garamond { font-family: 'Cormorant Garamond', serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0c0c0e; }
        ::-webkit-scrollbar-thumb { background: #3a352a; border-radius: 4px; }
        .animate-fade-in-down { animation: fadeInDown 1s ease-out forwards; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* 1. 基础静态背景层 (所有页面共享) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 仅保留纹理和渐变，移除 Canvas */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0c0e_90%)]"></div>
      </div>

      {/* 2. 导航栏 (共享) */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-[#1a1814]/80 backdrop-blur-md border-b border-[#e2dcc8]/10 py-4 animate-fade-in-down">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-cinzel font-bold text-[#e2dcc8] tracking-wider cursor-pointer">
            THE BABEL
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 font-garamond text-lg font-light text-[#9d8f73]">
            <a href="/" className="hover:text-[#e2dcc8] transition-colors">Home</a>
            <a href="/translate" className="hover:text-[#e2dcc8] transition-colors">Translate</a>
            <a href="/about" className="hover:text-[#e2dcc8] transition-colors">Features</a>
          </div>

          {/* Mobile Nav Toggle */}
          <button className="md:hidden text-[#e2dcc8]" onClick={() => setIsNavOpen(!isNavOpen)}>
            {isNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isNavOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1814]/95 backdrop-blur-lg py-4 border-b border-[#e2dcc8]/10">
            <nav className="flex flex-col items-center space-y-4 font-garamond text-lg font-light text-[#9d8f73]">
              <a href="/" className="hover:text-[#e2dcc8] w-full text-center py-2">Home</a>
              <a href="/translate" className="hover:text-[#e2dcc8] w-full text-center py-2">Translate</a>
              <a href="/about" className="hover:text-[#e2dcc8] w-full text-center py-2">Features</a>
            </nav>
          </div>
        )}
      </nav>

      {/* 3. 页面主要内容插槽 */}
      <main className="relative z-10 pt-20 min-h-screen">
        {children}
      </main>

      {/* 4. 页脚 (共享) */}
      <footer className="relative z-10 py-12 border-t border-[#e2dcc8]/10 text-center bg-[#0c0c0e]/80 backdrop-blur-sm">
         <div className="flex justify-center gap-8 mb-8 opacity-50">
           <div className="w-1.5 h-1.5 rounded-full bg-[#cba164]"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#cba164]"></div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#cba164]"></div>
         </div>
         <p className="font-cinzel text-[#e2dcc8]/40 text-sm tracking-widest">
           PROJECT BABEL © {new Date().getFullYear()}
         </p>
      </footer>
    </div>
  );
};

export default Layout;
