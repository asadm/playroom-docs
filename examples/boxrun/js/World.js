/**
 *
 * THE WORLD
 *
 * The world in which Boxy Run takes place.
 *
 */
/**
	* A class of which the world is an instance. Initializes the game
	* and contains the main game loop.
	*
	*/

const { onPlayerJoin, isHost, myPlayer } = Playroom;

function World() {

	// Explicit binding of this even in changing contexts.
	var self = this;

	// Scoped variables in this world.
	var element, scene, camera, character, renderer, light, objects, paused, keysAllowed, score, difficulty, treePresenceProb, maxTreeSize, fogDistance, gameOver, players = [];

	// Initialize the world.
	init();

	/**
		* Builds the renderer, scene, lights, camera, and the character,
		* then begins the rendering loop.
		*/
	function init() {

		// Locate where the world is to be located on the screen.
		element = document.getElementById('world');

		// Initialize the renderer.
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(element.clientWidth, element.clientHeight);
		renderer.shadowMap.enabled = true;
		element.appendChild(renderer.domElement);

		// Initialize the scene.
		scene = new THREE.Scene();
		fogDistance = 40000;
		scene.fog = new THREE.Fog(0xbadbe4, 1, fogDistance);

		// Initialize the camera with field of view, aspect ratio,
		// near plane, and far plane.
		camera = new THREE.PerspectiveCamera(
			60, element.clientWidth / element.clientHeight, 1, 120000);
		camera.position.set(0, 1500, -1200);
		camera.lookAt(new THREE.Vector3(0, 600, -5000));
		window.camera = camera;

		// Set up resizing capabilities.
		window.addEventListener('resize', handleWindowResize, false);

		// Initialize the lights.
		light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
		scene.add(light);

		// Initialize the character and add it to the scene.
		onPlayerJoin((state)=>{
			const model = new Character(state.getProfile().color.hex);
			scene.add(model.element);
			players.push({ model, state });
		})
		// character = new Character();
		// scene.add(character.element);

		var ground = createBox(3000, 20, 120000, Colors.sand, 0, -400, -60000);
		scene.add(ground);

		objects = [];
		treePresenceProb = 0.2;
		maxTreeSize = 0.5;
		for (var i = 10; i < 40; i++) {
			createRowOfTrees(i * -3000, treePresenceProb, 0.5, maxTreeSize);
		}

		// The game is paused to begin with and the game is not over.
		gameOver = false;
		paused = true;

		// Start receiving feedback from the player.
		var left = 37;
		var up = 38;
		var right = 39;
		var p = 80;

		keysAllowed = {};
		document.addEventListener(
			'keydown',
			function (e) {
				if (!gameOver) {
					var key = e.keyCode;
					if (keysAllowed[key] === false) return;
					keysAllowed[key] = false;
					if (paused && !collisionsDetected() && key > 18) {
						paused = false;
						players.forEach(({ model })=>model.onUnpause());
						document.getElementById(
							"variable-content").style.visibility = "hidden";
						document.getElementById(
							"controls").style.display = "none";
					} else {
						if (key == p) {
							paused = true;
							players.forEach(({ model })=>model.onPause());
							document.getElementById(
								"variable-content").style.visibility = "visible";
							document.getElementById(
								"variable-content").innerHTML =
								"Game is paused. Press any key to resume.";
						}
						if (key == up && !paused) {
							getMyModel().onUpKeyPressed();
							// character.onUpKeyPressed();
						}
						if (key == left && !paused) {
							getMyModel().onLeftKeyPressed();
							// character.onLeftKeyPressed();
						}
						if (key == right && !paused) {
							getMyModel().onRightKeyPressed();
							// character.onRightKeyPressed();
						}
					}
				}
			}
		);
		document.addEventListener(
			'keyup',
			function (e) {
				keysAllowed[e.keyCode] = true;
			}
		);
		document.addEventListener(
			'focus',
			function (e) {
				keysAllowed = {};
			}
		);

		// Initialize the scores and difficulty.
		score = 0;
		difficulty = 0;
		document.getElementById("score").innerHTML = score;

		// Begin the rendering loop.
		loop();

	}

	/**
		* The main animation loop.
		*/
	function loop() {

		// Update the game.
		if (!paused) {

			// Add more trees and increase the difficulty.
			if ((objects[objects.length - 1].mesh.position.z) % 3000 == 0) {
				difficulty += 1;
				var levelLength = 30;
				if (difficulty % levelLength == 0) {
					var level = difficulty / levelLength;
					switch (level) {
						case 1:
							treePresenceProb = 0.35;
							maxTreeSize = 0.5;
							break;
						case 2:
							treePresenceProb = 0.35;
							maxTreeSize = 0.85;
							break;
						case 3:
							treePresenceProb = 0.5;
							maxTreeSize = 0.85;
							break;
						case 4:
							treePresenceProb = 0.5;
							maxTreeSize = 1.1;
							break;
						case 5:
							treePresenceProb = 0.5;
							maxTreeSize = 1.1;
							break;
						case 6:
							treePresenceProb = 0.55;
							maxTreeSize = 1.1;
							break;
						default:
							treePresenceProb = 0.55;
							maxTreeSize = 1.25;
					}
				}
				if ((difficulty >= 5 * levelLength && difficulty < 6 * levelLength)) {
					fogDistance -= (25000 / levelLength);
				} else if (difficulty >= 8 * levelLength && difficulty < 9 * levelLength) {
					fogDistance -= (5000 / levelLength);
				}
				createRowOfTrees(-120000, treePresenceProb, 0.5, maxTreeSize);
				scene.fog.far = fogDistance;
			}

			// Move the trees closer to the character.
			objects.forEach(function (object) {
				object.mesh.position.z += 100;
			});

			// Remove trees that are outside of the world.
			objects = objects.filter(function (object) {
				return object.mesh.position.z < 0;
			});

			// Make the character move according to the controls.
			players.forEach(({ model })=>model.update());
			// character.update();

			// Check for collisions between the character and objects.
			if (collisionsDetected()) {
				gameOver = true;
				paused = true;
				document.addEventListener(
					'keydown',
					function (e) {
						if (e.keyCode == 40)
							document.location.reload(true);
					}
				);
				var variableContent = document.getElementById("variable-content");
				variableContent.style.visibility = "visible";
				variableContent.innerHTML =
					"Game over! Press the down arrow to try again.";
				var table = document.getElementById("ranks");
				var rankNames = ["Typical Engineer", "Couch Potato", "Weekend Jogger", "Daily Runner",
					"Local Prospect", "Regional Star", "National Champ", "Second Mo Farah"];
				var rankIndex = Math.floor(score / 15000);

				// If applicable, display the next achievable rank.
				if (score < 124000) {
					var nextRankRow = table.insertRow(0);
					nextRankRow.insertCell(0).innerHTML = (rankIndex <= 5)
						? "".concat((rankIndex + 1) * 15, "k-", (rankIndex + 2) * 15, "k")
						: (rankIndex == 6)
							? "105k-124k"
							: "124k+";
					nextRankRow.insertCell(1).innerHTML = "*Score within this range to earn the next rank*";
				}

				// Display the achieved rank.
				var achievedRankRow = table.insertRow(0);
				achievedRankRow.insertCell(0).innerHTML = (rankIndex <= 6)
					? "".concat(rankIndex * 15, "k-", (rankIndex + 1) * 15, "k").bold()
					: (score < 124000)
						? "105k-124k".bold()
						: "124k+".bold();
				achievedRankRow.insertCell(1).innerHTML = (rankIndex <= 6)
					? "Congrats! You're a ".concat(rankNames[rankIndex], "!").bold()
					: (score < 124000)
						? "Congrats! You're a ".concat(rankNames[7], "!").bold()
						: "Congrats! You exceeded the creator's high score of 123790 and beat the game!".bold();

				// Display all ranks lower than the achieved rank.
				if (score >= 120000) {
					rankIndex = 7;
				}
				for (var i = 0; i < rankIndex; i++) {
					var row = table.insertRow(i);
					row.insertCell(0).innerHTML = "".concat(i * 15, "k-", (i + 1) * 15, "k");
					row.insertCell(1).innerHTML = rankNames[i];
				}
				if (score > 124000) {
					var row = table.insertRow(7);
					row.insertCell(0).innerHTML = "105k-124k";
					row.insertCell(1).innerHTML = rankNames[7];
				}

			}

			// Update the scores.
			score += 10;
			document.getElementById("score").innerHTML = score;

		}

		// Render the page and repeat.
		renderer.render(scene, camera);
		requestAnimationFrame(loop);
	}

	function getMyModel(){
		const myId = myPlayer().id;
		return players.find(player => player.state.id === myId).model;
	}

	/**
		* A method called when window is resized.
		*/
	function handleWindowResize() {
		renderer.setSize(element.clientWidth, element.clientHeight);
		camera.aspect = element.clientWidth / element.clientHeight;
		camera.updateProjectionMatrix();
	}

	/**
	 * Creates and returns a row of trees according to the specifications.
	 *
	 * @param {number} POSITION The z-position of the row of trees.
	 * @param {number} PROBABILITY The probability that a given lane in the row
	 *                             has a tree.
	 * @param {number} MINSCALE The minimum size of the trees. The trees have a
	 *							uniformly distributed size from minScale to maxScale.
	 * @param {number} MAXSCALE The maximum size of the trees.
	 *
	 */
	function createRowOfTrees(position, probability, minScale, maxScale) {
		for (var lane = -1; lane < 2; lane++) {
			var randomNumber = Math.random();
			if (randomNumber < probability) {
				var scale = minScale + (maxScale - minScale) * Math.random();
				var tree = new Tree(lane * 800, -400, position, scale);
				objects.push(tree);
				scene.add(tree.mesh);
			}
		}
	}

	/**
	 * Returns true if and only if the character is currently colliding with
	 * an object on the map.
	 */
	function collisionsDetected() {
		return false;
		var charMinX = character.element.position.x - 115;
		var charMaxX = character.element.position.x + 115;
		var charMinY = character.element.position.y - 310;
		var charMaxY = character.element.position.y + 320;
		var charMinZ = character.element.position.z - 40;
		var charMaxZ = character.element.position.z + 40;
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].collides(charMinX, charMaxX, charMinY,
				charMaxY, charMinZ, charMaxZ)) {
				return true;
			}
		}
		return false;
	}

}
