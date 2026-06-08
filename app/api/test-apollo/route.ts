import { NextResponse } from "next/server";
import { enrichEmails } from "@/services/apollo.service";

export async function GET() {
  try {

    const contacts = [
      {
        name: "Maya Subhadra",
        title: "Principal RTL Design Engineer",
        linkedinUrl:
          "https://www.linkedin.com/in/maya-subhadra-9431bb78",
        companyDomain: "microsoft.com"
      }
    ];

    const result = await enrichEmails(contacts);
    
    return NextResponse.json({
      success: true,
      result
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}