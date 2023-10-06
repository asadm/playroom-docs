
### useMultiplayerState(key: string, defaultValue: any)
Use this hook to listen and update a value in the Playroom state. The value will be synced across all players.

The return value is an array with two values:
- `state`: `any`
- `setState`: `(value: any, reliable?: boolean) => void`

If `reliable` is `true`, the state is synced reliably to all players via Websockets. This is useful for game state that is critical to the game, like the winner. 

If `reliable` is `false`, the state is synced via WebRTC, which is faster but less reliable. This is useful for game state that is not critical to the game, like the player's current position (you can always rely on next position update).

```js
import { useMultiplayerState } from 'playroomkit'
...
const [count, setCount] = useMultiplayerState('count', 0);
```

### usePlayersList(triggerOnPlayerStateChange?: boolean)
Returns [PlayerState](/apidocs#playerstate) objects for all players in the game.
Use this hook to get a list of all players in the game. The list will be updated as players join and leave the game.

If `triggerOnPlayerStateChange` is `true`, the hook will trigger a re-render when a player's state changes. This is useful for times when you want to display a list of players and their state values like scores.

```js
import { usePlayersList } from 'playroomkit'
...
const players = usePlayersList();
```

### usePlayersState(key: string)
This will give you a list of all players and their state values for a given key. The list will be updated as players state change. This is useful for times when you want to display a list of players and their state values like scores. 

The return value is an array of objects with the following shape:

- `player`: [PlayerState](/apidocs#playerstate)
- `state`: `any`

```js
import { usePlayersState } from 'playroomkit'
...
const players = usePlayersState('count'); 
// players = [{player: PlayerState, state: 10}, {player: PlayerState, state: 20}]
```

### useIsHost()
This will be true if the current player is the host of the game. The host is the player who started the game. Another player can become host if the current host leaves the game, this value changes automatically to reflect that.

```js
import { useIsHost } from 'playroomkit'
...
const isHost = useIsHost();
```