const spotlight = document.getElementById('profileSpotlight');

// --- Custom Cursor Logic ---
const cursor = document.getElementById('customCursor');
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth animation loop for cursor
function animateCursor() {
    // Ease the cursor position towards the actual mouse position
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    if (cursor && cursorGlow) {
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`; // Direct for the sharp circle
        cursorGlow.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`; // Laggy for the glow
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Add hover class to body when hovering interactive elements
const interactables = document.querySelectorAll('a, button, .spotlight-container, .poster-card, .project-card, .poster-card-small');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// --- Scroll Reveal Logic ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-section');
            observer.unobserve(entry.target); // Only reveal once
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden-section').forEach(section => {
    observer.observe(section);
});


// --- 3D Spotlight Tilt Logic ---
if (spotlight) {
    spotlight.addEventListener('mousemove', (e) => {
        const rect = spotlight.getBoundingClientRect();
        // Calculate mouse position relative to the container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Apply 3D tilt effect on the container itself
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = (y - centerY) / 20; // Adjust division for more/less tilt
        const tiltY = -(x - centerX) / 20;

        spotlight.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update CSS variables exclusively for the mask position
        const revealImg = spotlight.querySelector('.reveal-img');
        if (revealImg) {
            revealImg.style.setProperty('--x', `${x}px`);
            revealImg.style.setProperty('--y', `${y}px`);
        }
    });

    spotlight.addEventListener('mouseleave', () => {
        // Reset 3D tilt
        spotlight.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
}

// --- 3D Background (Three.js) Logic ---
const canvas = document.getElementById('bg-canvas');
if (canvas && typeof THREE !== 'undefined') {
    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Create Creative Geometric Object (A fractured dark tech crystal/Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // We use a wireframe material with the golden accent color for a futuristic, gadget schematic vibe
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xf7c00f, 
        wireframe: true, 
        transparent: true,
        opacity: 0.15 
    });
    
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Initial subtle rotation
    shape.rotation.x = Math.PI / 4;
    shape.rotation.y = Math.PI / 4;

    // 5. Scroll Interaction Logic
    let currentScroll = 0;
    let targetRotationX = shape.rotation.x;
    let targetRotationY = shape.rotation.y;
    let smoothScrollBg = 0; // Smoothed scroll value for background

    window.addEventListener('scroll', () => {
        currentScroll = window.scrollY;
    });

    // 6. Animation Loop
    const clock = new THREE.Clock();

    function render3D() {
        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate scroll value (eliminates jitter)
        smoothScrollBg += (currentScroll - smoothScrollBg) * 0.004;

        // Map smoothed scroll to target rotation
        targetRotationY = (smoothScrollBg * 0.003) + Math.PI / 4;
        targetRotationX = (smoothScrollBg * 0.002) + Math.PI / 4;

        // Add a slow constant idle rotation combined with the scroll target for a fluid feel
        shape.rotation.y += (targetRotationY + Math.sin(elapsedTime * 0.2) * 0.5 - shape.rotation.y) * 0.006;
        shape.rotation.x += (targetRotationX + Math.cos(elapsedTime * 0.2) * 0.5 - shape.rotation.x) * 0.006;
        
        // Slight bobbing effect up and down
        shape.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

        renderer.render(scene, camera);
        requestAnimationFrame(render3D);
    }
    
    render3D();

    // 7. Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Foreground 3D Overlay (Flowing Lights & Robot Follower) ---
const fgCanvas = document.getElementById('fg-canvas');
if (fgCanvas && typeof THREE !== 'undefined') {
    const fgScene = new THREE.Scene();
    
    // Camera
    const fgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    fgCamera.position.z = 10;
    
    // Renderer
    const fgRenderer = new THREE.WebGLRenderer({ canvas: fgCanvas, alpha: true, antialias: true });
    fgRenderer.setSize(window.innerWidth, window.innerHeight);
    fgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    fgRenderer.outputEncoding = THREE.sRGBEncoding;

    // Lighting
    const fgAmbient = new THREE.AmbientLight(0xffffff, 0.8);
    fgScene.add(fgAmbient);
    const fgDir = new THREE.DirectionalLight(0xf7c00f, 1.5); // Golden rim
    fgDir.position.set(5, 5, 5);
    fgScene.add(fgDir);
    const fgBack = new THREE.DirectionalLight(0xffffff, 0.5);
    fgBack.position.set(-5, -5, -5);
    fgScene.add(fgBack);

    // 1. Flowing Lights (Particles)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 40;
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    const phaseArray = new Float32Array(particleCount);

    for(let i = 0; i < particleCount * 3; i+=3) {
        // Spread across screen
        posArray[i] = (Math.random() - 0.5) * 30; // x
        posArray[i+1] = (Math.random() - 0.5) * 20; // y
        posArray[i+2] = (Math.random() - 0.5) * 5 + 2; // z (slightly in front)
        
        scaleArray[i/3] = Math.random() * 2;
        phaseArray[i/3] = Math.random() * Math.PI * 2; // Random starting phase
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));
    particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phaseArray, 1));

    // Custom shader for soft glowing blurred dots
    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0xf7c00f) }
        },
        vertexShader: `
            attribute float aScale;
            attribute float aPhase;
            varying float vPhase;
            uniform float time;
            
            void main() {
                vPhase = aPhase;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                // Bobbing motion based on time and unique phase
                mvPosition.y += sin(time * 0.5 + aPhase) * 1.5;
                mvPosition.x += cos(time * 0.3 + aPhase) * 0.5;
                
                gl_Position = projectionMatrix * mvPosition;
                // Size attenuation
                gl_PointSize = 150.0 * aScale * (1.0 / -mvPosition.z);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying float vPhase;
            
            void main() {
                // Create a soft circle
                float r = distance(gl_PointCoord, vec2(0.5));
                if (r > 0.5) discard;
                
                // Soft glow edge
                float alpha = (0.5 - r) * 2.0;
                // Pulsing opacity
                float pulse = 0.2 + 0.15 * sin(time * 1.5 + vPhase);
                
                gl_FragColor = vec4(color, alpha * pulse);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    fgScene.add(particles);

    // 2. Cursor Following Companion (Robot)
    let companion;
    let compMixer;
    let targetX = 0;
    let targetY = 0;

    // --- NEW PHYSICS/EMOTIONS STATE ---
    let compVelocity = new THREE.Vector3(0,0,0);
    let compRotVelocity = new THREE.Vector3(0,0,0);
    let allActions = {};
    let idleAction = null;
    let currentAction = null;
    let pokeCooldown = false;

    // 3D Robot disabled as per user request

    // 3. Track scroll for companion logic instead of mouse
    let scrollYOffset = 0;
    let scrollYOffsetTarget = 0; // Raw target, smoothed per-frame
    let targetXOffset = 6.0;
    
    // Calculate initial offset
    const calcScrollOffset = () => {
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const scrollPercent = window.scrollY / maxScroll;
        
        // Dynamically calculate visible space at z=0 (camera at z=10, distance=10)
        const vFov = (75 * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * 10;
        const visibleWidth = visibleHeight * (window.innerWidth / window.innerHeight);
        
        // Map from top to bottom with some padding
        const verticalPadding = 2.0;
        scrollYOffsetTarget = (visibleHeight / 2 - verticalPadding) - (scrollPercent * (visibleHeight - verticalPadding * 2)); 
        
        // Position on the right edge
        targetXOffset = (visibleWidth / 2) - 1.5; 
    };
    calcScrollOffset();

    window.addEventListener('scroll', calcScrollOffset);

    // 4. Render Loop
    const fgClock = new THREE.Clock();

    // --- Ouch Sound (Web Audio API, no file needed) ---
    let ouchCooldown = false;
    let robotWasAway = false; // Track if robot was recently away from the right wall
    const playOuchSound = () => {
        if (ouchCooldown) return;
        ouchCooldown = true;
        setTimeout(() => ouchCooldown = false, 3000); // 3s cooldown so it's not annoying

        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();

            // Voice-like "ow" using two oscillators
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'triangle';

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            // "ow" sweep — pitch goes up then down
            osc1.frequency.setValueAtTime(280, now);
            osc1.frequency.linearRampToValueAtTime(420, now + 0.1);
            osc1.frequency.linearRampToValueAtTime(200, now + 0.35);

            osc2.frequency.setValueAtTime(290, now);
            osc2.frequency.linearRampToValueAtTime(430, now + 0.1);
            osc2.frequency.linearRampToValueAtTime(210, now + 0.35);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.4);
            osc2.stop(now + 0.4);
        } catch(e) { /* Audio context blocked */ }
    };

    // --- RAYCASTER FOR INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const clickTarget = new THREE.Vector3();

    window.addEventListener('pointerdown', (event) => {
        if (!companion) return; // Not ready yet
        
        // Convert mouse position to normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, fgCamera);
        
        // Reliable Mathematical click detection on the exact Z-plane of the robot
        raycaster.ray.intersectPlane(planeZ, clickTarget);
        if (clickTarget) {
            const hitDistance = clickTarget.distanceTo(companion.position);
            if (hitDistance < 3.5) { // generous 3.5 unit hit radius
                pokeCompanion();
            }
        }
    });

    function pokeCompanion() {
        if (pokeCooldown) return;
        pokeCooldown = true;

        playOuchSound();

        // 1. Play Random Emotion
        const emotions = ['thumbsup', 'yes', 'wave', 'jump', 'dance', 'punch'];
        const available = emotions.map(e => allActions[e]).filter(a => a);
        
        if (available.length > 0 && currentAction) {
            const emotionAction = available[Math.floor(Math.random() * available.length)];
            emotionAction.reset();
            emotionAction.setLoop(THREE.LoopOnce, 1);
            emotionAction.clampWhenFinished = true;
            
            emotionAction.play();
            currentAction.crossFadeTo(emotionAction, 0.2, true);
            currentAction = emotionAction;
            
            const restoreIdle = (e) => {
                if (e.action === emotionAction) {
                    compMixer.removeEventListener('finished', restoreIdle);
                    if (idleAction) {
                        idleAction.reset();
                        idleAction.play();
                        currentAction.crossFadeTo(idleAction, 0.5, true);
                        currentAction = idleAction;
                    }
                    setTimeout(() => pokeCooldown = false, 500);
                }
            };
            compMixer.addEventListener('finished', restoreIdle);
        } else {
            setTimeout(() => pokeCooldown = false, 1000);
        }

        // 2. Apply Physics Poke (Spring Velocity)
        compVelocity.set(
            (Math.random() - 0.5) * 8,  // Add more intense x knock
            Math.random() * 5 + 3,      // Higher jump up
            -3.0                        // Push back
        );
        compRotVelocity.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
    }

    function renderForeground() {
        requestAnimationFrame(renderForeground);
        const elapsedTime = fgClock.getElapsedTime();
        const delta = fgClock.getDelta();
        
        // Smoothly lerp scrollYOffset toward its target each frame
        scrollYOffset += (scrollYOffsetTarget - scrollYOffset) * 0.005;

        // Update particle shader time
        particleMaterial.uniforms.time.value = elapsedTime;

        // Update Companion Robot
        if (compMixer) compMixer.update(delta);
        
        if (companion) {
            // Wander freely anywhere in the website instead of sticking right
            targetX = Math.sin(elapsedTime * 0.3) * (window.innerWidth / 150); 
            targetY = scrollYOffset + Math.cos(elapsedTime * 0.5) * 4.0;

            // Soft hover bob up and down integrated into target
            const bobbedTargetY = targetY + Math.sin(elapsedTime * 3) * 0.2;

            // --- SPRING PHYSICS ---
            // Update velocities towards targets
            compVelocity.x += (targetX - companion.position.x) * 0.003;
            compVelocity.y += (bobbedTargetY - companion.position.y) * 0.003;
            compVelocity.z += (0 - companion.position.z) * 0.003;

            // Damping (Friction)
            compVelocity.multiplyScalar(0.95);
            
            // Apply Position
            companion.position.add(compVelocity);

            // Tilt/Rotation targets
            const posVelocityY = (bobbedTargetY - companion.position.y);
            const posVelocityX = (targetX - companion.position.x);

            const targetRotY = Math.PI; // Face directly front (camera)
            const targetRotX = (posVelocityY * -0.3); // Pitch when moving up/down 
            const targetRotZ = (posVelocityX * -0.15); // Bank when moving left/right

            // Update rotation velocities
            compRotVelocity.x += (targetRotX - companion.rotation.x) * 0.005;
            compRotVelocity.y += (targetRotY - companion.rotation.y) * 0.005;
            compRotVelocity.z += (targetRotZ - companion.rotation.z) * 0.005;

            // Damping for rotation
            compRotVelocity.multiplyScalar(0.94);

            // Apply Rotation
            companion.rotation.x += compRotVelocity.x;
            companion.rotation.y += compRotVelocity.y;
            companion.rotation.z += compRotVelocity.z;

            // Ouch! — state-based: only trigger when robot ARRIVES at the wall after being away
            const distFromEdge = Math.abs(companion.position.x - targetXOffset);
            if (distFromEdge > 1.5) {
                // Robot is far from the wall — mark it as "away"
                robotWasAway = true;
            } else if (distFromEdge < 0.4 && robotWasAway) {
                // Robot just arrived at the wall after being away — OUCH!
                robotWasAway = false;
                playOuchSound();
            }
        }

        fgRenderer.render(fgScene, fgCamera);
    }
    renderForeground();

    window.addEventListener('resize', () => {
        fgCamera.aspect = window.innerWidth / window.innerHeight;
        fgCamera.updateProjectionMatrix();
        fgRenderer.setSize(window.innerWidth, window.innerHeight);
        calcScrollOffset();
    });
}

// --- Movie Vault: Built-in DB + Optional API + Suggestions + Filters ---
// To enable live online search, get a free OMDB API key at https://www.omdbapi.com/apikey.aspx
// Then replace 'YOUR_KEY_HERE' below with your key.
const OMDB_API_KEY = 'eb456bed';
const OMDB_ENABLED = OMDB_API_KEY !== 'YOUR_KEY_HERE';

const addMovieBtn = document.getElementById('addMovieBtn');
const movieSearchModal = document.getElementById('movieSearchModal');
const movieSearchClose = document.getElementById('movieSearchClose');
const omdbSearchInput = document.getElementById('omdbSearchInput');
const omdbSearchBtn = document.getElementById('omdbSearchBtn');
const omdbResults = document.getElementById('omdbResults');
const suggestionsGrid = document.getElementById('suggestionsGrid');
const vaultGrid = document.querySelector('.vault-grid');

// Built-in movie database (works offline, no API key needed)
const MOVIE_DB = [
    { title: "Inception", year: "2010", rating: "8.8", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg" },
    { title: "Interstellar", year: "2014", rating: "8.7", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
    { title: "The Matrix", year: "1999", rating: "8.7", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
    { title: "Oppenheimer", year: "2023", rating: "8.5", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
    { title: "Dune", year: "2021", rating: "8.0", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg" },
    { title: "Dune: Part Two", year: "2024", rating: "8.5", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7S.jpg" },
    { title: "John Wick", year: "2014", rating: "7.4", genre: "action", poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg" },
    { title: "Parasite", year: "2019", rating: "8.5", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg" },
    { title: "Whiplash", year: "2014", rating: "8.5", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg" },
    { title: "Fight Club", year: "1999", rating: "8.8", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg" },
    { title: "Pulp Fiction", year: "1994", rating: "8.9", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg" },
    { title: "The Prestige", year: "2006", rating: "8.5", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg" },
    { title: "Se7en", year: "1995", rating: "8.6", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg" },
    { title: "Gladiator", year: "2000", rating: "8.5", genre: "action", poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgCelQ.jpg" },
    { title: "Joker", year: "2019", rating: "8.4", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg" },
    { title: "Tenet", year: "2020", rating: "7.3", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg" },
    { title: "The Shawshank Redemption", year: "1994", rating: "9.3", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/9cjIGRiQGMfLqLPRwuQiZz9up3s.jpg" },
    { title: "The Godfather", year: "1972", rating: "9.2", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg" },
    { title: "Spider-Man: Across the Spider-Verse", year: "2023", rating: "8.7", genre: "animation", poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
    { title: "Avengers: Endgame", year: "2019", rating: "8.4", genre: "action", poster: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
    { title: "The Social Network", year: "2010", rating: "7.8", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg" },
    { title: "Shutter Island", year: "2010", rating: "8.2", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/kve20tXMHFueDKL1wGMqlQRH27v.jpg" },
    { title: "The Wolf of Wall Street", year: "2013", rating: "8.2", genre: "comedy", poster: "https://image.tmdb.org/t/p/w500/34m2tygAYBGqA9MXKhRDtzYd4MR.jpg" },
    { title: "Django Unchained", year: "2012", rating: "8.4", genre: "action", poster: "https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg" },
    { title: "Mad Max: Fury Road", year: "2015", rating: "8.1", genre: "action", poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg" },
    { title: "Gone Girl", year: "2014", rating: "8.1", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/lv5xShBIDPe4chEYoirMjdq7uh.jpg" },
    { title: "Your Name", year: "2016", rating: "8.4", genre: "animation", poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg" },
    { title: "The Batman", year: "2022", rating: "7.8", genre: "action", poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
    { title: "No Country for Old Men", year: "2007", rating: "8.2", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/bj1v6YKF8yHqA489GFfAWczE0sY.jpg" },
    { title: "Blade Runner 2049", year: "2017", rating: "8.0", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg" },
    { title: "The Grand Budapest Hotel", year: "2014", rating: "8.1", genre: "comedy", poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg" },
    { title: "Get Out", year: "2017", rating: "7.7", genre: "horror", poster: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg" },
    { title: "A Quiet Place", year: "2018", rating: "7.5", genre: "horror", poster: "https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg" },
    { title: "Spirited Away", year: "2001", rating: "8.6", genre: "animation", poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg" },
    { title: "The Silence of the Lambs", year: "1991", rating: "8.6", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/uS9m8OBk1RVFDUGc2dQxMC893aR.jpg" },
    { title: "Forrest Gump", year: "1994", rating: "8.8", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg" },
    { title: "Goodfellas", year: "1990", rating: "8.7", genre: "drama", poster: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJDx1ueHhUItZKIE.jpg" },
    { title: "The Departed", year: "2006", rating: "8.5", genre: "thriller", poster: "https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg" },
    { title: "Alien", year: "1979", rating: "8.5", genre: "horror", poster: "https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg" },
    { title: "Everything Everywhere All at Once", year: "2022", rating: "8.0", genre: "sci-fi", poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg" },
];

// Quick suggestion names for the pills
const SUGGESTION_NAMES = [
    'Inception', 'Interstellar', 'Oppenheimer', 'Dune', 'Parasite',
    'Whiplash', 'Fight Club', 'Joker', 'The Batman', 'Spider-Verse',
    'Your Name', 'Spirited Away', 'Get Out', 'Tenet', 'Gladiator'
];

// Render suggestion pills
if (suggestionsGrid) {
    suggestionsGrid.innerHTML = SUGGESTION_NAMES.map(name =>
        `<span class="suggestion-pill" data-query="${name}">${name}</span>`
    ).join('');

    suggestionsGrid.addEventListener('click', (e) => {
        const pill = e.target.closest('.suggestion-pill');
        if (pill) {
            const query = pill.getAttribute('data-query');
            omdbSearchInput.value = query;
            searchMovies(query);
        }
    });
}

// Load saved movies from localStorage on page load
function loadSavedMovies() {
    const saved = JSON.parse(localStorage.getItem('curioVaultMovies') || '[]');
    saved.forEach(movie => renderMovieCard(movie));
}

// Render a single movie card in the vault grid
function renderMovieCard(movie) {
    const newCard = document.createElement('div');
    newCard.className = 'poster-card-vault masterpiece';
    newCard.style.animation = 'scaleIn 0.5s ease-out';
    if (movie.genre) newCard.setAttribute('data-genre', movie.genre);
    if (movie.rating) newCard.setAttribute('data-rating', movie.rating);

    const posterSrc = movie.poster && movie.poster !== 'N/A' && movie.poster !== 'null' && movie.poster !== ''
        ? movie.poster
        : 'https://placehold.co/300x450/1a1a2e/e0e0e0?text=No+Poster';

    newCard.innerHTML = `
        <img src="${posterSrc}" alt="${movie.title}">
        <div class="vault-data-overlay">
            <div class="vault-rating">
                <span class="imdb-score"><i class="fa-solid fa-star"></i> ${movie.rating || 'N/A'}</span>
            </div>
            <p class="curio-rating">"${movie.title}"</p>
            <label class="favorite-toggle">
                <input type="checkbox">
                <span class="slider"></span>
                <span class="fav-text">Favorite</span>
            </label>
        </div>
    `;

    const addButton = vaultGrid.querySelector('.vault-add-new');
    vaultGrid.insertBefore(newCard, addButton.nextSibling);
}

// Save a movie to localStorage and render it
function saveAndRenderMovie(movie) {
    const saved = JSON.parse(localStorage.getItem('curioVaultMovies') || '[]');
    if (saved.find(m => m.title === movie.title && m.year === movie.year)) return;
    saved.push(movie);
    localStorage.setItem('curioVaultMovies', JSON.stringify(saved));
    renderMovieCard(movie);
}

// Render search results in modal
function renderResults(results) {
    if (results.length === 0) {
        omdbResults.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">No movies found. Try a different name.</p>';
        return;
    }
    omdbResults.innerHTML = results.map(m => `
        <div class="movie-result-card" data-title="${m.title}" data-year="${m.year}" data-poster="${m.poster || ''}" data-rating="${m.rating || ''}" data-genre="${m.genre || ''}">
            <img src="${m.poster && m.poster !== 'N/A' ? m.poster : 'https://placehold.co/50x75/1a1a2e/e0e0e0?text=?'}" alt="${m.title}">
            <div class="movie-result-info">
                <h4>${m.title}</h4>
                <p>${m.year} &bull; ★ ${m.rating || 'N/A'}</p>
            </div>
            <div class="movie-result-add"><i class="fa-solid fa-plus-circle"></i></div>
        </div>
    `).join('');

    omdbResults.querySelectorAll('.movie-result-card').forEach(card => {
        card.addEventListener('click', () => {
            const movie = {
                title: card.getAttribute('data-title'),
                year: card.getAttribute('data-year'),
                poster: card.getAttribute('data-poster'),
                rating: card.getAttribute('data-rating'),
                genre: card.getAttribute('data-genre')
            };
            saveAndRenderMovie(movie);
            card.style.borderColor = '#1ed760';
            card.querySelector('.movie-result-add').innerHTML = '<i class="fa-solid fa-check"></i>';
            card.style.pointerEvents = 'none';
        });
    });
}

// Search movies — built-in DB first, then OMDB API if enabled
async function searchMovies(query) {
    if (!query.trim()) return;
    omdbResults.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">Searching...</p>';

    const q = query.toLowerCase().trim();

    // Search built-in DB
    const localResults = MOVIE_DB.filter(m => m.title.toLowerCase().includes(q));

    if (localResults.length > 0) {
        renderResults(localResults);
        return;
    }

    // If OMDB API key is set, try online search
    if (OMDB_ENABLED) {
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
            const data = await res.json();
            if (data.Response === 'True' && data.Search) {
                const apiResults = data.Search.slice(0, 10).map(m => ({
                    title: m.Title,
                    year: m.Year,
                    poster: m.Poster !== 'N/A' ? m.Poster : '',
                    rating: '',
                    genre: ''
                }));
                renderResults(apiResults);
                return;
            }
        } catch (err) {
            console.error('OMDB search error:', err);
        }
    }

    // Nothing found
    omdbResults.innerHTML = '<p style="color:var(--text-secondary);text-align:center;">No movies found in our database. Try a different name.</p>';
}

// Debounced live search as user types
let searchTimeout;
if (omdbSearchInput) {
    omdbSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const q = e.target.value.trim();
        if (q.length >= 2) {
            searchTimeout = setTimeout(() => searchMovies(q), 300);
        } else if (q.length === 0) {
            omdbResults.innerHTML = '';
        }
    });
}

// Event: Open modal
if (addMovieBtn) {
    addMovieBtn.addEventListener('click', () => {
        movieSearchModal.classList.add('active');
        setTimeout(() => omdbSearchInput.focus(), 100);
    });
}

// Event: Close modal
if (movieSearchClose) {
    movieSearchClose.addEventListener('click', () => {
        movieSearchModal.classList.remove('active');
        omdbSearchInput.value = '';
        omdbResults.innerHTML = '';
    });
}

// Close on backdrop click
if (movieSearchModal) {
    movieSearchModal.addEventListener('click', (e) => {
        if (e.target === movieSearchModal) {
            movieSearchModal.classList.remove('active');
            omdbSearchInput.value = '';
            omdbResults.innerHTML = '';
        }
    });
}

// Event: Search button click
if (omdbSearchBtn) {
    omdbSearchBtn.addEventListener('click', () => searchMovies(omdbSearchInput.value));
}

// Event: Enter key in search input
if (omdbSearchInput) {
    omdbSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies(omdbSearchInput.value);
    });
}

// Load saved movies on page start
if (vaultGrid) loadSavedMovies();

// --- Vault Filter Logic ---
const filterGenre = document.getElementById('filterGenre');
const filterRating = document.getElementById('filterRating');

function applyFilters() {
    if (!vaultGrid) return;
    const genre = filterGenre ? filterGenre.value : 'all';
    const minRating = filterRating ? filterRating.value : 'all';

    const cards = vaultGrid.querySelectorAll('.poster-card-vault.masterpiece');
    cards.forEach(card => {
        let show = true;
        if (genre !== 'all') {
            const cardGenre = (card.getAttribute('data-genre') || '').toLowerCase();
            if (!cardGenre.includes(genre)) show = false;
        }
        if (minRating !== 'all') {
            const cardRating = parseFloat(card.getAttribute('data-rating') || '0');
            if (cardRating < parseFloat(minRating)) show = false;
        }
        card.style.display = show ? '' : 'none';
    });
}

if (filterGenre) filterGenre.addEventListener('change', applyFilters);
if (filterRating) filterRating.addEventListener('change', applyFilters);

// --- Image Preview Modal Logic ---
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("modalCaption");
const span = document.getElementsByClassName("modal-close")[0];

if (modal) {
    // Open modal on image click
    const milestoneImages = document.querySelectorAll('.milestone-img');
    milestoneImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            // slight delay to allow display flex to apply before opacity transition starts
            setTimeout(() => modal.classList.add('active'), 10); 
            modalImg.src = this.getAttribute('data-full') || this.src;
            captionText.innerHTML = this.alt;
        });
    });

    // Close modal functions
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = "none", 300); // match transition duration
    };

    if (span) {
        span.onclick = closeModal;
    }

    // Close if clicked anywhere outside the image
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // Close on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// --- DNA Helix on Left Edge ---
const dnaHelix = document.getElementById('dnaHelix');
if (dnaHelix) {
    const RUNG_COUNT = 40;
    const rungs = [];
    const helixWidth = 24; // matches CSS width

    // Build rungs dynamically
    for (let i = 0; i < RUNG_COUNT; i++) {
        const rung = document.createElement('div');
        rung.className = 'dna-rung';
        rung.innerHTML = `
            <span class="dna-node strand-a"></span>
            <span class="dna-bar"></span>
            <span class="dna-node strand-b"></span>
        `;
        dnaHelix.appendChild(rung);
        rungs.push({
            el: rung,
            nodeA: rung.querySelector('.strand-a'),
            nodeB: rung.querySelector('.strand-b'),
            bar: rung.querySelector('.dna-bar'),
        });
    }

    let dnaPhaseOffset = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const delta = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        scrollVelocity += delta * 0.4;
    });

    function updateDNA() {
        // Idle drift + scroll-driven rotation
        dnaPhaseOffset += 0.008 + scrollVelocity * 0.02;
        scrollVelocity *= 0.92; // smooth decay

        const containerH = dnaHelix.offsetHeight || window.innerHeight * 0.7;
        const spacing = containerH / RUNG_COUNT;

        for (let i = 0; i < RUNG_COUNT; i++) {
            const y = i * spacing;
            const phase = dnaPhaseOffset + i * 0.32; // tighter twist

            const wave = Math.sin(phase);
            const depth = Math.cos(phase);

            // Horizontal positions within 24px width
            const halfW = helixWidth / 2;
            const amplitude = halfW * 0.38;
            const nodeAx = halfW + wave * amplitude;
            const nodeBx = halfW - wave * amplitude;

            const r = rungs[i];
            r.el.style.top = y + 'px';

            r.nodeA.style.marginLeft = nodeAx + 'px';
            r.nodeB.style.marginRight = (helixWidth - nodeBx) + 'px';

            // Depth-based opacity for 3D illusion
            const absDepth = Math.abs(depth);
            const frontOpacity = 0.25 + absDepth * 0.75;
            r.nodeA.style.opacity = frontOpacity;
            r.nodeB.style.opacity = frontOpacity;
            r.bar.style.opacity = 0.08 + absDepth * 0.25;

            // Scale for depth
            const s = 0.5 + absDepth * 0.6;
            r.nodeA.style.transform = `scale(${s})`;
            r.nodeB.style.transform = `scale(${s})`;

            // Glow intensity swaps based on which strand is "in front"
            if (depth > 0) {
                r.nodeA.style.boxShadow = `0 0 ${4 + depth * 4}px rgba(247, 192, 15, ${0.3 + depth * 0.4})`;
                r.nodeB.style.boxShadow = `0 0 3px rgba(255, 255, 255, ${0.15 + depth * 0.15})`;
            } else {
                r.nodeA.style.boxShadow = `0 0 2px rgba(247, 192, 15, 0.15)`;
                r.nodeB.style.boxShadow = `0 0 ${4 - depth * 4}px rgba(255, 255, 255, ${0.3 - depth * 0.4})`;
            }
        }

        requestAnimationFrame(updateDNA);
    }

    updateDNA();
}


