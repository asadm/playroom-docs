import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { insertCoin } from "playroomkit";

useEffect(() => {
  window._USETEMPSTORAGE = true;
}, []);

insertCoin({
  skipLobby: true,
}).then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />,
  )
});
