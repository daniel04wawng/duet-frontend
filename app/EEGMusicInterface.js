'use client'

import React, { useEffect, useRef } from 'react';

const EEGMusicInterface = () => {
  const canvasRef = useRef(null);

  // Placeholder values for excitement and relaxation
  let excitement = 70; // Example value
  let relaxation = 50; // Example value

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let audioData = new Uint8Array(128).fill(0);
    let waveData = { alpha: 50, beta: 30 };
    let offset = 0;

    const drawWave = (y, amplitude, color, waveOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      for (let i = 0; i < canvas.width; i++) {
        ctx.lineTo(i, y + Math.sin((i + waveOffset) * 0.02) * amplitude);
      }
      ctx.stroke();
    };

    const drawVisualizer = () => {
      const barWidth = (canvas.width / audioData.length) * 4; // Increase bar width
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

      for (let i = 0; i < audioData.length; i++) {
        const barHeight = (audioData[i] / 255) * canvas.height * 0.4; // Adjusted height for bigger bars
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
      }
    };

    const animate = () => {
      // Create a fading tail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Tail color with slight transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the entire canvas for the tail effect

      // Draw the alpha and beta waves
      drawWave(canvas.height / 2, waveData.alpha, 'rgba(0, 255, 255, 0.8)', offset);
      drawWave(canvas.height / 2 + 50, waveData.beta, 'rgba(255, 0, 0, 0.8)', -offset);

      drawVisualizer();

      // Increase the speed of scrolling by increasing the offset
      offset += 0.2; // Adjust this value for faster movement

      // Simulate changing audio data
      for (let i = 0; i < audioData.length; i++) {
        audioData[i] = Math.random() * 255;
      }

      // Simulate changing wave data
      waveData.alpha = 50 + Math.sin(offset * 0.1) * 20; // Adjust waveData as needed
      waveData.beta = 30 + Math.cos(offset * 0.1) * 15;  // Adjust waveData as needed

      // Draw the alpha and beta values in the top left corner
      ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'; // Corresponding color for alpha
      ctx.font = '20px Arial';
      ctx.fillText(`Alpha: ${waveData.alpha.toFixed(2)}`, 10, 30);

      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; // Corresponding color for beta
      ctx.fillText(`Beta: ${waveData.beta.toFixed(2)}`, 10, 60);

      // Draw excitement and relaxation values in the top right corner
      ctx.fillStyle = 'rgba(255, 255, 0, 0.8)'; // Example color for excitement
      ctx.fillText(`Excitement: ${excitement}`, canvas.width - 150, 30);

      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'; // Example color for relaxation
      ctx.fillText(`Relaxation: ${relaxation}`, canvas.width - 150, 60);

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

