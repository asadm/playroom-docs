export namespace ReactPlayroom {
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
     * Returns true if this player is a bot.
     *
     * @returns Boolean indicating whether this player is a bot.
     */
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
   * Use this hook to listen and update a value in the Playroom state. The value will be synced across all players.
   *
   * @remarks
   * The return value is an array with two values:
   * - `state`: `any`
   * - `setState`: `(value: any, reliable?: boolean) => void`
   *
   * If `reliable` is `true`, the state is synced reliably to all players via Websockets. This is useful for game state that is critical to the game, like the winner.
   *
   * If `reliable` is `false`, the state is synced via WebRTC, which is faster but less reliable. This is useful for game state that is not critical to the game, like the player's current position (you can always rely on next position update).
   *
   * @param key - The key of the state to listen and update.
   * @param defaultValue - The default value for the state if it doesn't exist yet.
   * @example
   * ```ts
   * import { useMultiplayerState } from 'playroomkit'
   *
   * function GameComponent() {
   *   const [count, setCount] = useMultiplayerState('count', 0);
   *
   *   return (
   *     <div>
   *       <p>Count: {count}</p>
   *       <button onClick={() => setCount(count + 1)}>
   *         Increment
   *       </button>
   *     </div>
   *   );
   * }
   * ```
   * @example
   * Critical game state - use reliable updates:
   * ```ts
   * function GameComponent() {
   *   // Critical game state - use reliable updates
   *   const [winner, setWinner] = useMultiplayerState('winner', null);
   *
   *   // Player position - use non-reliable updates for better performance
   *   const [position, setPosition] = useMultiplayerState('position', { x: 0, y: 0 });
   *
   *   const handleWin = () => {
   *     setWinner('player1', true); // Reliable update
   *   };
   *
   *   const handleMove = (newPosition) => {
   *     setPosition(newPosition, false); // Non-reliable update
   *   };
   *
   *   return (
   *     <div>
   *       {winner && <p>Winner: {winner}</p>}
   *       <p>Position: {position.x}, {position.y}</p>
   *     </div>
   *   );
   * }
   * ```
   * @returns An array with two values: [state, setState]
   */
  export function useMultiplayerState<T = any>(
    key: string,
    defaultValue: T
  ): [T, (value: T, reliable?: boolean) => void] {
    return [defaultValue, () => {}];
  }

  /**
   * Use this hook to listen and update a value in a player's state.
   *
   * @remarks
   * The return value is an array with two values:
   * - `state`: `any`
   * - `setState`: `(value: any, reliable?: boolean) => void`
   *
   * If `reliable` is `true`, the state is synced reliably to all players via Websockets. This is useful for game state that is critical to the game, like the winner.
   *
   * If `reliable` is `false`, the state is synced via WebRTC, which is faster but less reliable. This is useful for game state that is not critical to the game, like the player's current position (you can always rely on next position update).
   *
   * @param player - The player state object to listen and update.
   * @param key - The key of the player state to listen and update.
   * @param defaultValue - The default value for the player state if it doesn't exist yet.
   * @example
   * ```ts
   * import { usePlayerState } from 'playroomkit'
   *
   * function PlayerComponent({ player }) {
   *   const [score, setScore] = usePlayerState(player, 'score', 0);
   *
   *   return (
   *     <div>
   *       <p>Player {player.id} Score: {score}</p>
   *       <button onClick={() => setScore(score + 1)}>
   *         Add Point
   *       </button>
   *     </div>
   *   );
   * }
   * ```
   * @returns An array with two values: [state, setState]
   */
  export function usePlayerState<T = any>(
    player: PlayerState,
    key: string,
    defaultValue: T
  ): [T, (value: T, reliable?: boolean) => void] {
    return [defaultValue, () => {}];
  }

  /**
   * This will give you a list of all players and their state values for a given key. The list will be updated as players state change. This is useful for displaying a list of players and their state values like scores.
   *
   * @remarks
   * The return value is an array of objects with the following shape:
   * - `player`: PlayerState
   * - `state`: `any`
   *
   * @param key - The key of the player state to get for all players.
   * @example
   * ```ts
   * import { usePlayersState } from 'playroomkit'
   *
   * function Leaderboard() {
   *   const players = usePlayersState('score');
   *   // players = [{player: PlayerState, state: 10}, {player: PlayerState, state: 20}]
   *
   *   const sortedPlayers = players.sort((a, b) => b.state - a.state);
   *
   *   return (
   *     <div>
   *       <h3>Leaderboard</h3>
   *       {sortedPlayers.map(({ player, state: score }, index) => (
   *         <div key={player.id}>
   *           {index + 1}. {player.getProfile().name}: {score} points
   *         </div>
   *       ))}
   *     </div>
   *   );
   * }
   * ```
   * @returns An array of objects with player and state properties.
   */
  export function usePlayersState<T = any>(key: string): Array<{ player: PlayerState; state: T }> {
    return [];
  }

  /**
   * Returns PlayerState objects for all players in the game. Use this hook to get a list of all players in the game. The list will be updated as players join and leave the game.
   *
   * @remarks
   * If `triggerOnPlayerStateChange` is `true`, the hook will trigger a re-render when a player's state changes. This is useful for times when you want to display a list of players and their state values like scores.
   *
   * By default, this hook only re-renders when players join or leave. Set `triggerOnPlayerStateChange` to `true` only when you need to track player state changes. Consider using `usePlayersState` for specific state values rather than tracking all state changes.
   *
   * @param triggerOnPlayerStateChange - If `true`, the hook will trigger a re-render when a player's state changes. Defaults to `false`.
   * @example
   * ```ts
   * import { usePlayersList } from 'playroomkit'
   *
   * function PlayersList() {
   *   const players = usePlayersList();
   *
   *   return (
   *     <div>
   *       <h3>Players ({players.length})</h3>
   *       {players.map(player => (
   *         <div key={player.id}>
   *           <img src={player.getProfile().photo} alt="Avatar" />
   *           <span>{player.getProfile().name}</span>
   *           {player.isBot() && <span> (Bot)</span>}
   *         </div>
   *       ))}
   *     </div>
   *   );
   * }
   * ```
   * @returns An array of PlayerState objects representing all players in the game.
   */
  export function usePlayersList(triggerOnPlayerStateChange?: boolean): PlayerState[] {
    return [];
  }

  /**
   * Returns true if the current player is the host of the game.
   *
   * @remarks
   * The host is the player who started the game. Another player can become host if the current host leaves the game, and this value changes automatically to reflect that.
   *
   * @example
   * ```ts
   * import { useIsHost } from 'playroomkit'
   *
   * function GameControls() {
   *   const isHost = useIsHost();
   *
   *   return (
   *     <div>
   *       {isHost ? (
   *         <div>
   *           <h3>Host Controls</h3>
   *           <button>Start Game</button>
   *           <button>Reset Game</button>
   *         </div>
   *       ) : (
   *         <div>
   *           <p>Waiting for host to start the game...</p>
   *         </div>
   *       )}
   *     </div>
   *   );
   * }
   * ```
   * @returns `true` if the current player is the host, `false` otherwise.
   */
  export function useIsHost(): boolean {
    return false;
  }
}
