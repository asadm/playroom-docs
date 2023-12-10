import imgPlayroom from "./assets/logo-playroom.png";
import imgReadyPlayerMe from "./assets/logo-rpm.png";

function Lobby({onJoinOrCreateRoom}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-4xl font-bold">Ready<br/>Rooms</div>
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
      <div className="absolute bottom-3 text-xs gap-2 flex items-center">
        
          <img src={imgReadyPlayerMe} alt="Ready Player Me" style={{height: '40px'}}/>
           <b>x</b>
          <img src={imgPlayroom} alt="Playroom" style={{height: '20px'}}/>
      </div>
    </div>
  );
}

export default Lobby;