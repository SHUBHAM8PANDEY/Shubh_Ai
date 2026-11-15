document.documentElement.classList.add("js");
const menu = document.querySelector(".menu");
const nav = document.querySelector("#navigation");
const mobile = matchMedia("(max-width: 680px)");

function setMenu(open) {
  nav.hidden = mobile.matches && !open;
  menu.setAttribute("aria-expanded", String(!nav.hidden));
}

setMenu(false);
mobile.addEventListener("change", () => setMenu(false));
menu.addEventListener("click", () => setMenu(nav.hidden));
nav.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobile.matches) {
    setMenu(false);
    menu.focus();
  }
});

const tool = document.querySelector("#text-tool");
if (tool) {
  tool.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = tool.elements.sample.value.trim();
    const words = value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu) || [];
    const count = [...value].length;
    document.querySelector("#text-result").textContent =
      `${words.length} words · ${count} Unicode code points · ${Math.ceil(words.length / 200)} min estimated reading time`;
  });
}
