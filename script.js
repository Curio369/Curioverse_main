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

    window.addEventListener('scroll', () => {
        currentScroll = window.scrollY;
        // Map scroll position to a target rotation
        targetRotationY = (currentScroll * 0.003) + Math.PI / 4;
        targetRotationX = (currentScroll * 0.002) + Math.PI / 4;
    });

    // 6. Animation Loop
    const clock = new THREE.Clock();

    function render3D() {
        const elapsedTime = clock.getElapsedTime();

        // Add a slow constant idle rotation combined with the scroll target for a fluid feel
        shape.rotation.y += (targetRotationY + Math.sin(elapsedTime * 0.2) * 0.5 - shape.rotation.y) * 0.05;
        shape.rotation.x += (targetRotationX + Math.cos(elapsedTime * 0.2) * 0.5 - shape.rotation.x) * 0.05;
        
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
