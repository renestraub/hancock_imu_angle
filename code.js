import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';


const device = new THREE.Group();
var controls = null;
var camera = null;

var slider_roll = document.getElementById("slider_roll")
var slider_pitch = document.getElementById("slider_pitch")
var slider_yaw = document.getElementById("slider_yaw")
var value_roll = document.getElementById("value_roll")
var value_pitch = document.getElementById("value_pitch")
var value_yaw = document.getElementById("value_yaw")

var autoRotate = false;


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setClearColor(0xCCFFFF);
    renderer.setSize(window.innerWidth * .65, window.innerHeight * .65);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;
    camera.lookAt(scene.position);

    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 5;
    controls.update();

    {
        // Ambient Light
        const color = 0xffffff;
        const intensity = 0.6;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    if (1) {
        // Spot/Directional Lights
        const color = 0xFFFFFF;
        const intensity = 0.7;
        const distance = 1000;
        const height = 100;

        const light = new THREE.PointLight(color, intensity);
        light.position.set(0, -distance, height);
        scene.add(light);

        const light2 = new THREE.PointLight(color, intensity);
        light2.position.set(0, distance, height);
        scene.add(light2);

        const light3 = new THREE.PointLight(color, intensity);
        light3.position.set(-distance, 0, height);
        scene.add(light3);

        const light4 = new THREE.PointLight(color, intensity);
        light4.position.set(distance, 0, height);
        scene.add(light4);

        const light6 = new THREE.PointLight(0xffffff, intensity);
        light6.position.set(200, -300, 1750);
        scene.add(light6);
    }

    const axis_len = 50;
    const arrow_len = 2;

    {
        // X-Axis
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(axis_len, 0, 0));
        points.push(new THREE.Vector3(axis_len - arrow_len, arrow_len, 0));
        points.push(new THREE.Vector3(axis_len - arrow_len, -arrow_len, 0));
        points.push(new THREE.Vector3(axis_len, 0, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    } {
        // Y-Axis
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, axis_len, 0));
        points.push(new THREE.Vector3(0, axis_len - arrow_len, -arrow_len));
        points.push(new THREE.Vector3(0, axis_len - arrow_len, arrow_len));
        points.push(new THREE.Vector3(0, axis_len, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    } {
        // Z-Axis
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(0, 0, axis_len));
        points.push(new THREE.Vector3(-arrow_len, 0, axis_len - arrow_len));
        points.push(new THREE.Vector3(arrow_len, 0, axis_len - arrow_len));
        points.push(new THREE.Vector3(0, 0, axis_len));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    {
        // Car Image as xy-plane
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('car2_top.png');
        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const material = new THREE.MeshBasicMaterial({ map: texture, opacity: 0.5, transparent: true });
        const mesh = new THREE.Mesh(planeGeo, material);
        mesh.material.side = THREE.DoubleSide;
        mesh.position.z -= 12;
        mesh.scale.set(3, 3, 1);
        scene.add(mesh);
    }

    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('NG800_cardbox_gray_v1.glb', (gltf) => {
            const scale = 250;
            const obj = gltf.scene;
            obj.scale.set(scale, scale, scale);
            obj.rotation.set(90 / 180 * Math.PI, -Math.PI / 2, 0);
            obj.position.set(-2.5 * scale / 100, 5.6 * scale / 100, 0);

            // Remove metal surface so that ambient light can work
            obj.traverse(child => {
                if (child.material) child.material.metalness = 0;
            });

            device.add(obj);

            scene.add(device);
        });
    }

    function render() {
        renderer.render(scene, camera);

        if (autoRotate) {
            const rotSpeed = 0.05;
            var x = camera.position.x;
            var y = camera.position.y;

            camera.position.x = x * Math.cos(rotSpeed) + y * Math.sin(rotSpeed);
            camera.position.y = y * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
            camera.lookAt(scene.position);
        }
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function setPos(obj) {
    var text = obj.target.innerHTML;
    var res = text.split(",");
    setObject(parseInt(res[0]), parseInt(res[1]), parseInt(res[2]));
}

function setObject(x, y, z) {
    // Update UI
    slider_roll.value = x;
    value_roll.innerHTML = x;
    slider_pitch.value = y;
    value_pitch.innerHTML = y;
    slider_yaw.value = z;
    value_yaw.innerHTML = z;

    // This is the magic in u-blox Euler transformation !!
    device.rotation.order = "ZYX"
    device.rotation.x = -y / 180 * Math.PI; // X: Roll (-90..+90)
    device.rotation.y = x / 180 * Math.PI; // Y: Pitch (-180..+180)
    device.rotation.z = z / 180 * Math.PI; // Z: Yaw (0..360)
}


console.clear();

// Register function handlers
for (var i = 1; i < 40; i++) {
    const id = `pos${i}`;
    var obj = document.getElementById(id)
    if (obj) {
        obj.addEventListener('click', setPos);
    }
}

slider_roll.oninput = function() {
    value_roll.innerHTML = this.value;
    device.rotation.y = this.value / 180 * Math.PI;
}

slider_pitch.oninput = function() {
    value_pitch.innerHTML = this.value;
    device.rotation.x = -this.value / 180 * Math.PI;
}

slider_yaw.oninput = function() {
    value_yaw.innerHTML = this.value;
    device.rotation.z = this.value / 180 * Math.PI;
}

document.getElementById("view_reset").onclick = function() {
    controls.reset();
}

document.getElementById("rotate_switch").onclick = function() {
    console.log("test");
    if (autoRotate) {
        autoRotate = false;
        this.innerHTML = 'Start Autorotate'
    } else {
        autoRotate = true;
        camera.position.x = 20;
        camera.position.y = 0;
        this.innerHTML = 'Stop Autorotate'
    }
}

main();