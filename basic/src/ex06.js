import * as THREE from "three";

//주제 : 애니메이션 (three.js clock + getDelta)
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

  //camera
  const camera = new THREE.PerspectiveCamera(
    75, //시야각
    window.innerWidth / window.innerHeight, //종횡비
    0.1, //near
    1000 //far
  );
  //위치 조정
  camera.position.z = 5;

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

  const clock = new THREE.Clock();
  //renderer에 그리기
  function draw() {
    //getDelta draw함수가 실행되는 시간의 간격 (단, getElapsedTime와 동시에 사용하면 안됨)
    const delta = clock.getDelta();

    mesh.rotation.y += delta;
    mesh.position.y += 0.01;
    if (mesh.position.y > 3) {
      mesh.position.y = 0;
    }
    renderer.render(scene, camera);

    // window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  }

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
