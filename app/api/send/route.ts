import { NextResponse } from "next/server";
import { sendEmail } from "@/services/brevo.service";

export async function POST(
  req: Request
) {
  try {

    const { contacts } = await req.json();

    if (!contacts?.length) {
      return NextResponse.json(
        {
          success: false,
          error: "No contacts provided"
        },
        {
          status: 400
        }
      );
    }

    // Remove duplicates
    const uniqueContacts = new Map();

    for (const contact of contacts) {

      if (!contact.email) {
        continue;
      }

      if (
        contact.emailStatus &&
        contact.emailStatus !== "VERIFIED"
      ) {
        continue;
      }

      uniqueContacts.set(
        contact.email,
        contact
      );
    }

    const sendableContacts =
      Array.from(
        uniqueContacts.values()
      );

    let sent = 0;
    let failed = 0;
    let skipped = contacts.length -
      sendableContacts.length;

    const results = [];

    for (const contact of sendableContacts) {

      try {

        const response =
          await sendEmail(
            contact.email,
            contact.name,
            contact.title,
            contact.companyName ||
            contact.companyDomain
          );

        sent++;

        results.push({
          email: contact.email,
          name: contact.name,
          status: "SENT",
          messageId:
            response.messageId
        });

      } catch (error: any) {

        failed++;

        results.push({
          email: contact.email,
          name: contact.name,
          status: "FAILED",
          error:
            error.response?.data ||
            error.message
        });
      }
    }

    return NextResponse.json({
      success: true,

      summary: {
        totalContacts:
          contacts.length,

        sendableContacts:
          sendableContacts.length,

        sent,
        failed,
        skipped
      },

      results
    });

  } catch (error: any) {

    console.error(
      "Bulk Send Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error.message
      },
      {
        status: 500
      }
    );
  }
}