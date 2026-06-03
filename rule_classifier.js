var item = $input.item.json;
var fullText = item.fullText;
var sender = item.sender;
var subject = item.subject.toLowerCase();

var salesKw = ["buy","purchase","order","pricing","price","quote","quotation",
  "discount","deal","offer","proposal","contract","subscription",
  "upgrade","demo","trial","wholesale","retail","partnership",
  "promotion","catalog","negotiate","bid"];
var salesSender = ["sales@","partner@","vendor@","business@"];
var salesSubject = ["order","quote","pricing","proposal","deal","purchase"];

var csKw = ["complaint","issue","problem","broken","defective","return",
  "refund","exchange","help","support","damaged","warranty",
  "feedback","disappointed","unhappy","frustrated","resolve",
  "escalate","ticket","tracking","assistance"];
var csSender = ["support@","help@","customer@","service@"];
var csSubject = ["complaint","issue","help","support","return","refund"];

var hrKw = ["job","resume","cv","interview","hiring","recruit","vacancy",
  "application","candidate","onboarding","employee","payroll",
  "leave","vacation","benefits","insurance","termination",
  "resignation","training","internship","salary","compensation",
  "workplace","attendance","career"];
var hrSender = ["hr@","careers@","recruiting@","jobs@","talent@"];
var hrSubject = ["job","application","resume","interview","hiring","leave","employee"];

var finKw = ["invoice","payment","billing","account","tax","budget",
  "expense","reimbursement","receipt","financial","audit",
  "profit","loss","balance","ledger","accounting","payable",
  "receivable","credit","debit","bank","transfer","fiscal",
  "expenditure","procurement"];
var finSender = ["finance@","billing@","accounts@","accounting@","payable@"];
var finSubject = ["invoice","payment","billing","budget","expense","tax","financial"];

var opsKw = ["logistics","shipping","warehouse","inventory",
  "delivery","dispatch","fleet","maintenance","equipment",
  "facility","production","manufacturing","safety","compliance",
  "regulation","inspection","schedule","shift","operations",
  "stock","fulfillment","distribution","transport","freight"];
var opsSender = ["ops@","operations@","logistics@","warehouse@","shipping@"];
var opsSubject = ["shipping","delivery","inventory","maintenance","logistics","warehouse"];

function scoreList(text, list) {
  var s = 0;
  var m = [];
  for (var i = 0; i < list.length; i++) {
    if (text.indexOf(list[i]) !== -1) { s = s + 1; m.push(list[i]); }
  }
  return { score: s, matched: m };
}

function scoreSender(addr, patterns) {
  var s = 0;
  var m = [];
  for (var i = 0; i < patterns.length; i++) {
    if (addr.indexOf(patterns[i]) !== -1) { s = s + 3; m.push(patterns[i]); }
  }
  return { score: s, matched: m };
}

function scoreSubject(subj, patterns) {
  var s = 0;
  var m = [];
  for (var i = 0; i < patterns.length; i++) {
    if (subj.indexOf(patterns[i]) !== -1) { s = s + 2; m.push(patterns[i]); }
  }
  return { score: s, matched: m };
}

var departments = [
  { name: "Sales", kw: salesKw, sp: salesSender, su: salesSubject },
  { name: "Customer Service", kw: csKw, sp: csSender, su: csSubject },
  { name: "Human Resources", kw: hrKw, sp: hrSender, su: hrSubject },
  { name: "Finance", kw: finKw, sp: finSender, su: finSubject },
  { name: "Operations", kw: opsKw, sp: opsSender, su: opsSubject }
];

var scores = {};
var allMatched = {};
var maxScore = 0;
var bestDept = "Unknown";

for (var d = 0; d < departments.length; d++) {
  var dept = departments[d];
  var kwR = scoreList(fullText, dept.kw);
  var spR = scoreSender(sender, dept.sp);
  var suR = scoreSubject(subject, dept.su);
  var total = kwR.score + spR.score + suR.score;
  scores[dept.name] = total;
  allMatched[dept.name] = kwR.matched.concat(spR.matched).concat(suR.matched);
  if (total > maxScore) { maxScore = total; bestDept = dept.name; }
}

var totalAll = 0;
for (var key in scores) { totalAll = totalAll + scores[key]; }
var confidence = 0;
if (totalAll > 0) { confidence = Math.round((maxScore / totalAll) * 100); }

var needsAI = (maxScore < 3) || (confidence < 50);

return {
  json: {
    messageId: item.messageId,
    threadId: item.threadId,
    sender: item.sender,
    senderName: item.senderName,
    subject: item.subject,
    body: item.body,
    fullText: item.fullText,
    receivedAt: item.receivedAt,
    ruleResult: {
      department: maxScore > 0 ? bestDept : "Unknown",
      confidence: confidence,
      maxScore: maxScore,
      scores: scores,
      matched: allMatched[bestDept] || [],
      needsAI: needsAI
    }
  }
};
