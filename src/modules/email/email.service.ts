import { Resend } from "resend";
import { EMAIL_FROM, RESEND_API_KEY } from "../../config/env";

export class EmailService {
  private client?: Resend;
  private readonly apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? RESEND_API_KEY;
  }

  private getClient() {
    if (!this.client) {
      if (!this.apiKey) {
        throw new Error("RESEND_API_KEY is not defined");
      }
      this.client = new Resend(this.apiKey);
    }
    return this.client;
  }

  async sendTestEmail(to: string) {
    const client = this.getClient();
    const from = EMAIL_FROM ?? "onboarding@resend.dev";
    const subject = "Hello World";
    const html =
      "<p>Congrats on sending your <strong>first email</strong>!</p>";

    const resp = await client.emails.send({
      from,
      to,
      subject,
      html,
    });

    return resp;
  }

  async sendPasswordResetEmail(to: string, link: string, name?: string) {
    const client = this.getClient();
    const from = EMAIL_FROM ?? "onboarding@resend.dev";
    const subject = "Troca de senha";
    const displayName = name ? `Olá ${name},` : "Olá,";
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #111">
        <p>${displayName}</p>
        <p>Recebemos uma solicitação para trocar a sua senha. Clique no link abaixo para criar uma nova senha. O link expira em 1 hora.</p>
        <p><a href="${link}" target="_blank" rel="noopener">Trocar minha senha</a></p>
        <p>Se você não solicitou essa troca, apenas ignore este e-mail.</p>
      </div>
    `;

    const resp = await client.emails.send({
      from,
      to,
      subject,
      html,
    });

    return resp;
  }
}

export const emailService = new EmailService();
