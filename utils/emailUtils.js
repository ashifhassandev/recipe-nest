const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Sends a contact form submission using Resend API.
const sendEmail = async (name, email, message) => {
  const { data, error } = await resend.emails.send({
    from: "RecipeNest Contact <onboarding@resend.dev>",
    to: [process.env.RECEIVER_EMAIL],
    replyTo: email,
    subject: "📬 New Message from RecipeNest Contact Form",
    text: `
Hello,

You have received a new message through the RecipeNest Contact Us form:

----------------------------------------------------
👤 Name: ${name}  
📧 Email: ${email}

💬 Message:

${message}
----------------------------------------------------

Best regards,
RecipeNest Notification System
        `,
  });

  if (error) {
    console.error("Email sending failed:", error);
    throw new Error(error.message);
  }

  return data;
};

module.exports = sendEmail;