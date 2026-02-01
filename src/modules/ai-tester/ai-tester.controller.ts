import { Request, Response } from "express";
import { AiTesterService } from "./ai-tester.service";

export class AiTesterController {
  private aiTesterService = new AiTesterService();

  async teste(req: Request, res: Response) {
    const response = await this.aiTesterService.teste('Quanto é 1 + 1');

    return res.json({ response });
  }
}
