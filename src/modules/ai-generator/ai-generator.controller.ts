import { Request, Response } from "express";
import { AiGeneratorService } from "./ai-generator.service";

export class AiGeneratorController {
  private aiGeneratorService = new AiGeneratorService();

  async generateDoc(req: Request, res: Response) {
    const files = req.body?.files
    const response = await this.aiGeneratorService.generateDoc(files);

    return res.json({ response });
  }
}
