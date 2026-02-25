import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import App from './App';

// Centralize all GSAP plugin registration — called once, available everywhere
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global defaults — keep all animations on the GPU compositing layer
gsap.defaults({ force3D: true });

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
