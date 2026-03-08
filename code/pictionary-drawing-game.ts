import { CodePlaygroundFile } from "../components/CodePlayground";

export const pictionaryDrawing: CodePlaygroundFile[] = [
  {
    name: "src/AvatarBar/AvatarIcon.jsx",
    language: "javascript",
    code: `import React from "react";
import defaultImg from "./default-avatar.png";

export default function generateAvatarIcon({
  playerState,
  key,
  style,
  noDefault,
  defaultImage,
}) {
  var profile = playerState ? playerState.getState("profile") : false;
  style = style || {};
  if (profile) style["borderColor"] = profile.color;
  if (profile && profile.photo) {
    style["backgroundImage"] = \`url(\${profile.photo})\`;
    style["backgroundSize"] = "contain";
  } else if (!noDefault) {
    if (defaultImage === "color" && profile) {
      style["background"] = profile.color;
    } else {
      style["backgroundImage"] = \`url(\${defaultImage || defaultImg})\`;
    }
    style["backgroundSize"] = defaultImage ? "cover" : "contain";
  }
  return (
    <div
      key={key || (playerState ? playerState.id : "")}
      className="avatar-holder"
      style={style}
    ></div>
  );
}`
  },
  {
    name: "src/AvatarBar/style.css",
    language: "css",
    code: `.player-avatar-bar {
  display: flex;
  margin-bottom: 0.5rem;
  overflow-x: auto;
}

.player-avatar-bar .player-avatar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0rem 0.5rem;
  border-radius: 2rem;
  position: relative;
}

.player-avatar-bar .player-avatar-container > span {
  color: #ffffff;
  font-family: "Open Sans" sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0rem 0.7rem;
}

.player-avatar-bar .player-avatar-container .guessed{
  background-image: url("./tick.png");
  background-size: 1.5rem;
  background-position: center;
  background-repeat: no-repeat;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  position: absolute;
  right: -0.5rem;
  top: 0rem;
}

.player-avatar-bar .player-avatar-container .drawing{
  background-image: url("./drawing.png");
  background-size: 1.5rem;
  background-position: center;
  background-repeat: no-repeat;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  position: absolute;
  right: -0.5rem;
  top: 0rem;
}

.player-avatar-bar .avatar-holder {
  background-color: rgba(255, 255, 255, 0.8);
  background-size: 23px;
  background-position: center;
  background-repeat: no-repeat;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: 0.15rem solid transparent;
}

.player-avatar-bar .avatar-holder.empty {
  background-color: #000;
}`
  },
  {
    name: "src/AvatarBar/index.jsx",
    language: "javascript",
    code: `import React from "react";
import AvatarIcon from "./AvatarIcon";
import { usePlayersList, useMultiplayerState } from "playroomkit";
import "./style.css";

export default function AvatarBar() {
  const players = usePlayersList(true);
  const [playerDrawing, _setPlayerDrawing] = useMultiplayerState('playerDrawing');
  return (
    <div
      className="player-avatar-bar">
      {players.map((playerState) => {
        return (
          <div
            key={playerState.id}
            className="player-avatar-container"
            style={{ backgroundColor: playerState.getState("profile")?.color }}>
              {playerState.id === playerDrawing && <div className="drawing"></div>}
              {playerState.getState("guessed") && <div className="guessed"></div>}
              <AvatarIcon playerState={playerState} />
          </div>
        );
      })}
    </div>
  );
}`
  },
  {
    name: "src/DrawingArea/style.css",
    language: "css",
    code: `.drawing-area #canvas, .drawing-area #picture img{
  width: 350px;
  height: 280px;
}

.drawing-area #picture img{
  background-color: #fff;
}

.drawing-area #canvas .drawing-board-canvas,
.drawing-area #picture img{
  border-radius: 1rem;
  overflow: hidden;
}
.drawing-area #canvas .drawing-board-canvas-wrapper{
  border: 0px;
}

.drawing-area #canvas .drawing-board-controls{
  position: relative;
  z-index: 22;
}`
  },
  {
    name: "src/DrawingArea/index.jsx",
    language: "javascript",
    code: `import {  useEffect, useImperativeHandle, forwardRef } from 'react'
import { myPlayer } from "playroomkit";
import './style.css'

const DrawingArea = forwardRef(({
  playerDrawing,
  currentWord,
  picture
}, ref) => {
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.myBoard) window.myBoard.reset({ background: true });
    },
    getImg: () => {
      if (window.myBoard) return window.myBoard.getImg();
    }
  }));
  const amIDrawing = playerDrawing === myPlayer().id;

  // Init: Create the drawing area when it's my turn.
  useEffect(() => {
    if (!amIDrawing || !currentWord || window.myBoard) return;

    // DrawingBoard is a global variable imported in index.html.
    var myBoard = new DrawingBoard.Board('canvas', {
      size: 10,
      webStorage: false,
      controlsPosition: 'bottom left',
      controls: [
        'Color',
        { Size: { type: "dropdown" } },
      ]
    });
    window.myBoard = myBoard;
  }, [amIDrawing, currentWord]);

  return (
    <div className='drawing-area'>
      <div id="canvas" style={{ display: amIDrawing ? "block" : "none" }} />
      <div id="picture" style={{ display: amIDrawing ? "none" : "block" }}>
        {picture && <img src={picture} alt="drawing" />}
      </div>
    </div>
  )
});

export default DrawingArea`
  },
  {
    name: "src/ChatArea/useWindowDimension.js",
    language: "javascript",
    code: `import { useState, useEffect } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
    visualViewportHeight: window.visualViewport.height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport.removeEventListener("resize", handleResize)
    }
  }, []);

  return windowDimensions;
}`
  },
  {
    name: "src/ChatArea/style.css",
    language: "css",
    code: `
.guess-input-focused{
  position: sticky;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.guess-container{
  position: absolute;
  height: 30vh;
  bottom: 0;
  width: 350px;
  z-index: 21;
  display: flex;
  flex-direction: column;
}

.guess-input-focused .guess-container{
  bottom: 20px;
}

.guesses{
  flex: 1;
  overflow-y: auto;
  --mask: linear-gradient(to top, 
  rgba(0,0,0, 1) 0,   rgba(0,0,0, 1) 40%, 
  rgba(0,0,0, 0) 95%, rgba(0,0,0, 0) 0
) 100% 50% / 100% 100% repeat-x;
  -webkit-mask: var(--mask); 
  mask: var(--mask);
  color: #000;
}

.guess-input-focused .guesses{
  background-color: #ffd3367e;
}

.guesses ul{
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
  padding-top: 3rem;
}
.guesses ul li{
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s;
}
.guesses ul li.correct{
  color: #11C85A;
}

.guesses ul li.correct span{
  background-color: #fff;
  border-radius: 20px;
  padding: 0.2rem 0.5rem;
}
.guess-input-container input{
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 1rem;
  margin-bottom: 1rem;
  line-height: 2.5;
  color: #000;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.5);
}

.guess-input-container input:disabled{
  color: #000;
}`
  },
  {
    name: "src/ChatArea/index.jsx",
    language: "javascript",
    code: `import {  useEffect, useState } from 'react'
import { myPlayer, useMultiplayerState, usePlayersState, usePlayersList } from "playroomkit";
import useWindowDimensions from './useWindowDimension';
import './style.css'

function isMobile() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return true;
  }
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function ChatArea({guesses, isCorrectGuess, amIDrawing}) {
  const players = usePlayersList();
  const dimensions = useWindowDimensions();
  const [guessIsFocused, setGuessIsFocused] = useState(false);
  const [_, setGuesses] = useMultiplayerState('guesses');
  const playersThatHaveGuessed = usePlayersState('guessed');
  const haveIGuessed = playersThatHaveGuessed.find(p => p.player.id === myPlayer().id && p.state);

  // Scroll to bottom of chat when new message is added
  useEffect(()=>{
      const guessList = document.querySelector('.guesses');
      if (guessList) guessList.scrollTop = guessList.scrollHeight;
    }, [guesses]);

  // When window is resized, check if virtual keyboard is open
  // If it is, change css class to move chat up
  useEffect(() => {
    const MIN_KEYBOARD_HEIGHT = 300;
    const isKeyboardOpen = dimensions.height - MIN_KEYBOARD_HEIGHT > window.visualViewport.height;
    if (isKeyboardOpen) {
      setGuessIsFocused(true);
    }
    else{
      setGuessIsFocused(false);
    }

    // iOS pushes the page up when the keyboard is open
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, [dimensions]);

  return (
    <div className={guessIsFocused && isMobile() ? 'guess-input-focused' : ""}>
      <div className='guess-container'>
        <div className='guesses'>
          <ul className='guess-list'>
            {guesses.map((guess, i) => {
              const player = players.find(p => p.id === guess.playerId);
              if (isCorrectGuess(guess.guess)) {
                return <li key={i} className='correct'><span><b>{player?.getProfile().name}</b> guessed correctly.</span></li>
              }
              return <li key={i}><b>{player?.getProfile().name}</b>: {guess.guess}</li>
            })}
          </ul>
        </div>
        
          <div className='guess-input-container'>
            <div className='guess-input'>
              <input type="text"
                placeholder={(!amIDrawing && !haveIGuessed) ? "Enter your guess here" : "Waiting for guesses..."}
                disabled={(amIDrawing || haveIGuessed)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const guess = e.target.value.trim();
                    if (guess === '') return;
                    e.target.value = '';
                    setGuesses([...guesses, { playerId: myPlayer().id, guess }], true);
                  }
                }} />
            </div>
          </div>
        </div>
      </div>
  )
};

export default ChatArea`
  },
  {
    name: "src/App.css",
    language: "css",
    code: `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

body{
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
  background-color: #FFD336;
  overflow: hidden;
  min-height: 100vh; 
  min-height: -webkit-fill-available;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  height: 100vh;
  padding: 1rem 0rem;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.game-container{
  max-width: 350px;
}

.header-container{
  z-index: 21;
  pointer-events: none;
  position: relative;
  margin-bottom: -2rem;
}

.header{
  display: inline-block;
  padding: 0.8rem 2rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 4px solid #000000;
  background: #555459;
  box-shadow: 0px 6px 0px #16161F, inset 0px 9px 0px #686868;
}
.header.active{
  color: #ffffff;
  background: #E79442;
  box-shadow: 0px 6px 0px #16161F, inset 0px 9px 0px #FFC286;
}

.header h3{
  margin: 0;
  font-size: 0.8rem;
}

.header.active h3{
  color: #000;
}

.header h1{
  margin: 0;
  font-size: 1.5rem;
}`
  },
  {
    name: "src/App.jsx",
    language: "javascript",
    code: `import { useState, useEffect, useRef } from 'react'
import { isHost, myPlayer, usePlayersState, usePlayersList, useMultiplayerState, getState } from "playroomkit";
import words from './words.json';
import DrawingArea from './DrawingArea';
import AvatarBar from './AvatarBar';
import ChatArea from './ChatArea';
import './App.css'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {
  const players = usePlayersList();
  const drawingAreaRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const [playerDrawing, setPlayerDrawing] = useMultiplayerState('playerDrawing', players[0]?.id);
  const playersThatHaveGuessed = usePlayersState('guessed');
  const [currentWord, setCurrentWord] = useMultiplayerState('currentWord');
  const [timer, setTimer] = useMultiplayerState('timer', 0);
  const [picture, setPicture] = useMultiplayerState('picture');
  const [guesses, setGuesses] = useMultiplayerState('guesses', []);
  const amIDrawing = playerDrawing === myPlayer().id;

  const haveIGuessed = playersThatHaveGuessed.find(p => p.player.id === myPlayer().id && p.state);

  function isCorrectGuess(guess){
    return guess.toLowerCase() === currentWord.toLowerCase();
  }

  function getNextPlayer() {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === playerDrawing) {
        return players[(i + 1) % players.length];
      }
    }
  }

  function copyImage(){
    const data = drawingAreaRef.current?.getImg();
    if (!data) return;
    setPicture(data, true);
  }
  // Host will see who has guessed correctly and will be able to move on to the next round
  useEffect(() => {
    if (isHost()) {
      const correctGuesses = guesses.filter(guess => isCorrectGuess(guess.guess));
      correctGuesses.forEach(guess => {
        const player = players.find(p => p.id === guess.playerId);
        player.setState("guessed", true);
      });
      if (correctGuesses.length === players.length - 1) {
        // Everyone has guessed correctly, change the turn to next player
        let nextPlayer = getNextPlayer();
        sleep(4000).then(() => {
          setPlayerDrawing(nextPlayer.id, true);
        });
      }
    }
  }, [guesses, currentWord]);

  // When the timer runs out
  useEffect(() => {
    if (isHost() && timer <= 0) {
      let nextPlayer = getNextPlayer();
      setPlayerDrawing(nextPlayer.id, true);
    }
  }, [timer]);

  // When the host changes the turn
  useEffect(() => {
    if (isHost()) {
      // Pick a random word and init all states
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setCurrentWord(randomWord);
      setTimer(60, true);
      
      setPicture(null, true);
      setGuesses([], true);

      // Award points to players that have guessed correctly, reset the guessed state
      players.forEach(player => {
        if (player.getState('guessed')) {
          player.setState('score', (player.getState('score') || 0) + 1);
        }
        player.setState('guessed', false);
      });
    }

    // Clear the canvas if the player is drawing
    if (amIDrawing) {
      setTimer(60);
      copyImage();
      try{
        drawingAreaRef.current.reset();
      }catch(e){}
      const intervalId = setInterval(() => {
        copyImage();
        setTimer(getState('timer') - 1, true);
      }, 1000);
      setIntervalId(intervalId);
    }
    else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [amIDrawing, drawingAreaRef]);

  if (!currentWord) return <div>Loading...</div>

  return (
    <div className='game-container'> 
      <AvatarBar />
      <div className="header-container">
        <div className={'header' + (amIDrawing? " active":"")}>
          {amIDrawing ? <h3>Your turn to draw ({timer})</h3> : <h3>Guess the word  ({timer})</h3>}
          {amIDrawing ?
            <h1>{currentWord}</h1>
            : <h1>{!haveIGuessed ? currentWord.split("").map(e => "_ ").join("") : currentWord}</h1>
          }
        </div>
      </div>
      <DrawingArea 
        ref={drawingAreaRef} 
        playerDrawing={playerDrawing} 
        currentWord={currentWord} 
        picture={picture} />
      <ChatArea 
        amIDrawing={amIDrawing} 
        guesses={guesses} 
        isCorrectGuess={isCorrectGuess} />
    </div>
  )
}

export default App`
  },
  {
    name: "src/main.jsx",
    language: "javascript",
    code: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { insertCoin } from "playroomkit";

insertCoin().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />,
  )
});`
  },
  {
    name: "index.html",
    language: "html",
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/css/drawingboard.min.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title>Draw The Thing</title>
  </head>
  <body>
    <div id="root"></div>
		<script src="/js/jquery-1.10.1.min.js"></script>
    <script src="/js/drawingboard.min.js"></script>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
  }
];
