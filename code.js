// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
// import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/loaders/GLTFLoader.js';

// npm install three
//   module are under node_modules/three/examples
import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from './node_modules/three/examples/jsm/controls/TransformControls.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { SimplifyModifier } from './node_modules/three/examples/jsm/modifiers/SimplifyModifier.js';

const hancock_neom8 = "NG800_cardbox_gray_v1.glb";
const hancock_neom9 = "Hancock_Enclosure_V2.glb";
const nitroc_zed = "NB3900_ID_envelope_v16_reduced2.glb";

const scene = new THREE.Scene();
const device = new THREE.Group();   // router cad model with arrows, dedicated group, we can apply transformations to
const gltfLoader = new GLTFLoader();

var box_cad_model = null;
var orbit = null;
var camera = null;
var control = null;

var slider_roll = document.getElementById("slider_roll");
var slider_pitch = document.getElementById("slider_pitch");
var slider_yaw = document.getElementById("slider_yaw");
var value_roll = document.getElementById("value_roll");
var value_pitch = document.getElementById("value_pitch");
var value_yaw = document.getElementById("value_yaw");

var autoRotate = false;
var scene_rot = 180; // Make car look to the left (x-axis)

var current_model = "";


function main() {
    // get size of container holding canvas
    const container = document.querySelector('#container');
    const width = container.clientWidth;
    const height = width * 2 / 3;

    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    scene.background = new THREE.Color(0xf8f8f8);
    scene.rotation.set(0, 0, deg2rad(scene_rot));

    camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 3000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 150;
    camera.lookAt(scene.position);

    orbit = new OrbitControls(camera, canvas);
    orbit.target.set(0, 0, 0);
    orbit.update();
    orbit.enabled = true;

    control = new TransformControls(camera, renderer.domElement);
    control.addEventListener('change', render);
    control.addEventListener('dragging-changed', function (event) {
    //     orbit.enabled = !event.value;
        console.log("dragging");
    } );
    control.setRotationSnap(THREE.MathUtils.degToRad(30));
    control.setMode('rotate');
    control.showX = true;
    control.showY = false;
    control.showZ = false;
    control.enabled = false;
    control.scale.set(2, 2, 2);
    control.rotation.set(deg2rad(90), deg2rad(-180), deg2rad(0));

    lights(scene);
    axes(scene);
    car_image(scene);
    add_device_axes(scene)
    exchange_cad_model("VCU Pro - NEO-M8")

    // control.attach(device);
    // scene.add(control);

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

function lights(scene) {
    {
        // Ambient Light
        const color = 0xffffff;
        const intensity = 0.25;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    {
        // Spot/Directional Lights
        const color = 0xFFFFFF;
        const intensity = 0.15;
        const distance = 1000;
        const height = 1000;

        const light1 = new THREE.PointLight(color, intensity, 0, 2);
        light1.position.set(0, -distance, height);
        scene.add(light1);

        const light2 = new THREE.PointLight(color, intensity, 0, 2);
        light2.position.set(0, distance, height);
        scene.add(light2);

        const light3 = new THREE.PointLight(color, intensity, 0, 2);
        light3.position.set(-distance, 0, height);
        scene.add(light3);

        const light4 = new THREE.PointLight(color, intensity, 0, 2);
        light4.position.set(distance, 0, height);
        scene.add(light4);

        const light5 = new THREE.PointLight(color, intensity, 0, 2);
        light5.position.set(200, -300, height);
        scene.add(light5);
    }
}

function car_image(scene) {
    // Car Image as xy-plane
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('car2_top.png');
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const material = new THREE.MeshBasicMaterial({ map: texture, opacity: 0.25, transparent: true });
    const mesh = new THREE.Mesh(planeGeo, material);
    mesh.material.side = THREE.DoubleSide;
    mesh.position.z -= 12;
    mesh.scale.set(3, 3, 1);
    mesh.rotation.set(0, 0, deg2rad(-90));
    scene.add(mesh);
}

function add_device_axes(scene) {
    // Axis of device: x points to left, y downwards
    const arrow_x = arrow(0xaa0000, 15);
    arrow_x.rotation.set(0, 0, deg2rad(-90));
    arrow_x.position.z = 10;
    device.add(arrow_x);

    const arrow_y = arrow(0x00aa00, 10);
    arrow_y.rotation.set(0, 0, deg2rad(0));
    arrow_y.position.z = 10;
    device.add(arrow_y);

    const arrow_z = arrow(0x0000aa, 10);
    arrow_z.rotation.set(deg2rad(90), 0, 0, 0);
    arrow_z.position.z = 10;
    device.add(arrow_z);

    scene.add(device);
}

function add_hancock_neom8() {
    // NG800 / VCU Pro with NEO-M8
    gltfLoader.load(hancock_neom8, (gltf) => {
        const scale = 250;
        const obj = gltf.scene;

        obj.scale.set(scale, scale, scale);
        obj.position.set(5.6 * scale / 100, 3.2 * scale / 100, 0);
        obj.rotation.set(deg2rad(90), deg2rad(-180), deg2rad(0));

        // Remove metal surface so that ambient light can work
        obj.traverse(child => {
            if (child.material) child.material.metalness = 0;
        });

        device.add(obj);
        box_cad_model = obj
    });
}

function add_hancock_neom9() {
    // NG800 / VCU Pro with NEO-M9
    gltfLoader.load(hancock_neom9, (gltf) => {
        const scale = 250;
        const obj = gltf.scene;

        obj.scale.set(scale, scale, scale);
        // obj.position.set(0 * scale / 100, 0 * scale / 100, 0);
        obj.rotation.set(deg2rad(90), deg2rad(0), deg2rad(0));

        // Remove metal surface so that ambient light can work
        obj.traverse(child => {
            if (child.material) child.material.metalness = 0;
        });

        device.add(obj);
        box_cad_model = obj
    });
}

function add_nitroc_zed() {
    // NITROC
    gltfLoader.load(nitroc_zed, (gltf) => {
        const scale = 150;
        const obj = gltf.scene;

        obj.scale.set(scale, scale, scale);
        // obj.position.set(0 * scale / 100, 0 * scale / 100, 0);
        obj.rotation.set(deg2rad(90), deg2rad(0), deg2rad(0));

        // Remove metal surface so that ambient light can work
        obj.traverse(child => {
            if (child.material) child.material.metalness = 0;
        });

        device.add(obj);
        box_cad_model = obj
    });
}

function exchange_cad_model(model_name) {
    if (model_name != current_model) {
        console.log("Loading model for " + model_name);

        // Remove existing box from scene
        device.remove(box_cad_model)
        box_cad_model = null

        // Load desired device model
        switch (model_name) {
            case "VCU Pro - NEO-M8":
                add_hancock_neom8();
                break;
            case "VCU Pro - NEO-M9":
                add_hancock_neom9();
                break;
            case "NITROC - ZED":
                add_nitroc_zed();
                break;
            default:
                add_hancock_neom8();
                break;
        }

        current_model = model_name;
    }
}

function axes(scene) {
    // View Axes
    const arrow_x = arrow(0xee0000, 65);
    arrow_x.rotation.set(0, 0, deg2rad(-90));
    scene.add(arrow_x);

    const arrow_y = arrow(0x00ee00, 40);
    arrow_y.rotation.set(0, 0, deg2rad(0));
    scene.add(arrow_y);

    const arrow_z = arrow(0x0000ee, 30);
    arrow_z.rotation.set(deg2rad(90), 0, 0);
    scene.add(arrow_z);
}

function arrow(color, axis_len) {
    // Create an axis arrow in the specified color
    const arrow_len = 3;
    const axis_dia = 0.2;

    const arrow = new THREE.Group();
    const material = new THREE.MeshBasicMaterial({ color: color });

    const geometryLine = new THREE.CylinderGeometry(axis_dia, axis_dia, axis_len, 32);
    const meshLine = new THREE.Mesh(geometryLine, material);
    meshLine.position.y = axis_len / 2;
    arrow.add(meshLine);

    const geometryArrow = new THREE.CylinderGeometry(0.25, 5 * axis_dia, arrow_len, 32);
    const meshArrow = new THREE.Mesh(geometryArrow, material);
    meshArrow.position.y = axis_len;
    arrow.add(meshArrow);

    return arrow;
}

function deg2rad(angle) {
    return angle * Math.PI / 180.0;
}

function setPos(obj) {
    var text = obj.target.innerHTML;
    var res = text.split(",");
    setObject("xyz", parseInt(res[2]), parseInt(res[1]), parseInt(res[0]));
}

function setObject(mode, roll, pitch, yaw) {
    // This is the magic in u-blox Euler transformation !!
    device.rotation.order = "ZYX";

    // Update UI
    if (mode == "xyz" || mode == "x") {
        slider_roll.value = roll;
        value_roll.innerHTML = roll;
        device.rotation.x = deg2rad(roll); // X: Roll (-180..+180)
    }

    if (mode == "xyz" || mode == "y") {
        slider_pitch.value = pitch;
        value_pitch.innerHTML = pitch;
        device.rotation.y = deg2rad(pitch); // Y: Pitch (-90..+90)
    }

    if (mode == "xyz" || mode == "z") {
        slider_yaw.value = yaw;
        value_yaw.innerHTML = yaw;
        device.rotation.z = deg2rad(yaw); // Z: Yaw (0..360)
    }
}


console.clear();

// Register function handlers to preset buttons
for (var i = 1; i < 99; i++) {
    const id = `pos${i}`;
    var obj = document.getElementById(id)
    if (obj) {
        obj.addEventListener('click', setPos);
    }
}

// Register function handlers for sliders
slider_roll.oninput = function() {
    setObject("x", this.value, device.rotation.y, device.rotation.z);
}

slider_pitch.oninput = function() {
    setObject("y", device.rotation.x, this.value, device.rotation.z);
}

slider_yaw.oninput = function() {
    setObject("z", device.rotation.x, device.rotation.y, this.value);
}

// Function handlers for view operations
document.getElementById("view_reset").onclick = function() {
    orbit.reset();
}

document.getElementById("view_rotate").onclick = function() {
    scene_rot -= 45;
    scene.rotation.set(0, 0, deg2rad(scene_rot));
}

document.getElementById("rotate_switch").onclick = function() {
    if (autoRotate) {
        autoRotate = false;
        this.innerHTML = 'Start Animation'
    } else {
        autoRotate = true;
        camera.position.x = 20;
        camera.position.y = 0;
        this.innerHTML = 'Stop Animation'
    }
}

document.getElementById("model").selectedIndex = 0;
document.getElementById("model").onchange = function() {
    const selection = this.options[this.selectedIndex].text
    exchange_cad_model(selection)
}

window.addEventListener('keydown', function(event) {
    // console.log('key event');
    // console.log((event.code));
    switch (event.code) {
        case 'KeyX':
            console.log('toggling mode');
            control.enabled = !control.enabled;
            orbit.enabled = !control.enabled;
            break;
    }
} );

main();
