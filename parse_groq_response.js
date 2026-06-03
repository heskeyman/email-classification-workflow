var item = $input.item.json;
var department = "Other";
var confidence = 0;
var reason = "Could not parse response";

try {
  var rawText = "";

  if (item.choices && item.choices[0] && item.choices[0].message) {
    rawText = item.choices[0].message.content || "";
  }

  rawText = rawText.replace(/```json/g, "");
  rawText = rawText.replace(/```/g, "");
  rawText = rawText.trim();

  var parsed = JSON.parse(rawText);
  department = parsed.department || "Other";
  confidence = parsed.confidence || 0;
  reason = parsed.reason || "";
} catch (e) {
  department = "Other";
  confidence = 0;
  reason = "Parse error";
}

var validDepts = ["Sales","Customer Service","Human Resources","Finance","Operations","Other"];
var isValid = false;
for (var i = 0; i < validDepts.length; i++) {
  if (validDepts[i] === department) { isValid = true; }
}
if (!isValid) { department = "Other"; }

// FIXED: Pull original email data from the Build AI Request node
var buildNode = $("Build AI Request").item.json;

return {
  json: {
    messageId: buildNode.messageId || "",
    threadId: buildNode.threadId || "",
    sender: buildNode.sender || "",
    senderName: buildNode.senderName || "",
    subject: buildNode.subject || "",
    body: buildNode.body || "",
    receivedAt: buildNode.receivedAt || "",
    classification: {
      department: department,
      confidence: confidence,
      method: "AI (Groq - Llama 3.1)",
      reason: reason
    }
  }
};
