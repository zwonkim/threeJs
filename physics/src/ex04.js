import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { AddSphere } from "./AddSphere";

// 주제: 성능 향상시키기

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

  // Cannon(물리엔진)
  //world 물리엔진이 적용되는 공간, scene과 유사
  const cannonWorld = new CANNON.World();
  //중력 적용
  cannonWorld.gravity.set(0, -10, 0);

  //성능을 위한 세팅
  cannonWorld.allowSleep = true; //body가 엄청 느려지면 테스트를 안함
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);
  //SAPBroadphase가 가장 효율적, broadphase의 기본값은 NaiveBroadphase

  //Contact Material
  const defaultMaterial = new CANNON.Material("default");

  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.5, //마찰력
      restitution: 0.3, //반발력(얼마나 튕길지)
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
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    spheres.forEach((item) => {
      item.mesh.position.copy(item.cannonBody.position);
      item.mesh.quaternion.copy(item.cannonBody.quaternion);
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

  // 이벤트
  window.addEventListener("resize", setSize);
  //클릭을 할 경우 mesh 추가
  canvas.addEventListener("click", () => {
    spheres.push(
      new AddSphere({
        scene: scene,
        cannonWorld: cannonWorld,
        geometry: sphereGeometry,
        material: sphereMaterial,
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 5 + 2,
        z: (Math.random() - 0.5) * 2,
        scale: Math.random() + 0.2,
      })
    );
    console.log(spheres);
  });
  const preventDragClick = new PreventDragClick(canvas);
  draw();
}
