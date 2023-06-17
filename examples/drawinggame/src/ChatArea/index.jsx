import {  useEffect, useState } from 'react'
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

export default ChatArea
