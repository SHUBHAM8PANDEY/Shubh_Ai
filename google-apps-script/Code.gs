const INBOX = "shubhampipig@gmail.com";
const CONTACT_PAGE = "https://shubham8pandey.github.io/Shubh_Ai/contact.html";
const LEDGER = "SHUBH AI contact ledger";

function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet) throw new Error("Open Apps Script from your contact Google Sheet.");
  const ledger = sheet.getSheetByName(LEDGER) || sheet.insertSheet(LEDGER);
  if (!ledger.getLastRow()) ledger.appendRow(["Email fingerprint", "Status", "Received at"]);
  PropertiesService.getScriptProperties().setProperty("CONTACT_SHEET_ID", sheet.getId());
  MailApp.getRemainingDailyQuota();
}

function doPost(event) {
  const data = event?.parameter || {};
  if (data._gotcha) return result("Message blocked", "The spam check rejected this submission.");
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();
  if (!name || name.length > 120 || !subject || subject.length > 160 ||
      !message || message.length > 4000 || email.length > 254 ||
      !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
    return result("Check your details", "Enter a valid email, name, subject and message.");
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return result("Please retry", "The form is busy. Please try again shortly.");
  try {
    const id = PropertiesService.getScriptProperties().getProperty("CONTACT_SHEET_ID");
    const ledger = SpreadsheetApp.openById(id).getSheetByName(LEDGER);
    const hash = fingerprint(email);
    const count = ledger.getLastRow() - 1;
    const existing = count > 0 && ledger.getRange(2, 1, count, 1)
      .createTextFinder(hash).matchEntireCell(true).findNext();
    if (existing) {
      const state = ledger.getRange(existing.getRow(), 2).getValue();
      return state === "sent"
        ? result("Already submitted", "This email address has already sent a message. You can follow up directly by email.")
        : result("Delivery unconfirmed", "A submission from this email is already recorded. Please follow up directly by email.");
    }
    if (MailApp.getRemainingDailyQuota() < 1) {
      return result("Try again later", "The daily email limit has been reached. You can also email Shubham directly.");
    }
    ledger.appendRow([hash, "pending", new Date()]);
    const row = ledger.getLastRow();
    SpreadsheetApp.flush();
    MailApp.sendEmail({
      to: INBOX,
      replyTo: email,
      subject: "SHUBH AI: " + subject.replace(/[\r\n]+/g, " "),
      body: "From: " + name + " <" + email + ">\n\n" + message,
    });
    ledger.getRange(row, 2).setValue("sent");
    SpreadsheetApp.flush();
    return result("Message sent", "Google accepted your message for delivery.");
  } catch {
    return result("Delivery unconfirmed", "Please email Shubham directly if you need to make sure your message arrives.");
  } finally {
    lock.releaseLock();
  }
}

function fingerprint(email) {
  const [local, domain] = email.split("@");
  const canonical = /^(gmail|googlemail)\.com$/.test(domain)
    ? local.split("+")[0].replace(/\./g, "") + "@gmail.com"
    : email;
  return "sha256:" + Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, canonical)
    .map(byte => (byte & 255).toString(16).padStart(2, "0")).join("");
}

function result(title, message) {
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><meta charset="utf-8"><title>' + title +
    '</title><main><h1>' + title + '</h1><p>' + message +
    '</p><p><a target="_top" href="' + CONTACT_PAGE + '">Back to SHUBH AI</a> · ' +
    '<a href="mailto:' + INBOX + '">Email Shubham</a></p></main></html>'
  ).addMetaTag("viewport", "width=device-width, initial-scale=1");
}
