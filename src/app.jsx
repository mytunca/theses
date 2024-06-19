import { useEffect, useRef, useState } from "preact/hooks";
import { Dialog } from './components/Dialog';

export function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuInjected, setMenuInjected] = useState(false);
  const dialogContainerRef = useRef(null); // Dialog için ref oluştur

  useEffect(() => {
    function injectMenu() {
      const ulElement = document.querySelector("#navigation2 ul");
      if (ulElement) {
        const cssRule = `.w3-green, .w3-hover-green:hover {color: #fff!important;background-color: #1f883d!important;} .w3-container:after,.w3-container:before,.w3-panel:after,.w3-panel:before,.w3-row:after,.w3-row:before,.w3-row-padding:after,.w3-row-padding:before, .w3-cell-row:before,.w3-cell-row:after,.w3-clear:after,.w3-clear:before,.w3-bar:before,.w3-bar:after{content:"";display:table;clear:both} .w3-container,.w3-panel{padding:0.01em 16px}.w3-panel{margin-top:16px;margin-bottom:16px} .w3-grey,.w3-hover-grey:hover,.w3-gray,.w3-hover-gray:hover{color:#000!important;background-color:#9e9e9e!important} .github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0 %, 100 % { transform: rotate(0) }20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github - corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}`;
        document.head.appendChild(document.createElement("style")).innerHTML = cssRule;

        const menuContainer = document.createElement("li");
        menuContainer.className = "menu w3-green";
        menuContainer.onclick = () => setDialogOpen(true);
        menuContainer.innerHTML = '<a style="color: #FFF">Veri İndir</a>';
        ulElement.appendChild(menuContainer);
        setMenuInjected(true);
      }
    }

    injectMenu();
  }, []);

  const zub = window["zub"];

  return (
    <div ref={dialogContainerRef}>
      {menuInjected && <Dialog open={dialogOpen} container={zub(dialogContainerRef.current)} handleClose={() => setDialogOpen(false)} />}
    </div>
  );
}
