for (const carousel of document.querySelectorAll("[data-carousel]")) {
  const rail = carousel.querySelector(".rail");
  const controls = carousel.querySelector(".rail-controls");
  controls.hidden = false;
  const move = (direction) => {
    const card = rail.firstElementChild;
    const gap = parseFloat(getComputedStyle(rail).columnGap);
    rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap) });
  };
  const previous = controls.querySelector("[data-prev]");
  const next = controls.querySelector("[data-next]");
  const update = () => {
    previous.disabled = rail.scrollLeft < 2;
    next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  rail.addEventListener("scroll", update, { passive: true });
  new ResizeObserver(update).observe(rail);
  update();
}

const catalog = document.querySelector("#catalog");
if (catalog) {
  const controls = catalog.querySelector(".catalog-controls");
  const search = catalog.querySelector("#catalog-search");
  const category = catalog.querySelector("#catalog-category");
  const cards = [...catalog.querySelectorAll("[data-category]")];
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards) {
      const matches = (!category.value || card.dataset.category === category.value)
        && card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visible++;
    }
    catalog.querySelector("#catalog-count").textContent = `${visible} of ${cards.length} applications`;
  };
  controls.hidden = false;
  search.addEventListener("input", filter);
  category.addEventListener("change", filter);
  filter();
}

const journalSearch = document.querySelector("#journal-search");
if (journalSearch) {
  const entries = document.querySelectorAll("#journal-links li");
  journalSearch.addEventListener("input", () => {
    const query = journalSearch.value.trim().toLowerCase();
    for (const entry of entries) entry.hidden = !entry.textContent.toLowerCase().includes(query);
  });
}

const noteForm = document.querySelector("[data-note]");
if (noteForm) {
  const note = noteForm.querySelector("textarea");
  const status = noteForm.querySelector("[role=status]");
  const key = `shubh-ai:note:${location.pathname}`;
  try {
    note.value = localStorage.getItem(key) || "";
  } catch {
    status.textContent = "Local storage is unavailable in this browser.";
  }
  noteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!note.value.trim()) {
      status.textContent = "Enter a note before saving.";
      return;
    }
    try {
      localStorage.setItem(key, note.value.trim());
      status.textContent = "Saved on this device.";
    } catch {
      status.textContent = "Your browser could not save this note.";
    }
  });
}

const guide = [
  ["contact", /^(?:(?:how (?:can|do) i |kaise )?(?:contact|reach)(?: shubham| shubh ai| karu)?|(?:shubham(?: pandey)? )?(?:(?:ka|ki) )?(?:email(?: address)?|phone(?: number)?|number|contact details))$/, "Email shubhamgkpp@gmail.com or call +91 8953620607.", "contact.html"],
  ["developer", /^(?:who (?:is|built) (?:shubham(?: pandey)?|shubh ai)|(?:about )?shubham(?: pandey)?|developer|shubham kaun hai)$/, "Shubham Pandey is a full stack developer based in Gorakhpur, India.", "about.html#developer"],
  ["projects", /^(?:projects|portfolio|(?:show me |what are )?(?:shubham(?: pandey)?(?:'s)?|shubh ai) projects)$/, "Explore the SHUBH AI website and browser-based text analyzer in the portfolio.", "about.html#projects"],
  ["site", /^(?:what is shubh ai|about shubh ai|shubh ai|website|about this (?:site|website))$/, "SHUBH AI is Shubham Pandey’s independent AI learning site and developer portfolio.", "index.html"],
];
const launch = document.querySelector(".chat-launch");
const chat = document.querySelector("#learning-chat");
const chatForm = chat.querySelector("form");
const query = chatForm.elements.query;
const history = chat.querySelector(".chat-history");
function setChat(open) {
  chat.hidden = !open;
  launch.hidden = open;
  launch.setAttribute("aria-expanded", String(open));
  (open ? query : launch).focus();
}
launch.hidden = false;
launch.addEventListener("click", () => setChat(true));
chat.querySelector("[data-chat-close]").addEventListener("click", () => setChat(false));
chat.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setChat(false);
});
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (chatForm.querySelector("button").disabled) return;
  const question = query.value.trim();
  if (!question) return;
  const userEntry = document.createElement("p");
  userEntry.textContent = `You: ${question}`;
  const reply = document.createElement("p");
  const normalized = question.toLowerCase().replace(/[?!.,]+$/g, "").replace(/\s+/g, " ").trim();
  const result = guide.find(([, pattern]) => pattern.test(normalized));
  history.append(userEntry, reply);
  history.scrollTop = history.scrollHeight;
  chatForm.reset();
  if (!result) {
    reply.textContent = "Ask about SHUBH AI, Shubham Pandey, projects, or contact details. Try “contact” or “projects”.";
    return;
  }

  const submit = chatForm.querySelector("button");
  submit.disabled = true;
  reply.textContent = "Looking up the site details…";
  let answer = result[2];
  let source = "Site guide";
  try {
    if (location.protocol === "file:" || location.hostname.endsWith(".github.io")) {
      throw new Error("Static preview");
    }
    const response = await fetch("api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: result[0] }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) {
      const data = await response.json();
      if (typeof data.answer === "string" && data.answer.trim()) {
        answer = data.answer;
        source = data.source === "Groq" ? "Groq" : "Site guide";
      }
    }
  } catch {
    // The site guide also works on static hosting or when the backend is unavailable.
  } finally {
    submit.disabled = false;
  }
  reply.textContent = `${source}: ${answer} `;
  const more = document.createElement("a");
  more.href = result[3];
  more.textContent = "Open page";
  reply.append(more);
  history.scrollTop = history.scrollHeight;
});
for (const widget of document.querySelectorAll("[data-tabs]")) {
  const list = widget.querySelector("[role=tablist]");
  const tabs = [...list.querySelectorAll("[role=tab]")];
  const activate = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  };
  tabs.forEach((tab, i) => tab.addEventListener("click", () => activate(i)));
  list.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(event.target);
    const offsets = { ArrowRight: 1, ArrowLeft: -1 };
    if (!(event.key in offsets) && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
      : (index + offsets[event.key] + tabs.length) % tabs.length;
    activate(next, true);
  });
  list.hidden = false;
  activate(0);
}
