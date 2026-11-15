const form = document.querySelector("#contact-form");
const endpoint = form.getAttribute("action");
const configured = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(endpoint);
const status = document.querySelector("#form-status");
if (configured) {
  form.querySelector('button[type="submit"]').disabled = false;
  status.textContent = "You can submit once per email address.";
} else {
  const emailLink = document.createElement("a");
  emailLink.className = "button";
  emailLink.href = "mailto:shubhampipig@gmail.com";
  emailLink.textContent = "Write an email";
  form.replaceChildren(status, emailLink);
}
