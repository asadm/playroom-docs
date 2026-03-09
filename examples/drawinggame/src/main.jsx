import { createRoot } from 'react-dom/client';
import App from './App.jsx'
import { insertCoin } from "playroomkit";

insertCoin({
  skipLobby: true,
}).then(() => {
  createRoot(document.getElementById('root')).render(
    <App />,
  )
});
