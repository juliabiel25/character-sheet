import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme
      appearance="dark"
      accentColor="violet"
      grayColor="mauve"
      radius="full"
    >
      <App />
    </Theme>
  </StrictMode>
);
