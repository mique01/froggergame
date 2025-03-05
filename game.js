// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the ground (a flat plane)
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Gray color
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to lie flat
scene.add(ground);

// Create the frog (a green cube)
const frogGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const frogMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const frog = new THREE.Mesh(frogGeometry, frogMaterial);
frog.position.y = 0.25; // Lift off the ground
frog.position.z = -4; // Start near the bottom
scene.add(frog);

// Create a car (a red cube)
const carGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 0.25; // On the ground
car.position.z = 0; // Middle of the screen
car.position.x = -5; // Start off-screen left
scene.add(car);

// Position the camera
camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

// Add keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (frog.position.z < 4) frog.position.z += 0.5; // Move forward, limit at top
            break;
        case 'ArrowDown':
            if (frog.position.z > -4) frog.position.z -= 0.5; // Move back
            break;
        case 'ArrowLeft':
            if (frog.position.x > -4.5) frog.position.x -= 0.5; // Move left
            break;
        case 'ArrowRight':
            if (frog.position.x < 4.5) frog.position.x += 0.5; // Move right
            break;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Move the car across the screen
    car.position.x += 0.05;
    if (car.position.x > 5) car.position.x = -5; // Reset to left when off-screen

    // Simple collision detection
    const dx = frog.position.x - car.position.x;
    const dz = frog.position.z - car.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < 0.7) { // If frog and car are too close
        alert('Game Over! Hit by a car.');
        frog.position.set(0, 0.25, -4); // Reset frog position
    }

    // Check win condition
    if (frog.position.z >= 4) {
        alert('You Win! Frog crossed the street!');
        frog.position.set(0, 0.25, -4); // Reset frog
    }

    renderer.render(scene, camera);
}
animate();