extends Node2D
var Playroom = JavaScript.get_interface("Playroom")
# Keep a reference to the callback so it doesn't get garbage collected
var jsBridgeReferences = []
func bridgeToJS(cb):
	var jsCallback = JavaScript.create_callback(self, cb)
	jsBridgeReferences.push_back(jsCallback)
	return jsCallback

var player_scene: PackedScene = preload("res://player.tscn")

const SPEED = 1500

var player_states = []
var player_scenes = []
var player_joysticks = []
# Called when the node enters the scene tree for the first time.
func _ready():
	# Make Joystick available in browser context so we can create it
	JavaScript.eval("Joystick = Playroom.Joystick")
	var initOptions = JavaScript.create_object("Object")
	Playroom.insertCoin(initOptions, bridgeToJS("onInsertCoin"))

# Called when the host has started the game
func onInsertCoin(args):
	print("Coin Inserted")
	Playroom.onPlayerJoin(bridgeToJS("onPlayerJoin"))

# Called when a new player joins the game
func onPlayerJoin(args):
	var state = args[0]
	print("new player: ", state.id)
	var joystick = addJoystickToPlayer(state)	
	var player = player_scene.instance()
	var color = Color(state.getProfile().color.hexString)
	player.get_child(0).color = color
	add_child(player)
	
	player_states.push_back(state)
	player_joysticks.push_back(joystick)
	player_scenes.push_back(player)
	
	# Listen to onQuit event
	state.onQuit(bridgeToJS("onPlayerQuit"))

func onPlayerQuit(args):
	var player_id = args[0].id
	# Loop and find the index of this player
	var player_index = -1
	for i in player_states.size():
		if (player_id == player_states[i].id):
			player_index = i
			pass
	
	var scene = player_scenes[player_index]
	player_states.erase(player_states[player_index])
	player_joysticks.erase(player_joysticks[player_index])
	player_scenes.erase(player_scenes[player_index])
	remove_child(scene)
	

# https://docs.joinplayroom.com/components/joystick
func addJoystickToPlayer(state):
	# A dpad + jump button joystick
	var joystickOptions = JavaScript.create_object("Object")
	joystickOptions.type = "dpad"
	var jumpButton = JavaScript.create_object("Object")
	jumpButton.id = "jump"
	jumpButton.label = "Jump"
	var buttons = JavaScript.create_object("Array")
	buttons.push(jumpButton)
	joystickOptions.buttons = buttons
	
	var joystick = JavaScript.create_object("Joystick", state, joystickOptions)
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
