import { usePlayersList } from "playroomkit";

export const Leaderboard = () => {
  const players = usePlayersList(true);
  return (
    <div className="fixed top-0 left-0 right-0 p-4 flex z-10 gap-4">
      {players.map((player) => (
        <div
          key={player.state.id}
          className={`bg-white  bg-opacity-60 backdrop-blur-sm flex items-center rounded-lg gap-2 p-2 min-w-[140px]`}
        >
          <img
            src={player.state.profile?.photo}
            className="w-10 h-10 border-2 rounded-full"
            style={{
              borderColor: player.state.profile?.color,
            }}
          />
          <div className="flex-grow">
            <h2 className={`font-bold text-sm`}>
              {player.state.profile?.name}
            </h2>
            <div className="flex text-sm items-center gap-4">
              <p>🔫 {player.state.kills}</p>
              <p>💀 {player.state.deaths}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
