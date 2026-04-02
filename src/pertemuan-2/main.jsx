import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./custom.css";
import HelloWorld from "./HelloWorld.jsx";
import Container from "./Container.jsx";

createRoot(document.getElementById("root")).render(
  <div>
    <Container>
      <HelloWorld />
    </Container>
  </div>,
);
