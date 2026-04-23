import { createRoot } from "react-dom/client";
import "./tailwind.css";
// PASTIIN importnya ke file yang ada Search-nya
import FrameworkListSerchFilter from "./FrameworkListSearchFilter"; 

createRoot(document.getElementById("root")).render(
  <FrameworkListSerchFilter />
);