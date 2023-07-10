import * as THREE from 'three';
import * as CANNON from 'cannon';

// adapted from https://schteppe.github.io/cannon.js/build/cannon.demo.js
export default function shape2mesh(body, material) {
  var obj = new THREE.Object3D();

  for (var l = 0; l < body.shapes.length; l++) {
    var shape = body.shapes[l];

    var mesh;

    switch (shape.type) {

      case CANNON.Shape.types.SPHERE:
        var sphere_geometry = new THREE.SphereGeometry(shape.radius);
        mesh = new THREE.Mesh(sphere_geometry, material);
        break;

      case CANNON.Shape.types.PLANE:
        var geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
        mesh = new THREE.Object3D();
        var submesh = new THREE.Object3D();
        var ground = new THREE.Mesh(geometry, material);
        ground.scale.set(100, 100, 100);
        submesh.add(ground);

        ground.castShadow = true;
        ground.receiveShadow = true;

        mesh.add(submesh);
        break;

      case CANNON.Shape.types.BOX:
        var box_geometry = new THREE.BoxGeometry(shape.halfExtents.x * 2,
          shape.halfExtents.y * 2,
          shape.halfExtents.z * 2);
        mesh = new THREE.Mesh(box_geometry, material);
        break;

      default:
        throw "Visual type not recognized: " + shape.type;
    }

    mesh.receiveShadow = true;
    mesh.castShadow = true;
    if (mesh.children) {
      for (var i = 0; i < mesh.children.length; i++) {
        mesh.children[i].castShadow = true;
        mesh.children[i].receiveShadow = true;
        if (mesh.children[i]) {
          for (var j = 0; j < mesh.children[i].length; j++) {
            mesh.children[i].children[j].castShadow = true;
            mesh.children[i].children[j].receiveShadow = true;
          }
        }
      }
    }

    var o = body.shapeOffsets[l];
    var q = body.shapeOrientations[l];
    mesh.position.set(o.x, o.y, o.z);
    mesh.quaternion.set(q.x, q.y, q.z, q.w);

    obj.add(mesh);
  }

  // copy pos
  obj.position.copy(body.position);

  return obj;
};