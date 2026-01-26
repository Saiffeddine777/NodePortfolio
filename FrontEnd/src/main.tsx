import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Store } from "./app/Store.ts";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
createRoot(document.getElementById("root")!).render(
  <GoogleReCaptchaProvider
    reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
  >
    <StrictMode>
      <Provider store={Store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>
  </GoogleReCaptchaProvider>
);
