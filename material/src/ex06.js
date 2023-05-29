import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 주제: LoadingManager texture 이미지 로드
//Download all the maps로 전체 이미지 다운로드

export default function example() {
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("로드 시작");
  };
  loadingManager.onProgress = (img) => {
    console.log(img, "로드 중");
  };
  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };
  loadingManager.onError = () => {
    console.log("에러");
  };

  const textureLoader = new THREE.TextureLoader(loadingManager);
  const colorTexture = textureLoader.load(
    "/textures/brick/Old_Graffiti_Wall_001_COLOR.jpg"
  );
  const dispTexture = textureLoader.load(
    "/textures/brick/Old_Graffiti_Wall_001_DISP.png"
  );
  const normTexture = textureLoader.load(
    "/textures/brick/Old_Graffiti_Wall_001_NORM.jpg"
  );
  const occTexture = textureLoader.load(
    "/textures/brick/Old_Graffiti_Wall_001_OCC.jpg"
  );
  const roughTexture = textureLoader.load(
    "/textures/brick/Old_Graffiti_Wall_001_ROUGH.jpg"
  );

  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

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
  directionalLight.position.set(1, 1, 2);
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  //3d object는 점(vertex), 선(edge), 면(face)으로 구성
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  //textureLoader로 이미지를 로드해도 기본적으로 material의 속성을 따름
  const material = new THREE.MeshStandardMaterial({
    // color: "red",
    map: dispTexture,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

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

  draw();
}
