import { useState } from "react";
import { RoomContext } from "./RoomContext";

export default function RoomProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHost, setIsHost] = useState(false);

  const value = {
    room,
    setRoom,
    members,
    setMembers,
    currentUser,
    setCurrentUser,
    isHost,
    setIsHost,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
