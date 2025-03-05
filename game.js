let scene, camera, renderer, frog, cars = [], score = 0, highScore = localStorage.getItem('highScore') || 0;

function init() {
    // Configuración de la escena, cámara y renderizador
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Suelo (Ground)
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Gris por ahora
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotar para que quede plano
    scene.add(ground);

    // Rana (Frog) - Placeholder como cubo verde
    const frogGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const frogMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    frog = new THREE.Mesh(frogGeometry, frogMaterial);
    frog.position.set(0, 0.25, 4); // Empieza en z=4 (parte inferior)
    scene.add(frog);

    // Coches (Cars) - Tres carriles con cubos rojos
    const laneZs = [2, 0, -2]; // Posiciones z de los carriles
    laneZs.forEach(z => {
        const carGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
        const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.set(Math.random() * 10 - 5, 0.25, z); // Posición x aleatoria
        car.velocity = (z % 2 === 0 ? 0.05 : -0.05); // Dirección alternada
        cars.push(car);
        scene.add(car);
    });

    // Iluminación (Lighting)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Posición de la cámara
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    // Eventos de entrada
    document.addEventListener('keydown', onKeyDown);
    document.getElementById('changeColor').addEventListener('click', customizeFrog);
}

function onKeyDown(event) {
    const step = 1; // Movimiento en pasos discretos de 1 unidad
    switch (event.key) {
        case 'ArrowUp':
            frog.position.z -= step; // Mover hacia arriba (disminuir z)
            break;
        case 'ArrowDown':
            if (frog.position.z < 4) frog.position.z += step; // Mover hacia abajo hasta z=4
            break;
        case 'ArrowLeft':
            if (frog.position.x > -4.5) frog.position.x -= step; // Mover a la izquierda
            break;
        case 'ArrowRight':
            if (frog.position.x < 4.5) frog.position.x += step; // Mover a la derecha
            break;
    }
    // Verificar si la rana cruzó con éxito
    if (frog.position.z <= -4) {
        score += 10; // Ganar 10 puntos
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore); // Actualizar puntuación alta
        }
        frog.position.z = 4; // Resetear posición
        updateScore();
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score} | High Score: ${highScore}`;
}

function customizeFrog() {
    if (score >= 50) {
        score -= 50; // Costo de personalización
        frog.material.color.set(0x0000ff); // Cambiar a azul
        updateScore();
    } else {
        alert('¡No tienes suficientes puntos!');
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Mover los coches
    cars.forEach(car => {
        car.position.x += car.velocity;
        if (car.velocity > 0 && car.position.x > 5) car.position.x = -5; // Reiniciar al salir por la derecha
        if (car.velocity < 0 && car.position.x < -5) car.position.x = 5; // Reiniciar al salir por la izquierda
    });

    // Detección de colisiones
    cars.forEach(car => {
        if (Math.abs(frog.position.z - car.position.z) < 0.5 && Math.abs(frog.position.x - car.position.x) < 0.75) {
            alert('¡Game Over! Chocaste con un coche.');
            frog.position.set(0, 0.25, 4); // Resetear posición
            score = 0; // Reiniciar puntuación
            updateScore();
        }
    });

    renderer.render(scene, camera);
}

// Iniciar el juego
init();
updateScore(); // Mostrar puntuación inicial
animate();
