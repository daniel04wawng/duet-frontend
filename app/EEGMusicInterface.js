'use client'

import React, { useEffect, useRef, useState } from 'react';

const EEGMusicInterface = () => {
  const canvasRef = useRef(null);
  const [alphaBetaData, setAlphaBetaData] = useState({alpha: 1, beta: 1});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/alphabeta');
      const data = await res.json();
      setAlphaBetaData(data);
    };

    const interval = setInterval(fetchData, 125); // 8 times per second (1000ms / 8 = 125ms)
    
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    } 
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawVisualizer = () => {
      const barWidth = 1; // Increase bar width
      const notes = 50;
    
      // Set up glow effect
      ctx.shadowBlur = 20; // Increase for more glow
      ctx.shadowColor = '#5dbdf5'; // Glow color
      ctx.shadowOffsetX = 0; // No horizontal offset
      ctx.shadowOffsetY = 0; // No vertical offset
    
      ctx.fillStyle = '#5dbdf5'; // Bar color
    
      for (let i = 0; i < notes; i++) {
        const barHeight = Math.abs((i/notes) - (alphaBetaData.alpha / 100)) * canvas.height * 0.2; // Adjusted height for bigger bars
        ctx.fillRect(i * canvas.width / notes, canvas.height - barHeight, barWidth, barHeight);
      }
    
      // Reset shadow properties to avoid affecting other drawings
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let audioData = new Uint8Array(128).fill(0);
    let alphaBetaData = { alpha: 50, beta: 30 };
    let offset = 0;

    const drawWave = (y, amplitude, color, waveOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 20; // Increase for more glow
      ctx.shadowColor = '#5dbdf5'; // Glow color
      ctx.shadowOffsetX = 0; // No horizontal offset
      ctx.shadowOffsetY = 0; // No vertical offset

      for (let i = 0; i < canvas.width; i++) {
        ctx.lineTo(i, y + Math.sin((i + waveOffset) * 0.02) * amplitude);
      }
      ctx.stroke();
      // Reset shadow properties to avoid affecting other drawings
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

    };

    const animate = () => {
      // Create a fading tail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Tail color with slight transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas for the tail effect

      // Draw the alpha and beta waves
      drawWave(canvas.height / 2, alphaBetaData.alpha, '#5dbdf5', offset);
      drawWave(canvas.height / 2 + 50, alphaBetaData.beta, '#ffdc96', -offset);

      drawVisualizer();

      // Increase the speed of scrolling by increasing the offset
      offset += 0.2; // Adjust this value for faster movement

      // Simulate changing audio data
      for (let i = 0; i < audioData.length; i++) {
        audioData[i] = Math.random() * 255;
      }

      // Simulate changing wave data
      // waveData.alpha = 50 + Math.sin(offset * 0.1) * 20; // Adjust waveData as needed
      // waveData.beta = 30 + Math.cos(offset * 0.1) * 15;  // Adjust waveData as needed

      // Draw the alpha and beta values in the top left corner
      ctx.fillStyle = '#5dbdf5'; // Corresponding color for alpha
      ctx.font = '20px Arial';
      ctx.fillText(`Alpha: ${alphaBetaData.alpha.toFixed(2)}`, 10, 30);

      ctx.fillStyle = '#ffdc96'; // Corresponding color for beta
      ctx.fillText(`Beta: ${alphaBetaData.beta.toFixed(2)}`, 10, 60);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default EEGMusicInterface;

