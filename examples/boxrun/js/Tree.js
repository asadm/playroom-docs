/**
	* A collidable tree in the game positioned at X, Y, Z in the scene and with
	* scale S.
	*/
class Tree {
	constructor(x, y, z, s) {

		// Explicit binding.
		var self = this;

		// The object portrayed in the scene.
		this.mesh = new THREE.Object3D();
		var top = createCylinder(1, 300, 300, 4, Colors.green, 0, 1000, 0);
		var mid = createCylinder(1, 400, 400, 4, Colors.green, 0, 800, 0);
		var bottom = createCylinder(1, 500, 500, 4, Colors.green, 0, 500, 0);
		var trunk = createCylinder(100, 100, 250, 32, Colors.brownDark, 0, 125, 0);
		this.mesh.add(top);
		this.mesh.add(mid);
		this.mesh.add(bottom);
		this.mesh.add(trunk);
		this.mesh.position.set(x, y, z);
		this.mesh.scale.set(s, s, s);
		this.scale = s;

		/**
		 * A method that detects whether this tree is colliding with the character,
		 * which is modelled as a box bounded by the given coordinate space.
		 */
		this.collides = function (minX, maxX, minY, maxY, minZ, maxZ) {
			var treeMinX = self.mesh.position.x - this.scale * 250;
			var treeMaxX = self.mesh.position.x + this.scale * 250;
			var treeMinY = self.mesh.position.y;
			var treeMaxY = self.mesh.position.y + this.scale * 1150;
			var treeMinZ = self.mesh.position.z - this.scale * 250;
			var treeMaxZ = self.mesh.position.z + this.scale * 250;
			return treeMinX <= maxX && treeMaxX >= minX
				&& treeMinY <= maxY && treeMaxY >= minY
				&& treeMinZ <= maxZ && treeMaxZ >= minZ;
		};

	}
}
