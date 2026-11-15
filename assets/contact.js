const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const button = form.querySelector("button");
const endpoint = form.getAttribute("action");
const configured = /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint ?? "");

if (configured) {
  button.disabled = false;
  status.textContent = "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!configured || button.disabled) return;

  const fields = new FormData(form);
  for (const name of ["name", "email", "subject", "message"]) {
    const value = fields.get(name).trim();
    if (!value) {
      status.textContent = "Please complete every field.";
      form.elements.namedItem(name).focus();
      return;
    }
    fields.set(name, value);
  }
  if (fields.get("_gotcha")) {
    status.textContent = "Submission blocked. You can email Shubham directly.";
    return;
  }

  button.disabled = true;
  button.textContent = "Sending…";
  status.textContent = "Submitting your message…";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fields,
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error("Submission was rejected");
    form.reset();
    status.textContent = "Your message was accepted by the contact service. Thank you.";
  } catch {
    status.textContent = "We couldn't confirm your submission. You can retry or email Shubham directly.";
  } finally {
    button.disabled = false;
    button.textContent = "Send message";
  }
});
