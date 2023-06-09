import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { Domino } from "./Domino";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// 주제: 도미노 만들기

// cannon.js 문서
// http://schteppe.github.io/cannon.js/docs/

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  //Loader
  const gltfLoader = new GLTFLoader();

  // Cannon(물리엔진)
  //world 물리엔진이 적용되는 공간, scene과 유사
  const cannonWorld = new CANNON.World();
  //중력 적용
  cannonWorld.gravity.set(0, -10, 0);

  //성능을 위한 세팅
  // cannonWorld.allowSleep = true; //body가 엄청 느려지면 테스트를 안함
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
  //SAPBroadphase가 가장 효율적, broadphase의 기본값은 NaiveBroadphase

  //Contact Material
  const defaultMaterial = new CANNON.Material("default");

  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.01, //마찰력
      restitution: 0.9, //반발력(얼마나 튕길지)
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  //threejs의 geometry와 같은 개념
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    //무게
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  cannonWorld.addBody(floorBody);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  //도미노 생성
  const dominos = [];
  let domino;
  for (let i = -3; i < 17; i++) {
    domino = new Domino({
      index: i,
      scene: scene,
      cannonWorld: cannonWorld,
      z: -i * 0.8,
      gltfLoader: gltfLoader,
    });
    dominos.push(domino);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    dominos.forEach((item) => {
      if (item.cannonBody) {
        item.modelMesh.position.copy(item.cannonBody.position);
        item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
      }
    });

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  //Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function checkIntersects() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects[0].object.name);

    if (intersects[0].object.cannonBody) {
      intersects[0].object.cannonBody.applyForce(
        new CANNON.Vec3(0, 0, -100),
        new CANNON.Vec3(0, 0, 0)
      );
    }
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (event) => {
    if (preventDragClick.mouseMoved) return;
    mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY / canvas.clientHeight) * 2 - 1);

    checkIntersects();
  });
  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
