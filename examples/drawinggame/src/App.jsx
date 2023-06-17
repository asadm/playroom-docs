import { useState, useEffect, useRef } from 'react'
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

export default App
