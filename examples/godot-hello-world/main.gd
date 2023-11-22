extends Node2D
var Playroom = JavaScriptBridge.get_interface("Playroom")
# Keep a reference to the callback so it doesn't get garbage collected
var jsBridgeReferences = []
func bridgeToJS(cb):
	var jsCallback = JavaScriptBridge.create_callback(cb)
	jsBridgeReferences.push_back(jsCallback)
	return jsCallback
 
@export var player_scene: PackedScene

const SPEED = 1500

var player_states = []
var player_scenes = []
var player_joysticks = []
# Called when the node enters the scene tree for the first time.
func _ready():
	# Make Joystick available in browser context so we can create it
	JavaScriptBridge.eval("Joystick = Playroom.Joystick")
	var initOptions = JavaScriptBridge.create_object("Object")
	Playroom.insertCoin(initOptions, bridgeToJS(onInsertCoin))

# Called when the host has started the game
func onInsertCoin(args):
	print("Coin Inserted")
	Playroom.onPlayerJoin(bridgeToJS(onPlayerJoin))
 
# Called when a new player joins the game
func onPlayerJoin(args):
	var state = args[0]
	print("new player: ", state.id)
	var joystick = addJoystickToPlayer(state)	
	var player = player_scene.instantiate()
	var color = Color(state.getProfile().color.hexString)
	player.get_child(0).set_color(color)
	add_child(player)
	
	player_states.push_back(state)
	player_joysticks.push_back(joystick)
	player_scenes.push_back(player)
	
	# Listen to onQuit event
	var onQuitCb = func onPlayerQuit(args):
		print("player quit: ", state.id)
		player_states.erase(state)
		player_joysticks.erase(joystick)
		player_scenes.erase(player)
		remove_child(player)
	state.onQuit(bridgeToJS(onQuitCb))

# https://docs.joinplayroom.com/components/joystick
func addJoystickToPlayer(state):
	# A dpad + jump button joystick
	var joystickOptions = JavaScriptBridge.create_object("Object")
	joystickOptions.type = "dpad"
	var jumpButton = JavaScriptBridge.create_object("Object")
	jumpButton.id = "jump"
	jumpButton.label = "Jump"
	var buttons = JavaScriptBridge.create_object("Array")
	buttons.push(jumpButton)
	joystickOptions.buttons = buttons
	
	var joystick = JavaScriptBridge.create_object("Joystick", state, joystickOptions)
	return joystick
	
# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	for i in player_joysticks.size():
		var joystick = player_joysticks[i]
		var state = player_states[i]
		var scene = player_scenes[i]
		if (Playroom.isHost()):
			var dpad = joystick.dpad()
			if (dpad.x == "left"):
				scene.apply_central_impulse(Vector2(-SPEED, 0) * delta)
			if (dpad.x == "right"):
				scene.apply_central_impulse(Vector2(SPEED, 0) * delta)
			if (joystick.isPressed("jump") && int(scene.get_linear_velocity().y) == 0):
				scene.apply_central_impulse(Vector2(0, -500))
			state.setState("px", scene.get_position().x)
			state.setState("py", scene.get_position().y)
			state.setState("rotation", scene.get_rotation())
			
		else:
			if (!state.getState("px")): pass
			scene.set_position(
				Vector2(state.getState("px"), state.getState("py"))
			)
			scene.set_rotation(
				state.getState("rotation")
			)
