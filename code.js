import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
// import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';


const group = new THREE.Group();
var slider_roll = document.getElementById("slider_roll")
var slider_pitch = document.getElementById("slider_pitch")
var slider_yaw = document.getElementById("slider_yaw")
var value_roll = document.getElementById("value_roll")

var controls = null;


function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0xCCFFFF);
    // renderer.setSize(canvas.innerWidth, canvas.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 100;

    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    {
        // Lights
        const color = 0xFFFFFF;
        const intensity = 1.0;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    {
        // Lights
        const color = 0xFFFFFF;
        const intensity = 2;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(100, -50, 1);
        scene.add(light);

        const light2 = new THREE.DirectionalLight(color, intensity);
        light2.position.set(-100, -50, 10);
        scene.add(light2);
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
    }
    {
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
    }
    {
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
        const texture = loader.load('car_top.png');
        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const material = new THREE.MeshBasicMaterial({ map: texture, opacity: 0.5, transparent: true });
        const mesh = new THREE.Mesh(planeGeo, material);
        mesh.position.z -= 12;
        mesh.scale.set(3, 3, 1);
        scene.add(mesh);
    }

    {
        // VCU Pro - Hand Made
        const material_metal = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const material_cover = new THREE.MeshPhongMaterial({ color: 0x0022AA });
        const material_black = new THREE.MeshPhongMaterial({ color: 0x111111 });
        const material_gold = new THREE.MeshPhongMaterial({ color: 0xddbb00 });

        var bottomGeo = new THREE.BoxGeometry(12, 20, 0.4);
        var coverGeo = new THREE.BoxGeometry(12, 17, 4);
        var connectorGeo = new THREE.BoxGeometry(4, 5, 3);
        var antennaGeo = new THREE.BoxGeometry(0.5, 5, 3);
        var blindGeo = new THREE.BoxGeometry(0.5, 5, 3);
        var ventGeo = new THREE.CylinderGeometry(1, 1, 0.5, 16);
        var smaGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16);

        var bottom = new THREE.Mesh(bottomGeo, material_metal);
        bottom.position.set(0, 0, -2);
        group.add(bottom);

        var cover = new THREE.Mesh(coverGeo, material_cover);
        group.add(cover);

        var connector = new THREE.Mesh(connectorGeo, material_black);
        connector.position.set(-6 - 1, -5, 0);
        group.add(connector);

        var antenna = new THREE.Mesh(antennaGeo, material_black);
        antenna.position.set(-6, 5, 0);
        group.add(antenna);

        var sma1 = new THREE.Mesh(smaGeo, material_gold);
        sma1.rotation.set(0, 0, Math.PI / 2)
        sma1.position.set(-6, 6.5, -.8);
        group.add(sma1);

        var sma2 = new THREE.Mesh(smaGeo, material_gold);
        sma2.rotation.set(0, 0, Math.PI / 2)
        sma2.position.set(-6, 5, -.8);
        group.add(sma2);

        var sma3 = new THREE.Mesh(smaGeo, material_gold);
        sma3.rotation.set(0, 0, Math.PI / 2)
        sma3.position.set(-6, 3.5, -.8);
        group.add(sma3);

        var sma4 = new THREE.Mesh(smaGeo, material_gold);
        sma4.rotation.set(0, 0, Math.PI / 2)
        sma4.position.set(-6, 5.75, .8);
        group.add(sma4);

        var sma5 = new THREE.Mesh(smaGeo, material_gold);
        sma5.rotation.set(0, 0, Math.PI / 2)
        sma5.position.set(-6, 4.25, .8);
        group.add(sma5);


        var blind1 = new THREE.Mesh(blindGeo, material_black);
        blind1.position.set(6, 5, 0);
        group.add(blind1)

        var blind2 = new THREE.Mesh(blindGeo, material_black);
        blind2.position.set(6, -5, 0);
        group.add(blind2)

        var vent = new THREE.Mesh(ventGeo, material_black);
        vent.position.set(4, -8.5, 0);
        group.add(vent);


        scene.add(group);
    }
    /*
        {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load('NG800_web_3d_b.glb', (gltf) => {
                const root = gltf.scene;
                root.scale.set(250, 250, 250);
                root.rotation.set(90/180*Math.PI,0,0);
                root.position.set(9,-3,2.01);
                // scene.add(root);
                group.add(root);
                }
            );
        }
    */
    function render() {
        // group.rotation.z += 0.01;
        renderer.render(scene, camera);
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
    group.rotation.order = "ZYX"
    group.rotation.x = -y / 180 * Math.PI;      // X: Roll (-90..+90)
    group.rotation.y = x / 180 * Math.PI;       // Y: Pitch (-180..+180)
    group.rotation.z = z / 180 * Math.PI;       // Z: Yaw (0..360)
}


console.clear();

for (var i = 1; i < 40; i++) {
    const id = `pos${i}`;
    var obj = document.getElementById(id)
    if (obj) {
        obj.addEventListener('click', setPos);
    }
}

slider_roll.oninput = function () {
    value_roll.innerHTML = this.value;
    group.rotation.y = this.value / 180 * Math.PI;
}
slider_pitch.oninput = function () {
    value_pitch.innerHTML = this.value;
    group.rotation.x = -this.value / 180 * Math.PI;
}
slider_yaw.oninput = function () {
    value_yaw.innerHTML = this.value;
    group.rotation.z = this.value / 180 * Math.PI;
}

document.getElementById("view_reset").onclick = function () {
    controls.reset();
}

main();
