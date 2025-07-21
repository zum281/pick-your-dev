import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store.ts";
import { Routes } from "./routes";
import { Layout } from "./components/Layout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <Layout>
        <Routes />
      </Layout>
    </ReduxProvider>
  </StrictMode>,
);
