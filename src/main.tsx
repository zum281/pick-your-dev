import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store.ts";
import { Routes } from "./routes";
import { Layout } from "./components/Layout";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <Layout>
        <Routes />
      </Layout>
      <Analytics />
    </ReduxProvider>
  </StrictMode>,
);
