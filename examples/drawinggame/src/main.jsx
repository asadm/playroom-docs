import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { insertCoin } from "playroomkit";

insertCoin().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />,
  )
});
