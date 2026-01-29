import { Request, Response } from "express";
import { AiTesterService } from "./ai-tester.service";

export class AiTesterController {
  private aiTesterService = new AiTesterService();

  async teste(req: Request, res: Response) {
    const { text } = req.body;

    const response = await this.aiTesterService.teste(text);

    return res.json({ response });
  }
}
