// Example from https://beta.reactjs.org/learn
import useWindowDimensions from './useWindowDimensions'
import { useEffect, useRef, useState } from 'react'
import styles from './preview.module.css'

export default function Preview({src, maxPlayers=4, newWindow}) {
  const { width, height } = useWindowDimensions();
  const iframeRef = useRef(null);
  const [joinedIframes, setJoinedIframes] = useState(0);
  const [url, setUrl] = useState("");

  const scale = 1; //Math.min(1, width / (550+(width*0.28)));

  useEffect(() => {
    setTimeout(() => {
      setUrl(iframeRef.current?.contentWindow.location.href || "");
    }, 2000);
  }, []);
    return (
    <div className={styles.container}>
      <FakeBrowser scale={scale} url={url} onClose={()=>{
        setJoinedIframes(Math.max(0, joinedIframes - 1));
      }}>
        {newWindow && 
        <div className={styles.newWindowCTA}>
          <a href={src} target='_blank'>Open in new window ↗</a>
        </div>}
      {!newWindow && <iframe 
        ref={iframeRef} width="340" height="650" style={{
        // transform: `scale(${Math.min(1, width / 650)})`
        // borderRadius: "23px", 
        // margin: "20px 0px",
        }} src={src}></iframe>}
      </FakeBrowser>
        {new Array(joinedIframes).fill(0).map((_, i) => (
          <FakeBrowser scale={scale} url={url} onClose={()=>{
            setJoinedIframes(Math.max(0, joinedIframes - 1));
          }}>
            <iframe 
            key={i}
            width="340" height="650" style={{
            // borderRadius: "23px",
            // margin: "20px 0px",
            }} src={url}></iframe>
          </FakeBrowser>
        ))}
      {!newWindow && joinedIframes<maxPlayers &&
      <a className={styles.btnNew}
      // style={{transform: `scale(${scale})`, transformOrigin: "top left"}}
      onClick={()=>{
        setJoinedIframes(joinedIframes + 1);
      }}>
        + Add a Player
      </a>}
    </div>
  )
}

function FakeBrowser({ url, onClose, children, scale }) {
  return (
    <div 
      style={{transform: `scale(${scale})`, transformOrigin: "top left"}}
      className={styles.browser}>
      <div className={styles.browserNavigationBar}>
        <i onClick={onClose}></i><i></i><i></i>
        {/* <input value={url} disabled /> */}
      </div>

      <div className={styles.browserContainer}>
        {children}
      </div>
    </div>
  )
}
