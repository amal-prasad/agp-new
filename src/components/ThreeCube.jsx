import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ThreeCube() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        // Skip on reduced motion or narrow screens
        if (prefersReducedMotion || window.innerWidth < 768) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // --- Scene setup ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            50,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            100
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // --- Wireframe cube ---
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x0a0a0a,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // --- Auto-rotation ---
        let animationId;
        const autoRotate = () => {
            cube.rotation.y += 0.003;
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(autoRotate);
        };
        autoRotate();

        // --- Scroll-scrubbed rotation ---
        const heroEl = document.getElementById('hero');
        let scrollCtx;
        if (heroEl) {
            scrollCtx = gsap.context(() => {
                gsap.timeline({
                    scrollTrigger: {
                        trigger: heroEl,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5,
                    },
                })
                    .to(cube.rotation, { x: Math.PI * 2, duration: 1 }, 0)
                    .to(cube.rotation, { y: Math.PI * 1.5, duration: 1 }, 0);
            });
        }

        // --- Resize handler ---
        const handleResize = () => {
            if (window.innerWidth < 768) {
                renderer.setSize(0, 0);
                return;
            }
            const parent = canvas.parentElement;
            if (!parent) return;
            const w = parent.clientWidth;
            const h = parent.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };

        window.addEventListener('resize', handleResize);

        // --- Cleanup ---
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            if (scrollCtx) scrollCtx.revert();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="three-cube-canvas"
            aria-hidden="true"
        />
    );
}
