import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      company,
      phone,
      email,
      service,
      message,
    } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>New Quote Request</h2>

      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td><strong>Name</strong></td>
          <td>${name}</td>
        </tr>
        <tr>
          <td><strong>Company</strong></td>
          <td>${company || "-"}</td>
        </tr>
        <tr>
          <td><strong>Phone</strong></td>
          <td>${phone}</td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td><strong>Service</strong></td>
          <td>${service}</td>
        </tr>
      </table>

      <h3>Project Details</h3>

      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    await transporter.sendMail({
      from: `"MOSFET Website" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: `New Quote Request - ${name}`,
      html,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to send email.",
      },
      {
        status: 500,
      }
    );
  }
}