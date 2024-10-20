'use client'

import React, { useEffect, useRef, useState } from 'react';

const EEGMusicInterface = () => {
  const canvasRef = useRef(null);
  const [alphaBetaData, setAlphaBetaData] = useState({ alpha: 1, beta: 1 });
  const [prevAlphaBetaData, setPrevAlphaBetaData] = useState({ alpha: 1, beta: 1 });
  const [offset, setOffset] = useState(0);
  const [interpolationProgress, setInterpolationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/alphabeta', { method: 'GET' });
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();

        // Update the previous alpha/beta values and reset interpolation progress
        setPrevAlphaBetaData(alphaBetaData);
        setAlphaBetaData({ alpha: data.avg_alpha, beta: data.avg_beta });
        setInterpolationProgress(0);  // Start new interpolation cycle
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }, 200);

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

    const drawVisualizer = (interpolatedAlpha, interpolatedBeta) => {
      const barWidth = 1; 
      const notes = 50;
    
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#5dbdf5'; 
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    
      ctx.fillStyle = '#5dbdf5';
    
      for (let i = 0; i < notes; i++) {
        const barHeight = Math.abs((i / notes) - (interpolatedAlpha / 2)) * canvas.height * 0.2;
        ctx.fillRect(i * canvas.width / notes, canvas.height - barHeight - (i % 2) * 20, barWidth, barHeight + (i % 2) * 20);
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    };

    const drawText = (interpolatedAlpha, interpolatedBeta) => {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`Alpha: ${interpolatedAlpha.toFixed(2)}`, 10, 30);
      ctx.fillText(`Beta: ${interpolatedBeta.toFixed(2)}`, 10, 60);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let audioData = new Uint8Array(128).fill(0);

    const drawWave = (y, amplitude, color, waveOffset) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 20; 
      ctx.shadowColor = '#5dbdf5'; 
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      for (let i = 0; i < canvas.width; i++) {
        ctx.lineTo(i, y + Math.sin((i + waveOffset) * 0.02) * amplitude);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    };

    const interpolate = (start, end, progress) => {
      return start + (end - start) * progress;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate interpolation progress (between 0 and 1) over time
      const interpolatedAlpha = interpolate(prevAlphaBetaData.alpha, alphaBetaData.alpha, interpolationProgress);
      const interpolatedBeta = interpolate(prevAlphaBetaData.beta, alphaBetaData.beta, interpolationProgress);

      // Draw the waves with interpolated values
      drawWave(canvas.height / 2, Math.min(350, (interpolatedAlpha - 0.5) * 290), '#5dbdf5', offset);
      drawWave(canvas.height / 2, Math.min(350, (interpolatedBeta - 0.4) * 290), '#ffdc96', -offset);

      drawVisualizer(interpolatedAlpha, interpolatedBeta);

      // Draw the text with interpolated values
      drawText(interpolatedAlpha, interpolatedBeta);

      setOffset(offset + 0.2);
      setInterpolationProgress((prevProgress) => Math.min(prevProgress + 0.0075, 1));  // Smooth interpolation

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [alphaBetaData, prevAlphaBetaData, interpolationProgress]);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default EEGMusicInterface;