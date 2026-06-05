const startBtn = document.getElementById('startBtn');
const overlay = document.getElementById('overlay');
const bgMusic = document.getElementById('bgMusic');

// বাটনে ক্লিক করলে গান এবং ৩ডি সিন চালু হবে
startBtn.addEventListener('click', () => {
    bgMusic.play().catch(e => console.log("Audio play failed:", e));
    overlay.style.display = 'none';
    init3D();
});

let scene, camera, renderer, controls;
let particles = [];

function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // মাউস বা হাত দিয়ে চারদিকে ঘুরানো এবং জুম করার কন্ট্রোল
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const texts = ["Happy birthday Sipa", "Love for you dear ✨", "❤️"];
    
    // ২০০টি ৩ডি টেক্সট অবজেক্ট তৈরি
    for (let i = 0; i < 200; i++) {
        let x = (Math.random() - 0.5) * 150;
        let y = (Math.random() - 0.5) * 150;
        let z = (Math.random() - 0.5) * 150;

        // কালার লজিক: সামনে গোলাপি (Pink), পিছনে আকাশি (Sky Blue) ও সাদা
        let color = '#ff66b2'; 
        if (z < 0) color = '#87cefa'; 
        if (z < -40) color = '#ffffff'; 

        let text = texts[Math.floor(Math.random() * texts.length)];
        if (text === "❤️") color = '#ff0000'; // হার্ট ইমুজি সবসময় লাল থাকবে
        
        let sprite = createTextSprite(text, color);
        sprite.position.set(x, y, z);
        
        // উপর থেকে নিচে পড়ার গতি (আস্তে আস্তে পড়বে)
        sprite.userData = {
            speed: Math.random() * 0.12 + 0.04 
        };

        particles.push(sprite);
        scene.add(sprite);
    }

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

// কমিক ফন্ট দিয়ে ৩ডি টেক্সট তৈরি করার ফাংশন
function createTextSprite(text, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // এখানে কমিক ফন্ট ডিফাইন করা হয়েছে
    context.font = 'bold 34px "Comic Sans MS", "Comic Neue", cursive, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // গ্লো বা নিয়ন ইফেক্ট
    context.shadowColor = color;
    context.shadowBlur = 20;
    context.fillStyle = color;
    context.fillText(text, 256, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    sprite.scale.set(25, 6.25, 1);
    return sprite;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // টেক্সটগুলো উপর থেকে নিচে নামার লজিক
    particles.forEach(p => {
        p.position.y -= p.userData.speed;
        // নিচে স্ক্রিনের বাইরে চলে গেলে আবার উপর থেকে শুরু হবে
        if (p.position.y < -75) {
            p.position.y = 75;
            p.position.x = (Math.random() - 0.5) * 150;
        }
    });

    controls.update();
    renderer.render(scene, camera);
}