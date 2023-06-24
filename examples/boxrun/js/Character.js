/**
 *
 * IMPORTANT OBJECTS
 *
 * The character and environmental objects in the game.
 *
 */
/**
 * The player's character in the game.
 */
class Character {
	constructor() {

		// Explicit binding of this even in changing contexts.
		var self = this;

		// Character defaults that don't change throughout the game.
		this.skinColor = Colors.brown;
		this.hairColor = Colors.black;
		this.shirtColor = Colors.yellow;
		this.shortsColor = Colors.olive;
		this.jumpDuration = 0.6;
		this.jumpHeight = 2000;

		// Initialize the character.
		init();

		/**
				* Builds the character in depth-first order. The parts of are
				* modelled by the following object hierarchy:
				*
				* - character (this.element)
				*    - head
				*       - face
				*       - hair
				*    - torso
				*    - leftArm
				*       - leftLowerArm
				*    - rightArm
				*       - rightLowerArm
				*    - leftLeg
				*       - rightLowerLeg
				*    - rightLeg
				*       - rightLowerLeg
				*
				* Also set up the starting values for evolving parameters throughout
				* the game.
				*
				*/
		function init() {

			// Build the character.
			self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
			self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
			self.head = createGroup(0, 260, -25);
			self.head.add(self.face);
			self.head.add(self.hair);

			self.torso = createBox(150, 190, 40, self.shirtColor, 0, 100, 0);

			self.leftLowerArm = createLimb(20, 120, 30, self.skinColor, 0, -170, 0);
			self.leftArm = createLimb(30, 140, 40, self.skinColor, -100, 190, -10);
			self.leftArm.add(self.leftLowerArm);

			self.rightLowerArm = createLimb(
				20, 120, 30, self.skinColor, 0, -170, 0);
			self.rightArm = createLimb(30, 140, 40, self.skinColor, 100, 190, -10);
			self.rightArm.add(self.rightLowerArm);

			self.leftLowerLeg = createLimb(40, 200, 40, self.skinColor, 0, -200, 0);
			self.leftLeg = createLimb(50, 170, 50, self.shortsColor, -50, -10, 30);
			self.leftLeg.add(self.leftLowerLeg);

			self.rightLowerLeg = createLimb(
				40, 200, 40, self.skinColor, 0, -200, 0);
			self.rightLeg = createLimb(50, 170, 50, self.shortsColor, 50, -10, 30);
			self.rightLeg.add(self.rightLowerLeg);

			self.element = createGroup(0, 0, -4000);
			self.element.add(self.head);
			self.element.add(self.torso);
			self.element.add(self.leftArm);
			self.element.add(self.rightArm);
			self.element.add(self.leftLeg);
			self.element.add(self.rightLeg);

			// Initialize the player's changing parameters.
			self.isJumping = false;
			self.isSwitchingLeft = false;
			self.isSwitchingRight = false;
			self.currentLane = 0;
			self.runningStartTime = new Date() / 1000;
			self.pauseStartTime = new Date() / 1000;
			self.stepFreq = 2;
			self.queuedActions = [];

		}

		/**
		 * Creates and returns a limb with an axis of rotation at the top.
		 *
		 * @param {number} DX The width of the limb.
		 * @param {number} DY The length of the limb.
		 * @param {number} DZ The depth of the limb.
		 * @param {color} COLOR The color of the limb.
		 * @param {number} X The x-coordinate of the rotation center.
		 * @param {number} Y The y-coordinate of the rotation center.
		 * @param {number} Z The z-coordinate of the rotation center.
		 * @return {THREE.GROUP} A group that includes a box representing
		 *                       the limb, with the specified properties.
		 *
		 */
		function createLimb(dx, dy, dz, color, x, y, z) {
			var limb = createGroup(x, y, z);
			var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
			var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
			limb.add(limbBox);
			return limb;
		}

		/**
		 * A method called on the character when time moves forward.
		 */
		this.update = function () {

			// Obtain the curren time for future calculations.
			var currentTime = new Date() / 1000;

			// Apply actions to the character if none are currently being
			// carried out.
			if (!self.isJumping &&
				!self.isSwitchingLeft &&
				!self.isSwitchingRight &&
				self.queuedActions.length > 0) {
				switch (self.queuedActions.shift()) {
					case "up":
						self.isJumping = true;
						self.jumpStartTime = new Date() / 1000;
						break;
					case "left":
						if (self.currentLane != -1) {
							self.isSwitchingLeft = true;
						}
						break;
					case "right":
						if (self.currentLane != 1) {
							self.isSwitchingRight = true;
						}
						break;
				}
			}

			// If the character is jumping, update the height of the character.
			// Otherwise, the character continues running.
			if (self.isJumping) {
				var jumpClock = currentTime - self.jumpStartTime;
				self.element.position.y = self.jumpHeight * Math.sin(
					(1 / self.jumpDuration) * Math.PI * jumpClock) +
					sinusoid(2 * self.stepFreq, 0, 20, 0,
						self.jumpStartTime - self.runningStartTime);
				if (jumpClock > self.jumpDuration) {
					self.isJumping = false;
					self.runningStartTime += self.jumpDuration;
				}
			} else {
				var runningClock = currentTime - self.runningStartTime;
				self.element.position.y = sinusoid(
					2 * self.stepFreq, 0, 20, 0, runningClock);
				self.head.rotation.x = sinusoid(
					2 * self.stepFreq, -10, -5, 0, runningClock) * deg2Rad;
				self.torso.rotation.x = sinusoid(
					2 * self.stepFreq, -10, -5, 180, runningClock) * deg2Rad;
				self.leftArm.rotation.x = sinusoid(
					self.stepFreq, -70, 50, 180, runningClock) * deg2Rad;
				self.rightArm.rotation.x = sinusoid(
					self.stepFreq, -70, 50, 0, runningClock) * deg2Rad;
				self.leftLowerArm.rotation.x = sinusoid(
					self.stepFreq, 70, 140, 180, runningClock) * deg2Rad;
				self.rightLowerArm.rotation.x = sinusoid(
					self.stepFreq, 70, 140, 0, runningClock) * deg2Rad;
				self.leftLeg.rotation.x = sinusoid(
					self.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
				self.rightLeg.rotation.x = sinusoid(
					self.stepFreq, -20, 80, 180, runningClock) * deg2Rad;
				self.leftLowerLeg.rotation.x = sinusoid(
					self.stepFreq, -130, 5, 240, runningClock) * deg2Rad;
				self.rightLowerLeg.rotation.x = sinusoid(
					self.stepFreq, -130, 5, 60, runningClock) * deg2Rad;

				// If the character is not jumping, it may be switching lanes.
				if (self.isSwitchingLeft) {
					self.element.position.x -= 200;
					var offset = self.currentLane * 800 - self.element.position.x;
					if (offset > 800) {
						self.currentLane -= 1;
						self.element.position.x = self.currentLane * 800;
						self.isSwitchingLeft = false;
					}
				}
				if (self.isSwitchingRight) {
					self.element.position.x += 200;
					var offset = self.element.position.x - self.currentLane * 800;
					if (offset > 800) {
						self.currentLane += 1;
						self.element.position.x = self.currentLane * 800;
						self.isSwitchingRight = false;
					}
				}
			}
		};

		/**
				* Handles character activity when the left key is pressed.
				*/
		this.onLeftKeyPressed = function () {
			self.queuedActions.push("left");
		};

		/**
				* Handles character activity when the up key is pressed.
				*/
		this.onUpKeyPressed = function () {
			self.queuedActions.push("up");
		};

		/**
				* Handles character activity when the right key is pressed.
				*/
		this.onRightKeyPressed = function () {
			self.queuedActions.push("right");
		};

		/**
				* Handles character activity when the game is paused.
				*/
		this.onPause = function () {
			self.pauseStartTime = new Date() / 1000;
		};

		/**
				* Handles character activity when the game is unpaused.
				*/
		this.onUnpause = function () {
			var currentTime = new Date() / 1000;
			var pauseDuration = currentTime - self.pauseStartTime;
			self.runningStartTime += pauseDuration;
			if (self.isJumping) {
				self.jumpStartTime += pauseDuration;
			}
		};

	}
}
