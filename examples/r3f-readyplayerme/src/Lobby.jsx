import imgLogo from "./assets/logo-rr.svg";
import imgReadyPlayerMe from "./assets/bottom-logo.svg";

function Lobby({onJoinOrCreateRoom}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-4xl font-bold">
        <img src={imgLogo} alt="Ready Rooms" style={{height: '80px'}}/>
      </div>
      <div className="text-md mt-1">OPEN HANGOUT SPACES</div>
      <div className="flex mt-20">
        <button className="rounded-lg px-3 py-2 m-3" style={{backgroundColor: "#A2DCBB"}} onClick={()=> onJoinOrCreateRoom()}>New room</button>
        <button className="rounded-lg px-3 py-2 m-3" style={{backgroundColor: "#ccc"}} onClick={()=> {
          const roomCode = prompt("Enter room code");
          if (roomCode) {
            onJoinOrCreateRoom(roomCode);
          }
        }}>Join room</button>
      </div>
      <div className="absolute bottom-5 text-xs gap-2 flex items-center">
          <img src={imgReadyPlayerMe} alt="Ready Player Me x Playroom" style={{height: '40px'}}/>
      </div>
    </div>
  );
}

export default Lobby;