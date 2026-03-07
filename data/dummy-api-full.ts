export namespace Playroom {
  /**
   * Represents a player in the room.
   */
  export interface PlayerState {
    /** Unique player ID. */
    id: string;

    /**
     * Returns the player's profile information.
     *
     * @returns PlayerProfile object containing name, color, photo, avatarIndex.
     */
    getProfile(): PlayerProfile;

    /**
     * Returns the value of a key in the player's state.
     *
     * @param key - The key to retrieve.
     * @example
     * ```ts
     * const score = player.getState('score');
     * ```
     * @returns Value associated with the key.
     */
    getState(key: string): any;

    /**
     * Sets a value in the player's state.
     *
     * @param key - The key to set.
     * @param value - The value to assign.
     * @param reliable - Whether to sync reliably via WebSockets. Defaults to false.
     * @example
     * ```ts
     * player.setState('score', 10);
     * ```
     */
    setState(key: string, value: any, reliable?: boolean): void;

    /**
     * Registers a callback when the player quits the room.
     *
     * @param callback - Function called with the PlayerState of the quitting player.
     * @example
     * ```ts
     * const unsubscribe = player.onQuit((state) => {
     *   console.log(`${state.id} quit!`);
     * });
     * unsubscribe();
     * ```
     * @returns A function to unsubscribe the callback.
     */
    onQuit(callback: (state: PlayerState) => void): () => void;

    /**
     * Kicks the player from the room. Only host can call.
     *
     * @example
     * ```ts
     * await player.kick();
     * ```
     */
    kick(): Promise<void>;

    /**
     * Removes the player from the room voluntarily.
     *
     * @remarks
     *
     * If `reconnectGracePeriod` is configured, the player must wait for a 5-second cooldown period before
     * they can rejoin the same room. This cooldown allows the player's state to be safely restored upon rejoining.
     *
     * If `reconnectGracePeriod` is not set, no cooldown is applied, and the player can leave and rejoin the room immediately.
     * In this case, please note that the player's state will not be restored upon rejoin.
     *
     * @example
     * ```ts
     * await player.leaveRoom();
     * ```
     */
    leaveRoom(): Promise<void>;

    /**
     * Returns true if this player is a bot.
     *
     * @returns Boolean indicating whether this player is a bot.
     */
    isBot(): boolean;
  }

  /**
   * Options for Joystick buttons.
   */
  export interface ButtonOptions {
    /** The ID of the button. This is used to identify the button in the `isPressed` method. */
    id?: string;
    /** The button can have a text label. */
    label?: string;
    /** The button can have an icon. This is a URL to an image. */
    icon?: string;
  }

  /**
   * Zone configuration for Joystick.
   */
  export interface ZoneOptions {
    /** The zone on the top side of the joystick. */
    up?: ButtonOptions;
    /** The zone on the bottom side of the joystick. */
    down?: ButtonOptions;
    /** The zone on the left side of the joystick. */
    left?: ButtonOptions;
    /** The zone on the right side of the joystick. */
    right?: ButtonOptions;
  }

  /**
   * Joystick controller for a player.
   */
  export interface JoystickController {
    /**
     * Returns true if the button with the given ID is pressed.
     *
     * @param id - Button ID.
     */
    isPressed(id: string): boolean;

    /** Returns true if the joystick itself is pressed. */
    isJoystickPressed(): boolean;

    /** Returns the angle of the joystick in radians. */
    angle(): number;

    /**
     * Returns the direction of the joystick as a string.
     *
     * @remarks
     *
     * The string can be one of: `up`, `down`, `left`, `right`.
     */
    dpad(): { x: string; y: string };

    /** Destroy and remove the Joystick and its UI. */
    destroy(): void;
  }

  /**
   * Options for creating a Joystick.
   */
  export interface JoystickOptions {
    /** The type of output joystick generates. Can be `dpad` or `angular`. */
    type?: "angular" | "dpad";
    /** An array of buttons to render on the joystick. See ButtonOptions for details. */
    buttons?: ButtonOptions[];
    /** An object to define custom zones on the 4 sides of the joystick. See ZoneOptions for details. */
    zones?: ZoneOptions | null;
    /** A boolean value to enable W, A, S and D keys to control joystick. */
    keyboard?: boolean;
  }

  /**
   * Options for initializing a Playroom session.
   */
  export interface InitOptions {
    /** The ID of the game from the Playroom developer portal. */
    gameId: string;
    /** If true, Playroom will start in stream mode. */
    streamMode?: boolean;
    /** If set to 'tiktok', Playroom will start in TikTok Live mode. */
    liveMode?: string;
    /** If true, Playroom will let players play game using gamepads connected to the stream device itself. This requires streamMode to also be true. The gamepads need to be connected to the device where stream screen is running. No phones are required in this mode but are optionally allowed as an alternative controller if there aren't enough physical gamepads in the room. Players who join via phone in this mode see an on-screen Joystick. */
    allowGamepads?: boolean;
    /** The base URL used for generating room link that host shares with other players. Defaults to current page URL. */
    baseUrl?: string;
    /** An array of URLs to images that players can pick as their avatar. This will override the default avatars system that Playroom provides. */
    avatars?: string[];
    /** If true, Playroom initializes a bot using the provided botOptions. */
    enableBots?: boolean;
    /** An object containing parameters for bot instantiation and configuration. */
    botOptions?: BotOptions;
    /** Override the room to join. If this is not set, a random room code is assigned. Do note that if the URL has room #r= param, that is used instead of this. */
    roomCode?: string;
    /** Skips the Playroom lobby screen. Useful if you implement your own lobby. */
    skipLobby?: boolean;
    /** If set, Playroom will wait for the given number of milliseconds for the player to reconnect to the room after a disconnect. If the player reconnects within the grace period, the player's state is restored. If the player does not reconnect within the grace period, the player is removed from the room and onQuit fires for the player. */
    reconnectGracePeriod?: number;
    /** If set, Playroom will set a maximum limit for the number of players per room. If the room is full and a new player attempts to join, the Playroom will display a default modal with a message stating that the "room is full", and the insertCoin method will throw an error with a message code `ROOM_LIMIT_EXCEEDED`. If the room is full, skipLobby is set to true, and a new player is attempting to join the room, Playroom will skip the default modal but will throw an error. */
    maxPlayersPerRoom?: number;
    /** An object containing default game states. These states are set when the room is created. */
    defaultStates?: Record<string, any>;
    /** An object containing default player states. These states are set for all players when they join the room. */
    defaultPlayerStates?: Record<string, any>;
    /** An object containing matchmaking options or just true to enable with default options. */
    matchmaking?: MatchmakingOptions | boolean;
    /** Enable Discord mode. See Discord Mode for more information. */
    discord?: boolean;
  }

  /**
   * Matchmaking configuration options.
   */
  export interface MatchmakingOptions {
    /** Time in milliseconds to wait for an existing room before creating a new one. */
    waitBeforeCreatingNewRoom?: number;
  }

  /**
   * Bot instantiation and configuration options.
   */
  export interface BotOptions {
    /** The class or constructor function used to instantiate a new bot. Should conform to the Bot interface. */
    botClass: Bot;
    /** An object of parameters passed to the botClass constructor when creating a new bot instance. Useful for customizing and configuring individual bot behaviors. */
    botParams?: Record<string, any>;
  }

  /**
   * Represents a bot or automated player.
   *
   * @remarks
   *
   * The `Bot` interface represents an automated player. The `Bot` and its derived classes will have methods and properties similar to a PlayerState object.
   *
   * **Note:** The behavior of a bot, particularly its decision-making and interactions, will heavily depend on its implementation and the given `botClass`. Ensure the bot's behaviors align with the game's requirements and player expectations.
   */
  export interface Bot {
    /** Unique bot ID. */
    id: string;
    /** Returns the bot's profile. */
    getProfile(): PlayerProfile;
    /** Returns a specific state value for the bot. */
    getState(key: string): any;
    /** Sets a specific state value for the bot. */
    setState(key: string, value: any, reliable?: boolean): void;
    /** Registers a callback when the bot quits. Returns unsubscribe function. */
    onQuit(callback: (player: PlayerState) => void): () => void;
    /** Kicks the bot from the room. Only host can call. */
    kick(): Promise<void>;
    /** Returns true if this entity is a bot. */
    isBot(): boolean;
  }

  /**
   * Player profile object.
   */
  export interface PlayerProfile {
    /** Player's name. */
    name: string;
    /** Player's color object. */
    color: Color;
    /** Player's avatar photo as dataURL. */
    photo: string;
    /** Index of the avatar picked from the avatars array. -1 if default. */
    avatarIndex: number;
  }

  /**
   * Color object representation.
   */
  export interface Color {
    /** The red component of the color, between 0 and 255. */
    r: number;
    /** The green component of the color, between 0 and 255. */
    g: number;
    /** The blue component of the color, between 0 and 255. */
    b: number;
    /** The color as a hex string, e.g. #ff0000 for red. */
    hexString: string;
    /** The color as a hex number, e.g. 0xff0000 for red. */
    hex: number;
  }

  /**
   * The TikTokLiveEvent interface represents a live event sent from TikTok to the game.
   */
  export interface TikTokLiveEvent {
    /** Type of the live event (chat, gift, or like). */
    type?: "chat" | "gift" | "like";
    /** Event data containing user and event-specific information. */
    data?: {
      /** Timestamp of the event. */
      t?: number;
      /** Message ID. */
      msgId?: string;
      /** User ID. */
      userId?: string;
      /** User name. */
      name?: string;
      /** URL of the user's photo. */
      userPhotoUrl?: string;
      /** Comment text - available only when type is "chat". */
      comment?: string;
      /** Name of the gift - available only when type is "gift". */
      giftName?: string;
      /** URL of the gift's photo - available only when type is "gift". */
      giftPhotoUrl?: string;
      /** Gift ID - available only when type is "gift". */
      giftId?: string;
      /** Diamond count of the gift - available only when type is "gift". */
      giftDiamondCount?: number;
    };
  }

  /**
   * Initialize Playroom and start the multiplayer session.
   *
   * @remarks
   *
   * Tell Playroom to start! Playroom Kit will then handle room creation, players joining and also let players pick their names, colors and avatars. Once host taps "Launch", the promise resolves (and `onLaunchCallback` is called if provided). At this point you can start your game.
   *
   * @param options - Initialization settings for the session.
   * @param onLaunchCallback - A callback function that will be called when the host taps "Launch".
   * @param onDisconnectCallback - A callback function that will be called when the current player disconnects from the room.
   * @example
   * Here's a vanilla example:
   * ```ts
   * // Show Playroom UI, let it handle players joining etc and wait for host to tap "Launch"
   * await insertCoin();
   * // Start your game!
   * ```
   * @example
   * Sets a maximum limit for the number of players per room:
   * ```ts
   * try {
   *   await insertCoin({
   *     maxPlayersPerRoom: 2, // maximum limit for 2 players per room
   *   });
   * } catch (error) {}
   * ```
   * @example
   * When `skipLobby` is set to `true`, Playroom Kit will skip both the default lobby and the "room is full" modal:
   * ```ts
   * try {
   *   await insertCoin({
   *     skipLobby: true,
   *     maxPlayersPerRoom: 2,
   *   });
   * } catch (error) {
   *   if (error.message === "ROOM_LIMIT_EXCEEDED") {
   *     // Here you can display a custom error
   *   }
   * }
   * ```
   * @returns A promise that resolves when the session is ready.
   */
  export async function insertCoin(
    options: InitOptions,
    onLaunchCallback?: (callback: () => {}) => {},
    onDisconnectCallback?: (callback: () => {}) => {},
  ): Promise<void> {
    return;
  }

  /**
   * Returns true if the current player is the host.
   *
   * @remarks
   *
   * Use this to conditionally run code that should only be executed by the host.
   *
   * @example
   * ```ts
   * if (isHost()) {
   *   console.log("I am the host!");
   * }
   * ```
   *
   * @returns True if current player is host, false otherwise.
   */
  export function isHost(): boolean { return false; }

  /**
   * Returns true if the current screen is the stream screen.
   *
   * @remarks
   *
   * The stream screen is a non-player screen shown when the game is in stream mode.
   *
   * @example
   * ```ts
   * if (isStreamScreen()) {
   *   showCountdown();
   * }
   * ```
   *
   * @returns True if current screen is the stream screen.
   */
  export function isStreamScreen(): boolean { return false; }

  /**
   * Returns the 4-letter room code of the current room.
   *
   * @example
   * ```ts
   * const code = getRoomCode();
   * console.log(`Room code: ${code}`);
   * ```
   *
   * @returns A 4-letter string representing the room code.
   */
  export function getRoomCode(): string { return ""; }

  /**
   * Starts matchmaking manually if not passed in insertCoin.
   *
   * @remarks
   *
   * Useful when you want to control when matchmaking starts.
   *
   * @example
   * ```ts
   * // Insert coin the regular way
   * await insertCoin({skipLobby: true});
   *
   * // Start matchmaking manually
   * await startMatchmaking();
   * ```
   *
   * @returns A promise that resolves when matchmaking has started.
   */
  export async function startMatchmaking(): Promise<void> { return; }

  /**
   * Register a callback that will be called when the current player disconnects.
   *
   * @remarks
   *
   * The callback is also triggered if the player is kicked from the room.
   *
   * @param callback - Function called with an event containing:
   *  - `code`: number code of the disconnect
   *  - `reason`: human-readable reason
   *
   * @example
   * ```ts
   * onDisconnect((event) => {
   *   console.log(`Disconnected! Code: ${event.code}, Reason: ${event.reason}`);
   * });
   * ```
   *
   * @returns Nothing.
   */
  export function onDisconnect(callback: (e: { code: number; reason: string }) => void): void { }

  /**
   * Adds a bot to the room.
   *
   * @remarks
   *
   * Equivalent to pressing the "Add Bot" button in the lobby. Returns a promise that resolves to an instance of the class you provided in `botOptions.botClass` parameter in `insertCoin`.
   *
   * @example
   * ```ts
   * const bot = await addBot();
   * console.log(`Bot ${bot.id} added`);
   * ```
   *
   * @returns A promise resolving to the bot instance.
   */
  export async function addBot(): Promise<Bot> { throw new Error("Not implemented"); }

  /**
   * Returns the current player's PlayerState.
   *
   * @example
   * ```ts
   * const player = myPlayer();
   * console.log(`Hello ${player.getProfile().name}`);
   * ```
   *
   * @returns The current player's PlayerState object.
   */
  export function myPlayer(): PlayerState { throw new Error("Not implemented"); }

  /**
   * Returns the current value of a given key in the global game state.
   *
   * @remarks
   *
   * Useful for reading important game state values, like the current score or winner.
   *
   * @param key - The state key to retrieve.
   *
   * @example
   * ```ts
   * const winnerId = getState('winner');
   * console.log(`Winner is ${winnerId}`);
   * ```
   *
   * @returns The value associated with the given key.
   */
  export function getState(key: string): any { return undefined; }

  /**
   * Sets a value in the global game state.
   *
   * @remarks
   *
   * If `reliable` is true, the state is synced reliably via WebSockets. If false, state is synced faster via WebRTC but less reliably.
   *
   * @param key - The state key to set.
   * @param value - The value to set for the key.
   * @param reliable - Whether the update should be reliably synced to all players. Defaults to true.
   *
   * @example
   * ```ts
   * setState('winner', 'player1');
   * ```
   *
   * @returns Nothing.
   */
  export function setState(key: string, value: any, reliable: boolean = true): void { }

  /**
   * Resets all global game states to their default values.
   *
   * @remarks
   *
   * You can optionally exclude specific keys from being reset.
   *
   * @param keysToExclude - Array of keys to exclude from reset.
   *
   * @example
   * ```ts
   * await resetStates();
   * await resetStates(['winner']);
   * ```
   *
   * @returns A promise that resolves when reset is complete.
   */
  export async function resetStates(keysToExclude?: string[]): Promise<void> { }

  /**
   * Resets all players' states to their default values.
   *
   * @remarks
   *
   * Optionally exclude specific player state keys.
   *
   * @param keysToExclude - Array of keys to exclude from reset.
   *
   * @example
   * ```ts
   * await resetPlayersStates();
   * await resetPlayersStates(['score']);
   * ```
   *
   * @returns A promise that resolves when reset is complete.
   */
  export async function resetPlayersStates(keysToExclude?: string[]): Promise<void> { }

  /**
   * Registers a callback when a new player joins the room.
   *
   * @remarks
   *
   * The callback first runs for all existing players, then for any new players that join. This is useful for "catching up" a new player with existing players or getting the full list in a new game scene.
   *
   * @param callback - Function called with the PlayerState object of the joining player.
   *
   * @example
   * ```ts
   * onPlayerJoin((player) => {
   *   console.log(`${player.id} joined!`);
   * });
   * ```
   *
   * @returns Nothing.
   */
  export function onPlayerJoin(callback: (player: PlayerState) => void): void { }

  /**
   * Transfers host privileges to another player.
   *
   * @remarks
   *
   * Only the current host can call this. The target player must be in the room.
   *
   * @param playerId - The ID of the player to transfer host to.
   *
   * @example
   * ```ts
   * await transferHost('player123');
   * ```
   *
   * @returns A promise that resolves when the transfer is complete.
   */
  export async function transferHost(playerId: string): Promise<void> { }

  /**
   * Returns a promise that resolves to the state value only when the game state has the given key set, to any truthy value.
   *
   * @remarks
   *
   * In other words, it waits until a game state is set. This is useful for waiting for the host to set the winner, for example.
   *
   * Optionally, you can pass a callback that will be called when the state is set.
   *
   * @param stateKey - The key to wait for.
   * @param onStateSetCallback - Optional callback invoked when the state is set.
   *
   * @example
   * ```ts
   * const winner = await waitForState('winner');
   * console.log(`Winner: ${winner}`);
   * ```
   *
   * @returns A promise resolving to the value of the state key.
   */
  export async function waitForState(stateKey: string, onStateSetCallback?: (value: any) => void): Promise<any> { }

  /**
   * Returns a promise that resolves to the state value only when the player state has the given key set, to any truthy value.
   *
   * @remarks
   *
   * In other words, it waits until a player state is set. This is useful for waiting for a player to play their turn, for example.
   *
   * Optionally, you can pass a callback that will be called when the state is set.
   *
   * @param player - The PlayerState object to observe.
   * @param stateKey - The key to wait for.
   * @param onStateSetCallback - Optional callback invoked when the state is set.
   *
   * @example
   * ```ts
   * await waitForPlayerState(player, 'playedTurn');
   * ```
   *
   * @returns A promise resolving to the player's state value.
   */
  export async function waitForPlayerState(player: PlayerState, stateKey: string, onStateSetCallback?: (value: any) => void): Promise<any> { }

  /**
   * Register a callback that will be called when a live event is received from TikTok. Returns a function that can be called to unsubscribe the callback.
   *
   * @param callback - Function called with a TikTokLiveEvent.
   *
   * @example
   * ```ts
   * const unsubscribe = onTikTokLiveEvent((event) => {
   *   console.log(event.type, event.data);
   * });
   * ```
   *
   * @returns A function to unsubscribe the callback.
   */
  export function onTikTokLiveEvent(callback: (event: TikTokLiveEvent) => void): () => void { return () => { }; }

  /**
   * Opens a Discord invite dialog.
   *
   * @remarks
   *
   * Opens a dialog to invite players to the current Discord activity. Not available outside of Discord.
   *
   * @example
   * ```ts
   * await openDiscordInviteDialog();
   * ```
   *
   * @returns A promise that resolves when the dialog closes.
   */
  export async function openDiscordInviteDialog(): Promise<void> { }

  /**
   * Returns an authenticated Discord client.
   *
   * @remarks
   *
   * Returns a Discord client that is already authenticated and ready to use. See [Embedded SDK Docs](https://discord.com/developers/docs/developer-tools/embedded-app-sdk#sdk-methods) for available methods and commands. Not available outside of Discord.
   *
   * @returns The DiscordClient instance.
   */
  export function getDiscordClient(): any { return null; }

  /**
   * Returns the Discord access token of the current user.
   *
   * @remarks
   *
   * Returns the access token of the current Discord user. Not available outside of Discord.
   *
   * @returns The access token string.
   */
  export function getDiscordAccessToken(): string { return ""; }

  /**
   * Returns the Discord SDK object.
   *
   * @returns A promise resolving to the SDK object.
   */
  export async function getDiscordSDK(): Promise<any> { return {}; }

  /**
   * A component that renders a joystick controller. The joystick can be used to control the player's position in the game.
   *
   * @param player - The PlayerState for the joystick.
   * @param options - Joystick options.
   *
   * @example
   * ```ts
   * import { Joystick, myPlayer } from 'playroomkit';
   *
   * new Joystick(myPlayer(), {
   *   type: "dpad"
   * })
   * ```
   */
  export function Joystick(player: PlayerState, options: JoystickOptions): JoystickController {
    return {} as JoystickController
  }

  /**
   * Remote Procedure Call (RPC) system.
   */
  export namespace RPC {
    /**
     * Modes for RPC calls.
     */
    export enum Mode { HOST, ALL, OTHERS }

    /**
     * Register a callback that will be called when a remote procedure call (RPC) with the given name is received from a player. The callback will be called with the data sent by the other player and the PlayerState object of the caller.
     *
     * @param name - The RPC name to listen for.
     * @param callback - Function called with data and the sender's PlayerState. Must return a Promise.
     *
     * @example
     * ```ts
     * RPC.register('playTurn', async (data, sender) => {
     *   console.log(`${sender.id} played!`);
     *   return 'ok';
     * });
     * ```
     *
     * @returns Nothing.
     */
    export function register(name: string, callback: (data: any, sender: PlayerState) => Promise<any>): void { }

    /**
     * Call a remote procedure call (RPC) with the given name and data.
     *
     * @remarks
     *
     * The `mode` parameter can be used to specify the mode of the RPC call. The default mode is `RPC.Mode.ALL`.
     *
     * RPCs can be triggered in three different modes:
     *
     * - `RPC.Mode.HOST`: The RPC is triggered on the host only.
     *
     * - `RPC.Mode.ALL`: The RPC is triggered on all clients (including the host and the caller).
     *
     * - `RPC.Mode.OTHERS`: The RPC is triggered on all clients except the caller.
     *
     * @param name - The RPC name to call.
     * @param data - Data to send to other players.
     * @param mode - Mode of the RPC. Defaults to RPC.Mode.ALL.
     * @param callbackOnResponse - Optional callback for the response.
     *
     * @example
     * ```ts
     * // Trigger an RPC on the host only
     * RPC.call('playTurn', { thing: 'rock' }, RPC.Mode.HOST);
     *
     * // Trigger an RPC on all clients (including the host and the caller)
     * RPC.call('playTurn', { thing: 'rock' }, RPC.Mode.ALL);
     *
     * // Trigger an RPC on all clients except the caller
     * RPC.call('playTurn', { thing: 'rock' }, RPC.Mode.OTHERS);
     * ```
     *
     * @returns A promise resolving to the RPC response.
     */
    export async function call(name: string, data: any, mode?: Mode, callbackOnResponse?: (data: any) => void): Promise<any> { return; }
  }
}
