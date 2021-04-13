window.addEventListener('load', function(){
  start();
})

function start(){
  //シーン、レンダラーの初期化
  initThree();
  //カメラ初期化
  initCam();
  //オブジェクトの初期化
  initObject();
  //繰り返し処理
  loop();
}

let renderer,scene,camera;
let controls;
let triangles;

const radius = 100;
let theta = 0;


function initThree(){
  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#mainCanvas"),
    antialias: true,
    alpha: true,
  })
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene(); 
}

function initCam(){
  camera = new THREE.PerspectiveCamera(45,innerWidth / innerHeight ,1 , 1000);
  camera.position.set(0,0,10);
  
  controls = new THREE.OrbitControls(camera,renderer.domElement);
}

function initObject(){
  const n = 800;
  const n2 = 600;
  const geometry = new THREE.BufferGeometry();
  const geometry2 = new THREE.BufferGeometry();

  const positions = new Float32Array(n * 3 * 3);
  const positions2 = new Float32Array(n2 * 3 * 3);
  //三角形は3つの頂点で構成される図形。
  // また１つの頂点を定義するためには、XYZの3つの座標が必要となります。
  // 配列の長さは、「三角形の数 * 3頂点 * 3座標」の情報が必要。
  const colors = new Float32Array(n * 3 * 3);
  
  // 三角形の配置距離
  var L = 200;
  var L2 = 30;
  for (var i=0; i<positions.length; i+=9) {
    for(var j=0; j<9; j+=3) {
      //1つの頂点に必要な3つのX,Y,Z座標ごとにループを回す。
      if (j === 0 ) {
        var x = L * Math.random() - L/2;
        var y = L * Math.random() - L/2;
        var z = L * Math.random() - L/2;

        var x2 = L2 * Math.random() - L2/2;
        var y2 = L2 * Math.random() - L2/2;
        var z2 = L2 * Math.random() - L2/2;
      } else {
        var l = 15;
        var l2 = 2;
        var x = positions[i] + (l2 * (Math.random() - 0.5));
        var y = positions[i+1] + (l2 * (Math.random()  - 0.5));
        var z = positions[i+2] + (l2 * (Math.random()  - 0.5));

        var x2 = positions2[i] + (l * (Math.random() - 0.5));
        var y2= positions2[i+1] + (l * (Math.random()  - 0.5));
        var z2 = positions2[i+2] + (l * (Math.random()  - 0.5));
      }

      //情報を代入。
      positions[i+j]   = x;
      positions[i+j+1] = y;
      positions[i+j+2] = z;

      positions2[i+j]   = x2;
      positions2[i+j+1] = y2;
      positions2[i+j+2] = z2;

      //場所に応じて色が変わる。
      var R = (Math.abs(positions[i]) / (180/2));
      var G = (Math.abs(positions[i+1]) / (180/2));
      var B = (Math.abs(positions[i+2]) / (180/2));
      var color = new THREE.Color().setRGB(R,G,B);

      colors[i]     = color.r;
      colors[i+j+1] = color.g;
      colors[i+j+2] = color.b;
    }
  }

  // Set Attribute
  geometry.setAttribute( 'position', new THREE.BufferAttribute(positions, 3));
  geometry2.setAttribute( 'position', new THREE.BufferAttribute(positions2, 3));
  geometry2.setAttribute( 'color', new THREE.BufferAttribute( colors, 3));
  geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3));

  var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide,vertexColors: THREE.VertexColors,wireframe: true});
  var material2 = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide ,vertexColors: THREE.VertexColors});

  // var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide vertexColors: THREE.VertexColors,wireframe: true});
  triangles = new THREE.Mesh(geometry, material);
  triangles2 = new THREE.Mesh(geometry2, material2);

  scene.add(triangles);
  scene.add(triangles2);
}


function loop(){
  controls.update();
  theta += 0.2;
  camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
  camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
  camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );

  camera.lookAt( scene.position );
  camera.updateMatrixWorld();

  triangles.rotation.x += 0.002;
  triangles2.rotation.x -= 0.004;
  triangles.rotation.y += 0.002;
  triangles2.rotation.y -= 0.004;
  triangles2.rotation.z += 0.004;

  renderer.render(scene,camera);
  requestAnimationFrame(loop);
}