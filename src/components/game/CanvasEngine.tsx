import React, { useEffect, useRef } from 'react';
import { audioAPI } from '../../lib/audio';

// Game Engine Constants & Types
const SPAWN_RATE = 1500; // ms
const NODE_LIFETIME = 3000; // ms to hit
const HIT_WINDOW = 500; // ms

interface SpellNode {
    id: number;
    x: number;
    y: number;
    spawnTime: number;
    type: 'fire' | 'frost' | 'arcane';
    status: 'active' | 'hit' | 'missed' | 'echo';
    echoTime?: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
}

export const CanvasEngine: React.FC<{
    onScore: (pts: number) => void;
    onCombo: (combo: number) => void;
    onDamage: () => void;
}> = ({ onScore, onCombo, onDamage }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<SpellNode[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const lastSpawnTime = useRef<number>(0);
    const comboRef = useRef<number>(0);
    const animationId = useRef<number>(0);
    
    // Store callbacks in ref to prevent engine rebooting
    const callbacks = useRef({ onScore, onCombo, onDamage });
    useEffect(() => {
        callbacks.current = { onScore, onCombo, onDamage };
    }, [onScore, onCombo, onDamage]);

    // Engine loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Make canvas full screen without clearing immediately on resize
        const resize = () => {
            const temp = ctx.getImageData(0, 0, canvas.width || 1, canvas.height || 1);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (canvas.width > 0 && canvas.height > 0) {
               ctx.putImageData(temp, 0, 0); // avoid stuttering clear
            }
        };
        window.addEventListener('resize', resize);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const spawnNode = (now: number) => {
            const padding = 100;
            const x = padding + Math.random() * (canvas.width - padding * 2);
            const y = padding + Math.random() * (canvas.height - padding * 2);
            const types: ('fire' | 'frost' | 'arcane')[] = ['fire', 'frost', 'arcane'];
            
            nodesRef.current.push({
                id: Math.random(),
                x,
                y,
                spawnTime: now,
                type: types[Math.floor(Math.random() * types.length)],
                status: 'active'
            });
        };

        const createExplosion = (x: number, y: number, color: string) => {
            for (let i = 0; i < 20; i++) {
                particlesRef.current.push({
                    x, y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1,
                    maxLife: 30 + Math.random() * 20,
                    color
                });
            }
        };

        const render = (time: number) => {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.3)'; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Spawning logic
            // Increase difficulty over time by reducing spawn rate... (simplified here)
            if (time - lastSpawnTime.current > SPAWN_RATE - Math.min(1000, time / 100)) {
                spawnNode(time);
                lastSpawnTime.current = time;
            }

            // Update & Draw Nodes
            for (let i = nodesRef.current.length - 1; i >= 0; i--) {
                const node = nodesRef.current[i];
                const age = time - node.spawnTime;

                if (node.status === 'active') {
                    if (age > NODE_LIFETIME) {
                        node.status = 'missed';
                        comboRef.current = 0;
                        callbacks.current.onCombo(0);
                        callbacks.current.onDamage(); // Miss penalty
                        createExplosion(node.x, node.y, '#ff0000');
                        audioAPI.playMiss();
                    } else {
                        // Draw contracting ring
                        const ringRadius = 80 - (60 * (age / NODE_LIFETIME));
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, Math.max(20, ringRadius), 0, Math.PI * 2);
                        ctx.strokeStyle = node.type === 'fire' ? '#ff4f40' : node.type === 'frost' ? '#40e0d0' : '#d840ff';
                        ctx.lineWidth = 3;
                        ctx.stroke();

                        // Draw core
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
                        ctx.fillStyle = node.type === 'fire' ? '#ff9b40' : node.type === 'frost' ? '#a2fff8' : '#edb2ff';
                        ctx.fill();
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                } else if (node.status === 'echo') {
                    // Draw lingering echo
                    const echoAge = time - (node.echoTime || time);
                    if (echoAge > 5000) { // Echoes last 5 seconds
                        nodesRef.current.splice(i, 1);
                        continue;
                    }

                    const alpha = 1 - (echoAge / 5000);
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 30 + Math.sin(time / 200) * 5, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                    ctx.fillStyle = `rgba(0, 255, 255, ${alpha * 0.1})`;
                    ctx.lineWidth = 2;
                    ctx.fill();
                    ctx.stroke();
                }

                if (node.status === 'missed') {
                    nodesRef.current.splice(i, 1);
                }
            }

            // Update & Draw Particles
            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life++;
                const alpha = 1 - (p.life / p.maxLife);

                if (alpha <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, 3 * alpha, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            animationId.current = requestAnimationFrame(render);
        };

        animationId.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationId.current);
            window.removeEventListener('resize', resize);
        };
    }, []); // Only run once on mount!

    // Input Handling
    const handleTap = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        
        let clientX = 0;
        let clientY = 0;
        
        if ('touches' in e && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if ('clientX' in e) {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        } else {
            return;
        }

        const time = performance.now();
        let hit = false;

        for (let i = nodesRef.current.length - 1; i >= 0; i--) {
            const node = nodesRef.current[i];
            const dist = Math.hypot(node.x - clientX, node.y - clientY);

            if (dist < 60) {
                if (node.status === 'active') {
                    // Check timing
                    const targetTime = node.spawnTime + NODE_LIFETIME;
                    const diff = Math.abs(time - targetTime);

                    if (diff < HIT_WINDOW) {
                        // PERFECT / GOOD HIT
                        hit = true;
                        node.status = 'echo';
                        node.echoTime = time;
                        comboRef.current += 1;
                        callbacks.current.onCombo(comboRef.current);
                        
                        const pts = diff < HIT_WINDOW / 2 ? 300 : 100;
                        callbacks.current.onScore(pts * comboRef.current);

                        // Trigger visual & sound
                        audioAPI.playHit(comboRef.current);
                        if (navigator.vibrate) navigator.vibrate(50);
                    } else {
                        // EARLY/LATE
                        hit = true;
                        node.status = 'missed';
                        comboRef.current = 0;
                        callbacks.current.onCombo(0);
                        audioAPI.playMiss();
                        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                    }
                } else if (node.status === 'echo') {
                    // Triggering an Echo Chain!
                    hit = true;
                    comboRef.current += 5; // Big combo jump
                    callbacks.current.onCombo(comboRef.current);
                    callbacks.current.onScore(1000 * comboRef.current);
                    
                    // Consume the echo
                    nodesRef.current.splice(i, 1);
                    
                    audioAPI.playEchoChain();
                    if (navigator.vibrate) navigator.vibrate(200);
                    
                    // Haptic "explosion" visual
                    const ctx = canvasRef.current?.getContext('2d');
                    if (ctx) {
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 200, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                        ctx.fill();
                    }
                }
            }
        }

        if (!hit) {
            // Tap out of bounds
            comboRef.current = 0;
            callbacks.current.onCombo(0);
            audioAPI.playMiss();
        }
    };

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 block w-full h-full touch-none"
            onPointerDown={handleTap}
        />
    );
};
