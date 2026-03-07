# Live Cursors Application with Playroom Kit

This project demonstrates a real-time multiplayer application using Playroom Kit to display live cursors of all active players in a room.

## How it Works

The application tracks each user's mouse movements and broadcasts them to all other connected clients in real-time. Each player's cursor is represented by a unique color, providing an interactive and collaborative experience.

## Playroom Kit Functions Used

-   **`insertCoin(options, [onLaunchCallback], [onDisconnectCallback])`**: Initializes the Playroom Kit session. This function tells Playroom to start, handling room creation, player joining, and allowing players to pick names, colors, and avatars. Once the host taps "Launch", the returned promise resolves.
    ```typescript
    useEffect(() => {
      insertCoin();
    })
    ```

-   **`myPlayer()` or `me()`**: Returns the current player's [`PlayerState`](https://docs.joinplayroom.com/api-reference/js/PlayerState) object. This object contains information about the local player, such as their ID and methods to set their state.
    ```typescript
    const me = myPlayer();
    ```

-   **`usePlayersList(triggerOnPlayerStateChange?: boolean)`**: A React hook that returns [`PlayerState`](https://docs.joinplayroom.com/api-reference/js/PlayerState) objects for all players in the game. The list will be updated as players join and leave the game. If `triggerOnPlayerStateChange` (which is set to `true` in this application) is `true`, the hook will trigger a re-render when a player's state changes. This is useful for displaying a list of players and their state values.
    ```typescript
    const players = usePlayersList(true) as PlayerLite[];
    ```

-   **`player.getState(key: string): any`**: Retrieves the value of the given key in the player's state. In this application, it's used to get the `cursor` position (`x`, `y` coordinates) of other players.
    ```typescript
    const playerCursor = player.getState("cursor");
    ```

-   **`me.setState(key: string, value: any, reliable: boolean = false)`**: Sets a state variable for the current player. Here, it's used to update the `cursor` position whenever the mouse moves (`onPointerMove`). When the mouse leaves the window (`onPointerLeave`), the `cursor` state is set to `null`.
    The `reliable` flag determines how the state is synced:
    -   If `reliable` is `true`, the state is synced reliably to all players via WebSockets.
    -   If `reliable` is `false` (as used in this application), the state is synced via WebRTC, which is faster but less reliable. This is suitable for non-critical game state like a player's real-time position.
    ```typescript
    onPointerMove={(event) => {
        if (me?.setState) me.setState("cursor", { x: Math.round(event.clientX), y: Math.round(event.clientY) }, false);
    }}
    onPointerLeave={() => {
        if (me?.setState) me.setState("cursor", null, false);
    }}
    ```