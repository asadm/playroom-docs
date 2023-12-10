import { useState } from "react";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { myPlayer, getRoomCode } from "playroomkit";

export const UI = () => {
  const [avatarMode, setAvatarMode] = useState(false);

  return (
    <>
      {avatarMode && (
        <AvatarCreator
          subdomain="wawa-sensei-tutorial"
          className="fixed top-0 left-0 z-10 w-screen h-screen"
          onAvatarExported={(event) => {
            const character = myPlayer().getState("character");
            const avatarUrl = event.data.url;
            character.avatarUrl = avatarUrl.split("?")[0] + "?" + new Date().getTime();
            myPlayer().setState("character", character);
            setAvatarMode(false);
          }}
        />
      )}
      <div className="fixed top-0 left-0 z-10 w-screen h-16 text-black flex items-center justify-between px-4 font-bold text-xl">
        Room Code<br/>{getRoomCode()}
      </div>
      <div className="fixed inset-4 flex items-end justify-center pointer-events-none">
        <div className="flex items-center space-x-4 pointer-events-auto">
          {/* BACK */}
          {/* AVATAR */}
          <button
              className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setAvatarMode(true)}>
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button>
          {/* DANCE */}
          <button
            className="p-4 rounded-full bg-slate-500 text-white drop-shadow-md cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => myPlayer().setState("dance", Date.now())}
          >
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
                d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
              />
            </svg>
          </button>
          
        </div>
      </div>
    </>
  );
};