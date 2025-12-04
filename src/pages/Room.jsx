// import React, { useCallback, useEffect } from "react";
// import { useSocket } from "../context/socketProvider";
// import ReactPlayer from "react-player";
// import PeerService from "../services/peer";
// import peer from "../services/peer";

// const Room = () => {
//   const socket = useSocket();
//   const [remotSocketId, setRemoteSocketId] = React.useState(null);
//   const [myStream, setMyStream] = React.useState(null);

//   const handelUserJoin = useCallback(({ email, roomId }) => {
//     console.log("user joined ", email, roomId);
//     setRemoteSocketId(roomId);
//   }, []);

//   const handelCalluser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     const offer = await PeerService.getOffer();
//     socket.emit("user:call", { to: remotSocketId, offer });

//     setMyStream(stream);
//   }, [remotSocketId, socket]);

//   const handelIncommingCall = useCallback(
//     async ({ from, offer }) => {
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       console.log("incomming call from ", from, offer);
//       const answerCall = await peer.getAnswer(offer);
//       setMyStream(stream);
//       socket.emit("call:accepted", { to: from, answer: answerCall });
//     },
//     [myStream, socket]
//   );

//   const handelCallAccepted = useCallback(
//     async ({ from, answer }) => {
//       console.log(from,)
//      peer.setLocalDescription(answer);
//      console.log("call accepted from ", from, answer);
//     },
//     [socket]
//   );

//   useEffect(() => {
//     socket.on("user:join", handelUserJoin);
//     socket.on("incomming:call", handelIncommingCall);
//     socket.on("call:accepted", handelCallAccepted);




//     return () => {
//       socket.off("user:join", handelUserJoin);
//       socket.off("incomming:call", handelIncommingCall);
//       socket.off("call:accepted", handelCallAccepted);
//     };
//   }, [socket, handelUserJoin, handelIncommingCall, handelCallAccepted]);

//   return (
//     <div>
//       <h1>{remotSocketId ? "connected" : "not connected"}</h1>
//       {remotSocketId && <button onClick={handelCalluser}>Call</button>}
//       {myStream && (
//         <ReactPlayer
//           playing={true}
//           muted={true}
//           width={400}
//           height={300}
//           url={myStream}
//         />
//       )}
//     </div>
//   );
// };

// export default Room;


import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import ReactPlayer from "react-player";
import PeerService from "../services/peer";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // When someone joins
  const handleUserJoin = useCallback(({ email, roomId }) => {
    console.log("User joined →", email, roomId);
    setRemoteSocketId(roomId);
  }, []);

  // CALL BUTTON click
  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMyStream(stream);

    await PeerService.addStream(stream);

    const offer = await PeerService.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  // Someone calls you
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMyStream(stream);
      await PeerService.addStream(stream);

      const answer = await PeerService.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  // Call accepted (caller side receives answer)
  const handleCallAccepted = useCallback(
    async ({ from, answer }) => {
      console.log("Call accepted →", from);
      await PeerService.setRemoteAnswer(answer);
    },
    []
  );

  // Remote stream listener
  useEffect(() => {
    PeerService.peer.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };
  }, []);

  useEffect(() => {
    socket.on("user:join", handleUserJoin);
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);

    return () => {
      socket.off("user:join", handleUserJoin);
      socket.off("incomming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
    };
  }, [socket, handleUserJoin, handleIncomingCall, handleCallAccepted]);

  return (
    <div>
      <h1>{remoteSocketId ? "Connected" : "Waiting for user…"}</h1>

      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {myStream && (
          <ReactPlayer
            playing
            muted
            width={300}
            height={200}
            url={myStream}
          />
        )}

        {remoteStream && (
          <ReactPlayer
            playing
            width={300}
            height={200}
            url={remoteStream}
          />
        )}
      </div>
    </div>
  );
};

export default Room;
