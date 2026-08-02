import React, { useState } from "react";
import Kitaaba from "./Kitaaba.jsx";
import WriteEditor from "./WriteEditor.jsx";

export default function App() {
  const [view, setView] = useState("home"); // "home" | "write"

  if (view === "write") {
    return <WriteEditor onBack={() => setView("home")} />;
  }
  return <Kitaaba onStartWriting={() => setView("write")} />;
}
