import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomProvider from "./contexts/RoomProvider";
import Layout from "./components/common/Layout";
import Home from "./pages/Home";
import CreateRoom from "./pages/CreateRoom";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </RoomProvider>
    </BrowserRouter>
  );
}

export default App;
