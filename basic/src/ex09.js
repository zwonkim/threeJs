import * as THREE from "three";
import gsap from "gsap";

//주제 : 라이브러리를 이용한 애니메이션
export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  //scene
  const scene = new THREE.Scene();
  //안개색, near, far
  //배경색과 안개색을 같게 할 경우 원근감이 살아남
  scene.fog = new THREE.Fog("blue", 3, 7);

  //camera
  const camera = new THREE.PerspectiveCamera(
    75, //시야각
    window.innerWidth / window.innerHeight, //종횡비
    0.1, //near
    1000 //far
  );
  //위치 조정
  camera.position.y = 1;
  camera.position.z = 5;

  scene.add(camera);

  //light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 10;
  scene.add(light);

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
  let oldTime = Date.now();
  function draw() {
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;

    // window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  }

  //gsap
  gsap.to(mesh.position, {
    duration: 1,
    y: 2,
    z: 3,
  });

  //화면 크기에 변화가 생길 경우
  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    //변경된 값을 카메라에 적용
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);

  draw();
}
