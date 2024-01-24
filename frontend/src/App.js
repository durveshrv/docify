import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TextEditor from "./TextEditor";
import Logout from "./components/logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/editor"
          element={<Navigate to={`/documents/${uuidV4()}`} />}
        />
        <Route path="/documents/:id" element={<TextEditor />} />
        <Route path="/users/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
