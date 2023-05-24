import * as THREE from "three";

//주제 : 브라우저 창 사이즈 변경 대응, 고해상도
export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  //해당 기기의 픽셀 비율
  console.log(window.devicePixelRatio); //6 (100px의 이미지를 표현할 때 실제로는 600px을 씀)
  //고해상도로 표현하기 위해
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
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
