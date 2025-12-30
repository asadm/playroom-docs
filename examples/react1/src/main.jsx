import { createRoot } from "react-dom/client";
import { insertCoin } from "playroomkit";
import "./index.css";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));

insertCoin({
  gameId: "d8iBEGkR64p3088q5ZDH"
}).then(() => {
  root.render(
    // <StrictMode>
      <App />
    // </StrictMode>
  );
});
