import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

async function loadModel(url) {
  return new Promise((resolve, reject) => {
    // Draco
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader)

    loader.load(url, resolve, undefined, reject)
  });
}

function applyMaterial(mesh, primaryColor) {
  const materials = {
    'pureRed': new THREE.MeshBasicMaterial({ color: 0xff2800 }),
    'pureWhite': new THREE.MeshBasicMaterial({ color: 0xfffffc }),
    'pureBlack': new THREE.MeshBasicMaterial({ color: 0x160000 }),
    'pureYellow': new THREE.MeshBasicMaterial({ color: 0xffe889 }),
    'shadeWhite': new THREE.MeshLambertMaterial({ color: 0xfffffc }),
    'shadeBlack': new THREE.MeshLambertMaterial({ color: 0x160000 }),
    'shadeRed': new THREE.MeshLambertMaterial({ color: primaryColor || 0xff2800 }),
  }

  // Get material name by matching with startsWith
  let materialName = Object.keys(materials).find((_materialName) => mesh.name.startsWith(_materialName));
  if (typeof materialName === 'undefined') {
    materialName = 'pureWhite';
  }

  mesh.material = materials[materialName].clone();
  return mesh;
}

// Recenter model to marked center point and apply mesh
function processModel(obj, primaryColor) {
  const container = new THREE.Object3D()
  const center = new THREE.Vector3()
  // Go through each base child
  const baseChildren = [...obj.children]

  for (const _child of baseChildren) {
    // Find center
    if (_child.name.match(/^center_?[0-9]{0,3}?/i)) {
      center.set(_child.position.x, _child.position.y, _child.position.z)
    }

    if (_child instanceof THREE.Mesh) {
      const mesh = applyMaterial(_child, primaryColor);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      container.add(mesh);
    }

    // Apply centering
    if (center.length() > 0) {
      for (const _child of container.children) {
        _child.position.sub(center)
      }

      container.position.add(center)
    }
  }
  return container;
}

export default async function loadCar(primaryColor=0xff2800) {
  const chassisModel = await loadModel('/carmodel/chassis.glb');
  const wheelModel = await loadModel('/carmodel/wheel.glb');
  console.log("chassisModel", chassisModel)
  const chassisObject = processModel(chassisModel.scene, primaryColor);
  console.log("wheelModel", wheelModel)
  const wheelObject = processModel(wheelModel.scene);
  return { chassisObject, wheelObject };
}