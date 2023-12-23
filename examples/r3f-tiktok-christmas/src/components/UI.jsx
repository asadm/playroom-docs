import { useEffect, useRef } from "react";
import { randInt } from "three/src/math/MathUtils";
import { DEBUG_MODE } from "../App";
import { useGame } from "../hooks/useGame";

import IconSnowman from "../assets/icon-snowman.svg";

const fakeUser = {
  username: "Bobby",
  userPhotoUrl: "https://joinplayroom.com/images/testavatars/1.png",
};

const gradients = [
  "bg-gradient-to-t from-yellow-600 to-yellow-400",
  "bg-gradient-to-t from-gray-600 to-slate-300",
  "bg-gradient-to-t from-yellow-900 to-amber-600",
  "bg-gradient-to-t from-black to-gray-600",
];

export const UI = () => {
  const leaderboardRef = useRef();
  const { status, snowmen, dispatch, leaderboard, timer } = useGame();

  useEffect(() => {
    let toEnd = false;
    const interval = setInterval(() => {
      leaderboardRef.current?.scrollTo({
        top: 0,
        left: toEnd ? leaderboardRef.current.scrollWidth : 0,
        behavior: "smooth",
      });
      toEnd = !toEnd;
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col gap-4 items-stretch justify-between pointer-events-none">
      <div
        className="flex w-full overflow-x-auto pointer-events-auto"
        ref={leaderboardRef}
      >
        {leaderboard.map((player, index) => (
          <div
            key={index}
            className={`p-2 flex-shrink-0 w-32 flex flex-col justify-center items-center gap-1
            ${gradients[index < 3 ? index : 3]}`}
          >
            <img
              className="w-20 h-20 rounded-full border-4 border-white border-opacity-50"
              src={player.userPhotoUrl}
              alt="Player avatar"
            />
            <h2 className="font-bold text-sm text-white truncate max-w-full">
              #{index + 1} {player.username}
            </h2>
            <div className="flex items-center gap-1">
              <img src={IconSnowman} alt="Snowman icon" className="w-5" />
              <p className="font-bold text-white">{player.kills}</p>
            </div>
          </div>
        ))}
      </div>
      {status === "start" && (
        <div className="p-4">
          <p className="text-center text-white text-4xl font-bold">
            🎅🌲☃️
            <br />
            Save Christmas from the evil snowmen!
          </p>
          <p className="text-left text-white text-lg">
            <br />
            <b>✍️ Type</b> a snowman name to kill it
            <br />
            <b>❤️ Like</b> to kill one instantly
            <br />
            <b>🎁 Gift</b> to drop a magical bomb
            <br />
          </p>
          <button
            className="mt-2 bg-green-200 text-green-700 font-bold p-4 rounded-md pointer-events-auto w-full"
            onClick={() => dispatch({ type: "start" })}
          >
            START
          </button>
        </div>
      )}
      <div className="p-4">
        {status === "gameover" && (
          <>
            <p className="text-center text-white text-lg font-bold">
              Congratulations! 🎄
              <br />
              You saved Christmas from the evil snowmen!
            </p>
            <button
              className="mt-2 bg-green-200 text-green-700 font-bold p-4 rounded-md pointer-events-auto w-full"
              onClick={() => dispatch({ type: "restart" })}
            >
              PLAY AGAIN
            </button>
          </>
        )}
        {status === "playing" && (
          <p className="text-right text-4xl font-bold text-white">⏳ {timer}</p>
        )}
        {status === "playing" && DEBUG_MODE && (
          <div className="mt-4 flex gap-4">
            <button
              className="mt-4 bg-red-400 p-4 rounded-md pointer-events-auto"
              onClick={() =>
                dispatch({
                  type: "attack",
                  player: fakeUser,
                  name: snowmen[randInt(0, snowmen.length - 1)].name,
                })
              }
            >
              CHAT
            </button>
            <button
              className="mt-4 bg-red-400 p-4 rounded-md pointer-events-auto"
              onClick={() => {
                dispatch({ type: "like", player: fakeUser });
              }}
            >
              LIKE
            </button>
            <button
              className="mt-4 bg-orange-400 p-4 rounded-md pointer-events-auto"
              onClick={() => dispatch({ type: "bomb", player: fakeUser })}
            >
              GIFT
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
