import { insertCoin, onTikTokLiveEvent } from "playroomkit";
import { createContext, useContext, useEffect, useReducer } from "react";
import { randInt } from "three/src/math/MathUtils";
import { DEBUG_MODE } from "../App";

const GAME_TIME = 60;
const NB_SNOWMEN = 8;
const SNOWMAN_RESPAWN_TIME = 3000;
const SNOWMAN_ATTACKABLE_TIME_AFTER_RESPAWN = 1800;

function generateRandomSnowmanName() {
  const possibleNames = [
    "heart",
    "gift",
    "love",
    "friend",
    "christmas",
    "snowman",
    "winter",
    "snow",
    "snowflake",
    "snowball",
    "santa",
    "rudolph",
    "reindeer",
    "elf",
    "candy",
    "cane",
    "gingerbread",
    "cookie",
    "mistletoe",
    "holly",
    "jolly",
    "joy",
    "jingle",
    "bell",
    "merry",
    "tree",
    "lights",
    "ornament",
    "turkey",
    "socks",
    "chimney",
    "love",
    "family",
    "dance",
  ];
  return possibleNames[randInt(0, possibleNames.length - 1)];
}

function isSnowmanAttackable(snowman) {
  return (
    !snowman.dead &&
    (!snowman.respawnTime ||
      Date.now() - snowman.respawnTime > SNOWMAN_ATTACKABLE_TIME_AFTER_RESPAWN)
  );
}

const GameContext = createContext();

function gameReducer(state, action) {
  if (action.type === "start") {
    return {
      ...state,
      timer: GAME_TIME,
      status: "playing",
    };
  }
  if (action.type === "restart") {
    return {
      ...state,
      status: "start",
      timer: 0,
      leaderboard: [],
    };
  }

  if (action.type === "respawn") {
    const now = Date.now();
    const snowmen = [...state.snowmen];
    return {
      ...state,
      snowmen: snowmen.map((snowman) => {
        if (snowman.dead && now - snowman.deathTime > SNOWMAN_RESPAWN_TIME) {
          return {
            ...snowman,
            dead: false,
            respawnTime: now,
            name: generateRandomSnowmanName(),
          };
        }
        return snowman;
      }),
    };
  }

  if (action.type === "hideBomb") {
    return {
      ...state,
      showBomb: false,
    };
  }

  if (state.status !== "playing") {
    return state;
  }

  if (action.type === "updateLoop") {
    const timer = state.timer - 1;
    if (timer <= 0) {
      return {
        ...state,
        status: "gameover",
      };
    }
    return {
      ...state,
      timer,
    };
  }

  if (action.type === "bomb" && !state.showBomb) {
    const snowmen = [...state.snowmen];
    let killed = 0;
    for (let i = 0; i < snowmen.length; i++) {
      if (isSnowmanAttackable(snowmen[i])) {
        killed++;
        snowmen[i] = {
          ...snowmen[i],
          dead: true,
          deathTime: Date.now(),
          killedBy: action.player,
          deathCause: action.type,
        };
      }
    }
    const leaderboard = [...state.leaderboard];
    if (killed > 0) {
      const playerIndex = leaderboard.findIndex(
        (p) => p.username === action.player.username
      );
      if (playerIndex > -1) {
        leaderboard[playerIndex] = {
          ...action.player,
          kills: leaderboard[playerIndex].kills + killed,
        };
      } else {
        leaderboard.push({ ...action.player, kills: killed });
      }
      leaderboard.sort((a, b) => b.kills - a.kills);
    }
    return {
      ...state,
      showBomb: true,
      snowmen,
      leaderboard,
    };
  }

  if (action.type === "like" || action.type === "attack") {
    const snowmen = [...state.snowmen];
    const leaderboard = [...state.leaderboard];
    for (let i = 0; i < snowmen.length; i++) {
      if (
        isSnowmanAttackable(snowmen[i]) &&
        (action.type === "like" ||
          snowmen[i].name === action.name.toLowerCase())
      ) {
        snowmen[i] = {
          ...snowmen[i],
          dead: true,
          deathTime: Date.now(),
          killedBy: action.player,
          deathCause: action.type,
        };
        const playerIndex = leaderboard.findIndex(
          (p) => p.username === action.player.username
        );
        if (playerIndex > -1) {
          leaderboard[playerIndex] = {
            ...action.player,
            kills: leaderboard[playerIndex].kills + 1,
          };
        } else {
          leaderboard.push({ ...action.player, kills: 1 });
        }
        leaderboard.sort((a, b) => b.kills - a.kills);
        return {
          ...state,
          snowmen,
          leaderboard,
        };
      }
    }
  }

  return state;
}

export const GameProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, {
    status: "start", // start, playing, gameover
    timer: 0,
    snowmen: [
      ...Array(NB_SNOWMEN)
        .fill()
        .map((_, i) => ({
          name: generateRandomSnowmanName(),
        })),
    ],
    showBomb: false,
    leaderboard: [],
  });

  const setupTiktok = async () => {
    await insertCoin({ liveMode: "tiktok" });
    onTikTokLiveEvent((event) => {
      const player = {
        username: event.data.username,
        userPhotoUrl: event.data.userPhotoUrl,
      };
      switch (event.type) {
        case "chat":
          dispatch({
            type: "attack",
            player,
            name: event.data.comment,
          });

          break;
        case "gift":
          dispatch({
            type: "bomb",
            player,
          });
          break;
        case "like":
          dispatch({
            type: "like",
            player,
          });
          break;
      }
    });
  };

  useEffect(() => {
    const gameLoop = setInterval(() => {
      dispatch({ type: "updateLoop" });
    }, 1000);
    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      dispatch({ type: "respawn" });
    }, 100);
    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    if (!DEBUG_MODE) {
      setupTiktok();
    }
  }, []);

  const { snowmen, status, timer, leaderboard, showBomb } = gameState;

  useEffect(() => {
    if (!showBomb) return;
    const timeout = setTimeout(() => {
      dispatch({ type: "hideBomb" });
    }, 900);
    return () => clearTimeout(timeout);
  }, [showBomb]);
  return (
    <GameContext.Provider
      value={{
        dispatch,
        snowmen,
        status,
        timer,
        leaderboard,
        isSnowmanAttackable,
        showBomb,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
