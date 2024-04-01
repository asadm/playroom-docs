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
      <p><a href="https://docs.joinplayroom.com/components/discord" target="_blank">Documentation</a></p>
      <h2>Shared State</h2>
      <p>Playroom lets you easily sync state between players.<br />Try changing the color below and see it update for everyone!</p>
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

      <h2>Players</h2>
      <p>Below is a list of all the players in the room. 
        <br/><br/>- Playroom fetches their discord profiles.
        <br/>- Each player can also have their own state that is shared with everyone else.
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
  );
};

const root = document.querySelector("#root");
insertCoin({
  gameId: "IK4y2SvLqkrdRVoyeMNq",
  discord: true,
}).then(() => {
  render(<App />, root);
});
