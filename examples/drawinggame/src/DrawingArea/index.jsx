import {  useEffect, useImperativeHandle, forwardRef } from 'react'
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

export default DrawingArea
