
### useMultiplayerState(key: string, defaultValue: any)
Use this hook to listen and update a value in the Playroom state. The value will be synced across all players.

```js
import { useMultiplayerState } from 'playroomkit'
...
const [count, setCount] = useMultiplayerState('count', 0);
```

### usePlayersList()
Use this hook to get a list of all players in the game. The list will be updated as players join and leave the game.

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