const spotlight = document.getElementById('profileSpotlight');

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
