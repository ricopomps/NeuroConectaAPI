import { Request, Response } from "express";
import { emailService } from "./email.service";

export class EmailController {
  async sendTest(req: Request, res: Response) {
    try {
      const to = req.body?.to || req.query?.to;

      if (!to || typeof to !== "string") {
        return res.status(400).json({ error: "Missing 'to' parameter" });
      }

      const result = await emailService.sendTestEmail(to);

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
