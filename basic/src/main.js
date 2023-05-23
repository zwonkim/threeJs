import * as THREE from "three";

//1. 동적으로 canvas 생성
// const renderer = new THREE.WebGL1Renderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer.domElement); //canvas
// document.body.appendChild(renderer.domElement);

//2. html에서 직접 canvas 생성
const canvas = document.querySelector("#three-canvas");
//renderer의 canvas를 three-canvas로 지정
//antialias : 계단 현상(깨진 패턴을) 최소화, 성능은 좀 떨어질 수 있음
const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75, //시야각
  window.innerWidth / window.innerHeight, //종횡비
  0.1, //near
  1000 //far
);
//위치 조정
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 1;

scene.add(camera);

//mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  //color: 0xff0000,
  // color: "red",
  color: "#ff0000",
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//renderer에 그리기
renderer.render(scene, camera);
