import { Resend } from "resend";
import { EMAIL_FROM, FRONT_URL, RESEND_API_KEY } from "../../config/env";
import { AccountConfirmationEmail } from "../../emails/AccountConfirmationEmail";
import { PasswordResetEmail } from "../../emails/PasswordResetEmail";
import { WelcomeEmail } from "../../emails/WelcomeEmail";

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

    const resp = await client.emails.send({
      from,
      to,
      subject,
      react: PasswordResetEmail({ name, resetLink: link }),
    });

    return resp;
  }

  async sendWelcomeEmail(to: string, name?: string) {
    const client = this.getClient();
    const from = EMAIL_FROM ?? "onboarding@resend.dev";
    const subject = "Bem-vindo ao sistema";
    const base = FRONT_URL ?? "http://localhost:3000";
    const loginLink = `${base}/auth/login`;

    const resp = await client.emails.send({
      from,
      to,
      subject,
      react: WelcomeEmail({ name, loginLink }),
    });

    return resp;
  }

  async sendAccountConfirmationCode(to: string, code: string) {
    const client = this.getClient();
    const from = EMAIL_FROM ?? "onboarding@resend.dev";
    const subject = "Código de confirmação de cadastro";

    const resp = await client.emails.send({
      from,
      to,
      subject,
      react: AccountConfirmationEmail({ email: to, confirmationCode: code }),
    });

    return resp;
  }
}

export const emailService = new EmailService();
