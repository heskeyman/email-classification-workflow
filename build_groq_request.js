var item = $input.item.json;

var prompt = "Classify this email into EXACTLY ONE department.\n\n";
prompt += "Departments:\n";
prompt += "1. Sales - buying, purchasing, pricing, quotes, orders, deals, proposals\n";
prompt += "2. Customer Service - complaints, issues, refunds, returns, support\n";
prompt += "3. Human Resources - jobs, resumes, interviews, hiring, leave, salary\n";
prompt += "4. Finance - invoices, payments, billing, budgets, expenses, tax\n";
prompt += "5. Operations - shipping, logistics, warehouse, inventory, maintenance\n";
prompt += "6. Other - does not fit any department above\n\n";
prompt += "EMAIL:\n";
prompt += "From: " + item.sender + "\n";
prompt += "Subject: " + item.subject + "\n";
prompt += "Body: " + item.body.substring(0, 2000) + "\n\n";
prompt += "RESPOND WITH ONLY THIS JSON AND NOTHING ELSE:\n";
prompt += '{"department":"DEPARTMENT_NAME","confidence":85,"reason":"brief explanation"}';

return {
  json: {
    messageId: item.messageId,
    threadId: item.threadId,
    sender: item.sender,
    senderName: item.senderName,
    subject: item.subject,
    body: item.body,
    receivedAt: item.receivedAt,
    groqBody: {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 150
    }
  }
};
