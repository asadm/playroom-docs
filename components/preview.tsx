// Example from https://beta.reactjs.org/learn
import useWindowDimensions from './useWindowDimensions'
import { useEffect, useRef, useState } from 'react'
import styles from './preview.module.css'

export default function Preview({src}) {
  const { width, height } = useWindowDimensions();
  const iframeRef = useRef(null);
  const [joinedIframes, setJoinedIframes] = useState(0);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setUrl(iframeRef.current.contentWindow.location.href);
    }, 2000);
  }, []);
    return (
    <div>
      <FakeBrowser url={url} onClose={()=>{
        setJoinedIframes(Math.max(0, joinedIframes - 1));
      }}>
      <iframe 
        ref={iframeRef} width="550" height="550" style={{
        transform: `scale(${Math.min(1, width / 550)})`
        // borderRadius: "23px", 
        // margin: "20px 0px",
        }} src={src}></iframe>
      </FakeBrowser>
        {new Array(joinedIframes).fill(0).map((_, i) => (
          <FakeBrowser url={url} onClose={()=>{
            setJoinedIframes(Math.max(0, joinedIframes - 1));
          }}>
            <iframe 
            key={i}
            width="550" height="550" style={{
            transform: `scale(${Math.min(1, width / 550)})`
            // borderRadius: "23px",
            // margin: "20px 0px",
            }} src={url}></iframe>
          </FakeBrowser>
        ))}
      <a className={styles.btnNew}
      onClick={()=>{
        setJoinedIframes(joinedIframes + 1);
      }}>
        + Add a Player
      </a>
    </div>
  )
}

function FakeBrowser({ url, onClose, children }) {
  return (
    <div className={styles.browser}>
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
