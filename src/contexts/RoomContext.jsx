import { createContext, useContext } from "react";

export const RoomContext = createContext(undefined);

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoom은 RoomProvider 안에서 사용해야 합니다.");
  }
  return context;
}
