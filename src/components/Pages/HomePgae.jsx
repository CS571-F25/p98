import { memo } from "react"
import React, { useEffect, useRef } from 'react';
import { Cpu, Globe, Feather, ArrowDown } from 'lucide-react';

const HomePage = () => {
  const canvasRef = useRef(null);

  // --- 动态背景逻辑移动到这里 ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 辅助函数：绘制旋转的多边形
    const drawPolygon = (cx, cy, radius, sides, angle, tilt, color) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const theta = (i / sides) * Math.PI * 2 + angle;
        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius * 0.35; 
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    // 1. 绘制双螺旋框架
    const drawTwinHelix = (cx, cy, height, maxRadius, time, color) => {
      ctx.beginPath();
      const turns = 3.5;
      const points = 200;
      const leanFactor = 0.4;
      
      [0, Math.PI].forEach(phase => {
        for (let i = 0; i <= points; i++) {
          const progress = i / points;
          const angle = progress * Math.PI * 2 * turns + time * 0.1 + phase;
          const radius = maxRadius * (1 - progress * 0.65);
          const yOffset = height * 0.5 - progress * height;
          const tiltX = (progress * height) * leanFactor; 

          const x = cx + Math.cos(angle) * radius + tiltX;
          const y = cy + yOffset + Math.sin(angle) * radius * 0.35;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    // 2. 绘制内部几何体
    const drawInternalStructures = (cx, cy, time, baseColor, highlightColor) => {
      const height = 550; 
      const leanFactor = 0.4; 
      
      const getTiltOffset = (objY) => {
        const bottomY = cy + height * 0.5; 
        const progress = (bottomY - objY) / height; 
        return (progress * height) * leanFactor;
      };

      // Cube
      const cubeY = cy + 150;
      const cubeSize = 110; 
      const cubeSpeed = time * 0.05;
      const cubeX = cx + getTiltOffset(cubeY);
      ctx.save();
      ctx.translate(cubeX, cubeY);
      ctx.rotate(cubeSpeed);
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-cubeSize/2, -cubeSize/2, cubeSize, cubeSize);
      ctx.beginPath();
      ctx.moveTo(-cubeSize/2, -cubeSize/2); ctx.lineTo(cubeSize/2, cubeSize/2);
      ctx.moveTo(cubeSize/2, -cubeSize/2); ctx.lineTo(-cubeSize/2, cubeSize/2);
      ctx.stroke();
      ctx.restore();

      // Pyramid
      const pyramidY = cy + 20;
      const pyramidRadius = 75;
      const pyramidSpeed = time * 0.2;
      const pyramidX = cx + getTiltOffset(pyramidY);
      ctx.save();
      ctx.translate(pyramidX, pyramidY);
      drawPolygon(0, 0, pyramidRadius, 3, pyramidSpeed, 0, highlightColor);
      const apexY = -pyramidRadius * 1.2;
      for(let i=0; i<3; i++) {
          const theta = (i / 3) * Math.PI * 2 + pyramidSpeed;
          const vx = Math.cos(theta) * pyramidRadius;
          const vy = Math.sin(theta) * pyramidRadius * 0.35;
          ctx.beginPath();
          ctx.moveTo(vx, vy);
          ctx.lineTo(0, apexY); 
          ctx.strokeStyle = 'rgba(180, 160, 120, 0.4)';
          ctx.stroke();
      }
      ctx.restore();

      // Cylinder
      const cylinderY = cy - 100;
      const cylinderRadius = 55;
      const cylinderH = 50;
      const cylinderSpeed = time * 0.6;
      const cylinderX = cx + getTiltOffset(cylinderY);
      ctx.save();
      ctx.translate(cylinderX, cylinderY);
      ctx.beginPath();
      ctx.ellipse(0, -cylinderH/2, cylinderRadius, cylinderRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, cylinderH/2, cylinderRadius, cylinderRadius * 0.35, 0, 0, Math.PI * 2);
      ctx.strokeStyle = highlightColor;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-cylinderRadius, -cylinderH/2); ctx.lineTo(-cylinderRadius, cylinderH/2);
      ctx.moveTo(cylinderRadius, -cylinderH/2); ctx.lineTo(cylinderRadius, cylinderH/2);
      ctx.moveTo(0, -cylinderH/2); ctx.lineTo(Math.cos(cylinderSpeed)*cylinderRadius, cylinderH/2);
      ctx.stroke();
      ctx.restore();

      // Hemisphere
      const hemiY = cy - 180;
      const hemiRadius = 30;
      const hemiX = cx + getTiltOffset(hemiY);
      ctx.save();
      ctx.translate(hemiX, hemiY);
      ctx.beginPath();
      ctx.arc(0, 0, hemiRadius, Math.PI, 0);
      ctx.lineTo(-hemiRadius, 0);
      ctx.moveTo(0, -hemiRadius); ctx.lineTo(0, -hemiRadius - 40);
      ctx.moveTo(-10, -hemiRadius - 45); ctx.arc(0, -hemiRadius - 45, 10, Math.PI, 0);
      ctx.moveTo(-20, -hemiRadius - 45); ctx.arc(0, -hemiRadius - 45, 20, Math.PI, 0);
      ctx.strokeStyle = baseColor;
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2 - 80; 
      const cy = canvas.height / 2 + 50;
      const baseColor = 'rgba(180, 160, 120, 0.15)';
      const highlightColor = 'rgba(255, 250, 220, 0.3)';
      const towerHeight = 550;
      const towerBaseRadius = 160;

      drawInternalStructures(cx, cy, time, baseColor, highlightColor);
      drawTwinHelix(cx, cy, towerHeight, towerBaseRadius, time * 0.2, baseColor);

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Canvas 仅在 HomePage 渲染 */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        
        {/* 头部 Hero 区域 */}
        <header className="text-center mb-32 pt-10 animate-fade-in-up delay-200">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-[#fff8e7] to-[#8a7e66]">
            THE BABEL
          </h1>
          <p className="font-garamond text-xl italic text-[#9d8f73] max-w-2xl mx-auto leading-relaxed">
            "Decoding the language of humanity through the lens of artificial intelligence."
          </p>
          
          <div className="mt-16 flex justify-center opacity-50 animate-bounce">
            <ArrowDown size={24} className="text-[#9d8f73]" />
          </div>
        </header>

        {/* 功能介绍板块 */}
        <div className="space-y-32">
          
          {/* Section 1 */}
          <section className="flex flex-col md:flex-row items-center gap-12 animate-fade-in-up delay-500">
            <div className="flex-1 space-y-6 text-right md:text-left">
              <div className="flex items-center gap-3 text-[#cba164] mb-2">
                <Globe className="w-6 h-6" />
                <span className="font-cinzel text-sm tracking-widest">THE VISION</span>
              </div>
              <h2 className="text-4xl font-garamond font-bold text-white">Breaking The Barrier</h2>
              <p className="font-garamond text-xl text-[#9d8f73] leading-loose">
                Just as the Tower of Babel scattered languages across the earth, we strive to reunite them. Our platform serves as the modern interpreter, dissolving boundaries between cultures through precise, context-aware translation.
              </p>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-[#cba164] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
              <div className="relative border border-[#e2dcc8]/10 bg-[#1a1814]/60 backdrop-blur-sm p-8 rounded-sm shadow-2xl transform transition hover:-translate-y-2 duration-500">
                <h3 className="font-cinzel text-2xl mb-4 text-[#e2dcc8]">Universal Access</h3>
                <p className="font-garamond text-lg text-gray-400">
                   Upload EPUBs, PDFs, or Documents. Watch as the ancient barriers crumble, replaced by seamless understanding across English, Chinese, and Spanish.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-12 animate-fade-in-up delay-700">
             <div className="flex-1 space-y-6">
              <div className="flex items-center justify-end gap-3 text-[#cba164] mb-2">
                <span className="font-cinzel text-sm tracking-widest">THE ENGINE</span>
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-garamond font-bold text-white text-right">Powered by Intellect</h2>
              <p className="font-garamond text-xl text-[#9d8f73] leading-loose text-right">
                Beneath the classical facade lies the pulse of modern Large Language Models. We don't just translate words; we interpret meaning, tone, and nuance, preserving the soul of the original text.
              </p>
            </div>
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-[#64cbbf] blur-[60px] opacity-5 group-hover:opacity-15 transition-opacity duration-1000"></div>
              <div className="relative border border-[#e2dcc8]/10 bg-[#1a1814]/60 backdrop-blur-sm p-8 rounded-sm shadow-2xl transform transition hover:-translate-y-2 duration-500">
                 <h3 className="font-cinzel text-2xl mb-4 text-[#e2dcc8] text-right">Cognitive Processing</h3>
                 <p className="font-garamond text-lg text-gray-400 text-right">
                   Utilizing GPT-4o and advanced context retention algorithms to ensure consistency across long-form narratives and technical documents.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="flex flex-col md:flex-row items-center gap-12 animate-fade-in-up delay-900">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3 text-[#cba164] mb-2">
                <Feather className="w-6 h-6" />
                <span className="font-cinzel text-sm tracking-widest">THE CRAFT</span>
              </div>
              <h2 className="text-4xl font-garamond font-bold text-white">Elegance in Form</h2>
              <p className="font-garamond text-xl text-[#9d8f73] leading-loose">
                Functionality need not sacrifice beauty. Our interface is designed to evoke the tranquility of a study, allowing you to focus on the text without distraction.
              </p>
            </div>
             <div className="flex-1 relative group">
               <div className="absolute inset-0 bg-[#cb6464] blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
               <div className="relative border border-[#e2dcc8]/10 bg-[#1a1814]/60 backdrop-blur-sm p-8 rounded-sm shadow-2xl transform transition hover:-translate-y-2 duration-500">
                 <h3 className="font-cinzel text-2xl mb-4 text-[#e2dcc8]">Seamless UX</h3>
                 <p className="font-garamond text-lg text-gray-400">
                   Drag-and-drop simplicity met with instant visual feedback. A blend of classical aesthetics and modern responsiveness.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
