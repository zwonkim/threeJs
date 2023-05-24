import * as THREE from "three";

//주제 : 배경색 변경 (renderer 또는 scene로 변경 가능, 우선순위는 scene가 더 높기 때문에 renderer와 scene에서 동시에 배경색을 설정하면 scene에서 설정한 값만 보임)
export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true,
    //배경색 투명하게
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  //배경 투명도 조절
  // renderer.setClearAlpha(0.5);
  //배경색 변경
  // renderer.setClearColor(0x00ff00);
  renderer.setClearColor("#00ff00");
  //scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("blue");
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

  //화면 크기에 변화가 생길 경우
  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    //변경된 값을 카메라에 적용
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);
}
