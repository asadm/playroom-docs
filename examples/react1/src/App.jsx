import "./App.css";
import {
  useMultiplayerState,
  myPlayer,
  usePlayersList,
} from "playroomkit";

const randomNumBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomRotations = Array(20)
  .fill(0)
  .map(
    () =>
      `rotate(${randomNumBetween(-5, 5)}deg) translateX(${randomNumBetween(
        -10,
        10
      )}px)`
  );

const App = () => {
  const players = usePlayersList();
  const [currentEmoji, setCurrentEmoji] = useMultiplayerState("emoji", []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: myPlayer()?.getProfile()?.color?.hexString,
      }}
    >
      {currentEmoji.map((emojiData, i) => {
        const player = players.find((p) => p.id === emojiData.id);
        if (!player) return null;

        return (
          <div key={i} className="emoji-display">
            <span
              className="card"
              style={{
                transform:
                  randomRotations[i % randomRotations.length],
              }}
            >
              <span className="avatar">
                <img
                  src={player.getProfile().photo}
                  alt="avatar"
                />
              </span>
              {emojiData.emoji}
            </span>
          </div>
        );
      })}

      <div className="emoji-button-bar">
        <button
          className="emoji-button"
          onClick={() =>
            setCurrentEmoji([
              ...currentEmoji,
              { emoji: "🫶", id: myPlayer().id },
            ])
          }
        >
          🫶
        </button>

        <button
          className="emoji-button"
          onClick={() =>
            setCurrentEmoji([
              ...currentEmoji,
              { emoji: "🥳", id: myPlayer().id },
            ])
          }
        >
          🥳
        </button>

        <button
          className="emoji-button"
          onClick={() =>
            setCurrentEmoji([
              ...currentEmoji,
              { emoji: "👋", id: myPlayer().id },
            ])
          }
        >
          👋
        </button>
      </div>
    </div>
  );
};

export default App;
