import { atom, useAtom } from "jotai";
import {
  isHost,
  myPlayer,
  startMatchmaking,
  useMultiplayerState,
  usePlayersList,
} from "playroomkit";
import { useEffect, useState } from "react";
import { CAR_MODELS } from "./Car";

export const NameEditingAtom = atom(false);

export const UI = () => {
  const me = myPlayer();
  const [gameState, setGameState] = useMultiplayerState("gameState", "lobby");
  const [loadingSlide, setLoadingSlide] = useState(true);
  const [nameEditing, setNameEditing] = useAtom(NameEditingAtom);
  const [nameInput, setNameInput] = useState(
    me?.getState("name") || me?.state.profile.name
  );

  const [invited, setInvited] = useState(false);

  const invite = () => {
    navigator.clipboard.writeText(window.location.href);
    setInvited(true);
    setTimeout(() => setInvited(false), 2000);
  };

  useEffect(() => {
    setLoadingSlide(true);
    if (gameState !== "loading") {
      const timeout = setTimeout(() => {
        setLoadingSlide(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  usePlayersList(true);

  const [loadingContent, setLoadingContent] = useState(0);
  useEffect(() => {
    if (loadingSlide) {
      const interval = setInterval(() => {
        setLoadingContent((prev) => (prev + 1) % CAR_MODELS.length);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [loadingSlide]);

  return (
    <>
      <div
        className={`fixed z-30 top-0 left-0 right-0 h-screen bg-white flex items-center justify-center gap-1 text-5xl pointer-events-none transition-transform duration-500
      ${loadingSlide ? "" : "translate-y-[100%]"}
      `}
      >
        VROOM, VROOM
        <img src={`images/cars/${CAR_MODELS[loadingContent]}.png`} />
      </div>
      <div
        className={
          "fixed z-10 bottom-4 left-1/2 flex flex-wrap justify-center items-center gap-2.5 -translate-x-1/2 w-full max-w-[75vw]"
        }
      >
        {CAR_MODELS.map((model, idx) => (
          <div
            key={model}
            className={`min-w-14 min-h-14 w-14 h-14 bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-full shadow-md cursor-pointer
            ${
              me?.getState("car") === model ||
              (!me?.getState("car") && idx === 0)
                ? "ring-4 ring-blue-500"
                : ""
            }
            `}
            onClick={() => me?.setState("car", model)}
          >
            <img
              src={`/images/cars/${model}.png`}
              alt={model}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
      {gameState === "lobby" && isHost() && (
        <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2 items-end">
          <button
            className="px-4 py-2 bg-gray-100 text-black text-lg rounded-md"
            onClick={() => {
              setGameState("loading");
              setTimeout(() => {
                setGameState("game");
              }, 500);
            }}
          >
            Private
          </button>
          <button
            className="px-8 py-2 bg-gray-100 text-black text-2xl rounded-md"
            onClick={async () => {
              setGameState("loading");
              await startMatchmaking();
              setGameState("game");
            }}
          >
            Online
          </button>
        </div>
      )}
      <button
        className="z-20 fixed top-4 right-4 px-8 py-2 bg-gray-100 text-black text-2xl rounded-md flex items-center gap-2"
        onClick={invite}
        disabled={invited}
      >
        {invited ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
              />
            </svg>
            Link copied to clipboard
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            Invite
          </>
        )}
      </button>
      {nameEditing && (
        <div className="fixed z-20 inset-0 flex items-center justify-center flex-col gap-2 bg-black bg-opacity-20 backdrop-blur-sm">
          <input
            autoFocus
            className="p-3"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                me?.setState("name", nameInput);
                setNameEditing(false);
              }
            }}
          />
          <div className="flex items-center gap-2">
            <button
              className="px-8 py-2 bg-red-400 text-white text-2xl rounded-md"
              onClick={() => {
                setNameEditing(false);
              }}
            >
              ✗
            </button>
            <button
              className="px-8 py-2 bg-green-400 text-white text-2xl rounded-md"
              onClick={() => {
                me?.setState("name", nameInput);
                setNameEditing(false);
              }}
            >
              ✓
            </button>
          </div>
        </div>
      )}
    </>
  );
};
