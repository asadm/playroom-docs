import {
  useMultiplayerState,
  insertCoin,
  getDiscordClient,
  openDiscordInviteDialog,
  usePlayersList,
  myPlayer,
} from "playroomkit";
import { render } from "react-dom";


const COLORS = ['#ff7676', '#9aff9a', '#fff47c'];
const App = () => {
  const [currentColor, setCurrentColor] = useMultiplayerState("currentColor", COLORS[0]);
  const players = usePlayersList(true);
  return (
    <div className="container">
      <h1>Discord + Playroom</h1>
      <p>Multiplayer Activity Kit</p>
      <p className='btn3'><a href="https://docs.joinplayroom.com/components/discord" target="_blank">📕 Documentation</a></p>
      <div className='box'><h2>Shared State</h2>
      <p>Playroom lets you easily sync state between players. Try changing background and it will update for everyone.</p>
      <div className="btn-container">
        {COLORS.map(color => (
          <button
            key={color}
            className={"btn " + (currentColor === color ? "active" : "")}
            onClick={() => setCurrentColor(color)}
            style={{ backgroundColor: color }}>
              {currentColor === color ? "✅": "⚪"}
          </button>
        ))}
      </div>
      </div>
<div className='box'>
      <h2>Players in Activity</h2>
      <p>Playroom fetches discord profiles of all players in the room. Each player can also have their own state that is shared with everyone else
      </p>
      <div className="players">
        {players.map((player) => {
          const isMe = myPlayer()===player;
          const isReady = player.getState("ready");
          return (
          <a key={player.id} className="player" onClick={isMe?()=> player.setState("ready", !isReady):null}>
            <img src={player.getProfile().photo} width={100} height={100} />
            <div>
              <span>{player.getProfile().name} {isMe && "(You)"} - {isReady?"✅ Ready":"💭 Not Ready"}</span>
              <small>
              {isMe && "(Click to toggle ready/not ready)"}</small>
              </div>
          </a>
          );
      })}
        <button
          className="btn-invite"
          onClick={() => {
            openDiscordInviteDialog().then(() => {
              console.log("invite dialog opened");
            });
          }}>
          + Invite Friends
        </button>
      </div>
    </div>
    <p className='btn3'><a href="https://docs.joinplayroom.com/components/discord" target="_blank">👋🏼 Ask for help on Discord </a></p>
    </div>


  );
};

const root = document.querySelector("#root");
insertCoin({
  gameId: "IK4y2SvLqkrdRVoyeMNq",
  discord: true,
}).then(() => {
  render(<App />, root);
});
