import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";

export default function Looby() {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, roomId });
    },
    [email, roomId, socket]
  );

  const handelJoinRoom = useCallback(
    (data) => {
      const { email, roomId } = data;
      navigate(`/room/${roomId}?email=${email}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handelJoinRoom);
    return () => {
      socket.off("room:join", handelJoinRoom);
    };
  }, [socket, handelJoinRoom]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Join a Room</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="roomId"
              className="text-sm font-medium text-gray-700"
            >
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium transition-all"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
