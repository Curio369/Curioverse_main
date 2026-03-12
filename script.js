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

    if (typeof THREE.GLTFLoader !== 'undefined') {
        const loader = new THREE.GLTFLoader();
        loader.load(
            'assets/RobotExpressive.glb', 
            (gltf) => {
                companion = gltf.scene;
                
                // Core adjustments - bump scale massively to guarantee visibility
                companion.scale.set(2.5, 2.5, 2.5); 
                companion.position.set(0, 0, 8); // Start in middle, quite close to camera
                
                // Add a local light attached directly to the robot so it's never pitch black
                const roboLight = new THREE.PointLight(0xffffff, 2, 10);
                companion.add(roboLight);

                // Face user by default
                companion.rotation.y = Math.PI;

                // Ensure materials render brightly
                companion.traverse((child) => {
                    if (child.isMesh) {
                        child.material.needsUpdate = true;
                    }
                });
                
                fgScene.add(companion);
                console.log("Companion Robot successfully spawned.");

                // Play flying/hovering animation (usually "Walking" or "Running" looks okay in air, but let's test)
                if (gltf.animations && gltf.animations.length) {
                    compMixer = new THREE.AnimationMixer(companion);
                    // "Flying" or "Idle"
                    const anim = gltf.animations.find(a => a.name.toLowerCase().includes('fly')) || gltf.animations.find(a => a.name.toLowerCase().includes('idle')) || gltf.animations[0];
                    if (anim) {
                        compMixer.clipAction(anim).play();
                    }
                }
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded robot');
            },
            (error) => {
                console.error("Critical error loading the companion robot:", error);
            }
        );
    }

    // 3. Track scroll for companion logic instead of mouse
    let scrollYOffset = 0;
    
    // Calculate initial offset
    const calcScrollOffset = () => {
        const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
        const scrollPercent = window.scrollY / maxScroll;
        // Map from 2.5 (top) to -2.5 (bottom)
        scrollYOffset = 2.5 - (scrollPercent * 5); 
    };
    calcScrollOffset();

    window.addEventListener('scroll', calcScrollOffset);

    // 4. Render Loop
    const fgClock = new THREE.Clock();
    
    function renderForeground() {
        requestAnimationFrame(renderForeground);
        const elapsedTime = fgClock.getElapsedTime();
        const delta = fgClock.getDelta();
        
        // Update particle shader time
        particleMaterial.uniforms.time.value = elapsedTime;

        // Update Companion Robot
        if (compMixer) compMixer.update(delta);
        
        if (companion) {
            // Stand off to the right side
            targetX = 6.0; 
            targetY = scrollYOffset;

            // Soft lag interpolation towards target position
            companion.position.x += (targetX - companion.position.x) * 0.05;
            companion.position.y += (targetY - companion.position.y) * 0.05;

            // Tilt to look in direction of vertical movement
            const velocityY = targetY - companion.position.y;
            
            // Base rotation is Math.PI (facing mostly forward). Subtracted 0.3 to slightly angle inward left
            const targetRotY = Math.PI - 0.3; 
            const targetRotX = (velocityY * -0.5); // Pitch forward/back dynamically as it flies up/down
            const targetRotZ = 0; 

            companion.rotation.y += (targetRotY - companion.rotation.y) * 0.05;
            companion.rotation.x += (targetRotX - companion.rotation.x) * 0.05;
            companion.rotation.z += (targetRotZ - companion.rotation.z) * 0.05;
            
            // Add native hover bob up and down
            companion.position.y += Math.sin(elapsedTime * 3) * 0.02;
        }

        fgRenderer.render(fgScene, fgCamera);
    }
    renderForeground();

    window.addEventListener('resize', () => {
        fgCamera.aspect = window.innerWidth / window.innerHeight;
        fgCamera.updateProjectionMatrix();
        fgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Curio-Vault Search Logic ---
const vaultSearchInput = document.getElementById('vaultSearchInput');
const vaultSuggestions = document.getElementById('vaultSuggestions');
const vaultGrid = document.querySelector('.vault-grid');

if (vaultSearchInput && vaultSuggestions && vaultGrid) {
    let movieDB = [];

    // Pre-fetch the local movie database so search is instant
    async function loadVaultDB() {
        try {
            const response = await fetch('assets/vault_db.json');
            movieDB = await response.json();
        } catch (error) {
            console.error("Error loading vault database:", error);
        }
    }
    loadVaultDB();

    // Helper to add a movie to the visual grid
    function addMovieToVault(movie) {
        // Create new poster DOM element
        const newCard = document.createElement('div');
        newCard.className = 'poster-card-vault masterpiece';
        newCard.style.animation = 'scaleIn 0.5s ease-out';
        
        newCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="vault-data-overlay">
                <div class="vault-rating">
                    <span class="imdb-score"><i class="fa-solid fa-star"></i> TBD</span>
                </div>
                <p class="curio-rating">"Newly chronicled entry."</p>
                <label class="favorite-toggle">
                    <input type="checkbox">
                    <span class="slider"></span>
                    <span class="fav-text">Favorite</span>
                </label>
            </div>
        `;
        
        // Insert right after the '+' chronicle button
        const addButton = vaultGrid.querySelector('.vault-add-new');
        vaultGrid.insertBefore(newCard, addButton.nextSibling);

        // Re-bind hover interactions
        newCard.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        newCard.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        
        // Reset search state
        vaultSearchInput.value = '';
        vaultSuggestions.classList.remove('active');
        vaultSuggestions.innerHTML = '';
    }

    // Handle typing for live suggestions
    vaultSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            vaultSuggestions.classList.remove('active');
            vaultSuggestions.innerHTML = '';
            return;
        }

        // Filter DB
        const matches = movieDB.filter(m => m.title.toLowerCase().includes(query));

        if (matches.length > 0) {
            vaultSuggestions.innerHTML = matches.map(m => `
                <div class="suggestion-item" data-title="${m.title}">
                    <img src="${m.poster}" alt="${m.title}">
                    <span>${m.title} (${m.year})</span>
                </div>
            `).join('');
            vaultSuggestions.classList.add('active');
            
            // Add click listeners to new suggestions
            const items = vaultSuggestions.querySelectorAll('.suggestion-item');
            items.forEach(item => {
                item.addEventListener('click', () => {
                    const title = item.getAttribute('data-title');
                    const movie = movieDB.find(m => m.title === title);
                    if(movie) addMovieToVault(movie);
                });
            });
        } else {
            vaultSuggestions.innerHTML = `<div class="suggestion-item"><span>No matching films found...</span></div>`;
            vaultSuggestions.classList.add('active');
        }
    });

    // Handle Enter key for the first match or exact match
    vaultSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = vaultSearchInput.value.toLowerCase().trim();
            if(!query) return;

            const foundMovie = movieDB.find(m => m.title.toLowerCase().includes(query));
            if (foundMovie) {
                addMovieToVault(foundMovie);
            } else {
                vaultSearchInput.value = 'Not found in archive...';
                vaultSuggestions.classList.remove('active');
                setTimeout(() => vaultSearchInput.value = query, 2000); // Revert after showing error briefly
            }
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!vaultSearchInput.contains(e.target) && !vaultSuggestions.contains(e.target)) {
            vaultSuggestions.classList.remove('active');
        }
    });
}
