import { render } from "preact";
import { App } from "./app";

function renderApp() {
  if (
    window.location.hostname !== "tez.yok.gov.tr" ||
    window.location.pathname !== "/UlusalTezMerkezi/tezSorguSonucYeni.jsp"
  ) {
    return alert(
      "Bu araç yalnızca https://tez.yok.gov.tr/UlusalTezMerkezi/tezSorguSonucYeni.jsp adresinde çalışır."
    );
  }

  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);
  render(<App />, appContainer);
}

if (document.readyState === "loading") {
  window.addEventListener("load", renderApp);
} else {
  renderApp();
}
