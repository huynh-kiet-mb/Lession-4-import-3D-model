import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const dogUrl = new URL("./assets/doggo2.glb", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000);
const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update()
// Lưới ở landing
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Thực hiện load 3D model
const assetsLoader = new GLTFLoader();
let mixer;
assetsLoader.load(dogUrl.href, (gltf) => {
  const model = gltf.scene;
  // scene ở đây là scene của threeJS
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;
  // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
  // const action = mixer.clipAction(clip);
  // action.play();

  // Thực hiện loading 1 loạt animation của model và chạy đồng thời.
  clips.forEach((clip)=> {
    const action = mixer.clipAction(clip);
    action.play();
  });

}, undefined, (error) => {
  console.error(error);
});

const clock = new THREE.Clock();
const animate = () => {
  // Chúng ta thêm đk kiểm tra mixer khi mixer có dữ liệu từ action 3D thì
  // mới thực hiện update action 3D theo model
  if(mixer){
    // Phương thức clock.getDelta dùng để lấy dữ liệu time action trong model
    // và đưa vào model trong threeJS đúng y chang như z
    mixer.update(clock.getDelta());
  }

  renderer.render(scene,camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth  / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const color2 = new THREE.Color( '#ADC3C7' );

scene.background = color2;
