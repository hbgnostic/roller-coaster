import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const notificationEmail = process.env.NOTIFICATION_EMAIL;

  if (!notificationEmail) {
    return NextResponse.json(
      { error: "Notification email not configured" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "CoasterVerse <onboarding@resend.dev>",
      to: notificationEmail,
      subject: "CoasterVerse Contest Won!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #a855f7;">They Did It!</h1>
          <p style="font-size: 18px; line-height: 1.6;">
            Both players have completed their challenges on CoasterVerse!
          </p>
          <p style="font-size: 18px; line-height: 1.6;">
            <strong>They've won two tickets to the theme park of their choice!</strong>
          </p>
          <p style="font-size: 16px; color: #666; margin-top: 30px;">
            Time to plan a coaster adventure together!
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
          <p style="font-size: 14px; color: #999;">
            Sent from CoasterVerse
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Failed to send notification:", err);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
