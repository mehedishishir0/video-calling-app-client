import React, { useCallback, useEffect } from "react";
import { useSocket } from "../context/socketProvider";
import ReactPlayer from "react-player"

const Room = () => {
  const socket = useSocket();
  const [remotSocketId, setRemoteSocketId] = React.useState(null);
  const [myStream, setMyStream] = React.useState(null);

  const handelUserJoin = useCallback(({ email, roomId }) => {
    console.log("user joined ", email, roomId);
    setRemoteSocketId(roomId);
  }, []);

  const handelCalluser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
    setMyStream(stream);
  },[])

  useEffect(() => {
    socket.on("user:join", handelUserJoin);

    return () => {
      socket.off("user:join", handelUserJoin);
    };
  }, [socket, handelUserJoin]);

  return (
    <div>
      <h1>{remotSocketId ? "connected" : "not connected"}</h1>
      {remotSocketId && <button onClick={handelCalluser}>Call</button>}
      {myStream && <ReactPlayer playing={true} muted={true} width={400} height={300} url={myStream} />}
    </div>
  );
};

export default Room;
