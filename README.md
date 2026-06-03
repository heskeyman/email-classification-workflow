📧 AI-Powered Email Classification Workflow
Automatically classifies incoming emails into business departments and routes them to the right team — built with n8n, Groq AI (Llama 3.1), and rule-based keyword scoring.

n8n
Groq
Gmail
License

🎯 What It Does
This workflow monitors a Gmail inbox and automatically:

Receives incoming emails in real-time
Analyzes the sender, subject, and body content
Classifies each email into one of 6 departments
Forwards the email to the correct department's inbox
Supported Departments
Department	Example Triggers
💼 Sales	Pricing requests, bulk orders, quotes, proposals
🎧 Customer Service	Complaints, refunds, returns, support tickets
👥 Human Resources	Job applications, resumes, interviews, leave requests
💰 Finance	Invoices, payments, billing, budget reviews
🏭 Operations	Shipping, logistics, warehouse, inventory updates
📂 Other	Emails that don't match any department
🏗️ Architecture
text

📬 Gmail Trigger (polls every 1 min)
     │
🧹 Clean Email (strips HTML, extracts fields)
     │
🚫 Is Bounce? (filters delivery failure notifications)
     │
⚖️ Rule-Based Classifier (keyword scoring engine)
     │
❓ Confident? (IF node — score ≥ 3 AND confidence ≥ 50%)
     │
  ┌──YES──────────────NO──┐
  │ (ambiguous)     (clear) │
  ▼                        ▼
🤖 Groq AI            ✅ Use Rules
  (Llama 3.1)          (free, instant)
  │                        │
  └───────► Merge ◄────────┘
              │
     🔀 Route by Department
        │  │  │  │  │  │
      Sales CS HR Fin Ops Other
        │  │  │  │  │  │
      📤 Forward to department inbox
Hybrid Classification Approach
The system uses a two-tier classification strategy:

Tier 1 — Rule-Based Engine (Free & Instant)

Scores emails against 150+ keywords across 5 departments
3-layer scoring: body keywords (1pt), subject patterns (2pts), sender patterns (3pts)
If score ≥ 3 AND confidence ≥ 50% → classification is trusted
Tier 2 — AI Fallback (Groq / Llama 3.1)

Only triggered for ambiguous emails that rules can't confidently classify
Uses Groq's free API (14,400 requests/day)
Returns structured JSON: {department, confidence, reason}
This hybrid approach handles ~80% of emails for free with rules, and only sends ambiguous ones to AI.

🛠️ Tech Stack
Component	Technology	Cost
Workflow Engine	n8n (self-hosted or cloud)	Free
Email Integration	Gmail API (OAuth2)	Free
Rule Engine	Custom JavaScript (n8n Code nodes)	Free
AI Classification	Groq API — Llama 3.1 8B	Free
Routing	n8n Switch node (6 outputs)	Free
Total cost: $0

🚀 Quick Start
Prerequisites
n8n instance (cloud or self-hosted)
Gmail account with OAuth2 credentials
Groq API key (free at console.groq.com)
Installation
Clone this repo
Bash

git clone https://github.com/YOUR_USERNAME/email-classification-workflow.git
Import into n8n

Open n8n → Workflows → Import from File
Select workflow.json
Configure credentials

Gmail OAuth2 → connect to all Gmail nodes (7 total)
Groq API key → paste in the "Groq AI Classify" HTTP Request node header
Set forwarding addresses

Update the "Send To" field in each of the 6 Forward nodes
Activate & test

Send a test email → watch it classify and route
📊 Scoring System
The rule-based classifier uses a weighted scoring system:

Match Type	Points	Example
Keyword in email body	1 point	"invoice" found in body
Keyword in subject line	2 points	"payment" in subject
Sender email pattern	3 points	Email from hr@company.com
Decision threshold: Score ≥ 3 AND Confidence ≥ 50% → use rules. Otherwise → send to AI.

Keywords Per Department
💼 Sales: buy, purchase, order, pricing, quote, discount, deal, offer, proposal, contract, subscription, upgrade, demo, trial, wholesale, partnership, negotiate, bid

🎧 Customer Service: complaint, issue, problem, broken, defective, return, refund, exchange, help, support, damaged, warranty, feedback, disappointed, frustrated, escalate, ticket

👥 Human Resources: job, resume, cv, interview, hiring, recruit, vacancy, application, candidate, employee, payroll, leave, benefits, insurance, salary, compensation, career

💰 Finance: invoice, payment, billing, account, tax, budget, expense, reimbursement, receipt, financial, audit, profit, loss, balance, accounting, payable, credit, bank, transfer

🏭 Operations: logistics, shipping, warehouse, inventory, delivery, dispatch, fleet, maintenance, equipment, production, manufacturing, safety, compliance, fulfillment, distribution, freight

🔧 Customization
Add a New Department
Add keywords to the Rule Classifier code node
Add a new output to the Switch node
Add a new Gmail Send node
Connect the switch output → new forward node
Change the AI Model
Edit the model field in the Build AI Request code node:

JavaScript

model: "llama-3.1-8b-instant"    // Fast, free
model: "llama-3.1-70b-versatile" // More accurate, still free
model: "mixtral-8x7b-32768"     // Good for multilingual
Adjust Classification Sensitivity
JavaScript

var needsAI = (maxScore < 3) || (confidence < 50);
//                        ↑                    ↑
//              Lower = more AI          Lower = more AI
//              Higher = more rules      Higher = more rules
📁 Project Structure
text

├── workflow.json              # n8n workflow (import this)
├── clean_email.js             # Email extraction & bounce filter
├── rule_classifier.js         # Keyword scoring engine
├── build_groq_request.js      # Groq API request builder
├── parse_groq_response.js     # AI response parser
├── use_rule_result.js         # Rule result formatter
└── README.md                  # This file
📈 Future Improvements
 Google Sheets logging for classification analytics
 Slack/Teams notifications for high-priority emails
 Feedback loop — manual corrections improve rules
 Multi-language support
 Attachment analysis (invoices, resumes)
 Priority scoring (urgent vs normal)
📄 License
MIT License — free to use, modify, and distribute.

🤝 Contributing
Pull requests welcome! If you add new department keywords or improve the classification logic, feel free to submit a PR.
