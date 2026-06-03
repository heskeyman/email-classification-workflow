var item = $input.item.json;

// Gmail Trigger can use UPPERCASE or lowercase field names
// Check both formats

// --- SENDER ---
var sender = "unknown";
var senderName = "";

if (item.From) {
  var fromStr = item.From;
  var emailMatch = fromStr.match(/<([^>]+)>/);
  if (emailMatch) {
    sender = emailMatch[1];
  } else {
    sender = fromStr;
  }
  var nameMatch = fromStr.match(/^([^<]+)</);
  if (nameMatch) {
    senderName = nameMatch[1].trim();
  }
} else if (item.from && typeof item.from === "object" && item.from.value && item.from.value[0]) {
  sender = item.from.value[0].address || "unknown";
  senderName = item.from.value[0].name || "";
} else if (item.from && typeof item.from === "string") {
  sender = item.from;
}

// --- SUBJECT ---
var subject = item.Subject || item.subject || "(no subject)";

// --- BODY ---
var body = "";

if (item.textPlain) {
  body = item.textPlain;
} else if (item.text) {
  body = item.text;
} else if (item.snippet) {
  body = item.snippet;
} else if (item.textHtml) {
  var html = item.textHtml;
  html = html.replace(/<[^>]+>/g, " ");
  html = html.replace(/&nbsp;/g, " ");
  html = html.replace(/&amp;/g, "&");
  html = html.replace(/&lt;/g, "<");
  html = html.replace(/&gt;/g, ">");
  html = html.replace(/&#39;/g, "'");
  body = html.replace(/\s+/g, " ").trim();
}

if (body.length > 3000) {
  body = body.substring(0, 3000);
}

// --- SKIP BOUNCE EMAILS ---
var senderLower = sender.toLowerCase();
var subjectLower = subject.toLowerCase();

var isBounce = false;
if (senderLower.indexOf("mailer-daemon") !== -1) { isBounce = true; }
if (senderLower.indexOf("postmaster") !== -1) { isBounce = true; }
if (subjectLower.indexOf("delivery status") !== -1) { isBounce = true; }
if (subjectLower.indexOf("undeliverable") !== -1) { isBounce = true; }
if (subjectLower.indexOf("delivery failed") !== -1) { isBounce = true; }
if (subjectLower.indexOf("returned mail") !== -1) { isBounce = true; }

var messageId = item.id || "";
var threadId = item.threadId || "";

return {
  json: {
    skipEmail: isBounce,
    messageId: messageId,
    threadId: threadId,
    sender: sender.toLowerCase(),
    senderName: senderName,
    subject: subject,
    body: body,
    fullText: (subject + " " + body).toLowerCase(),
    receivedAt: new Date().toISOString()
  }
};
