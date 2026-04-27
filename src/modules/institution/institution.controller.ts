import { Request, Response } from "express";
import { InstitutionService } from "./institution.service";

export class InstitutionController {
  private institutionService = new InstitutionService();

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const institution = await this.institutionService.createInstitution(
        name,
        req.userId!,
      );

      return res.status(201).json(institution);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listMine(req: Request, res: Response) {
    const institutions = await this.institutionService.listUserInstitutions(
      req.userId!,
    );
    return res.json(institutions);
  }

  async addUser(req: Request, res: Response) {
    const { institutionId } = req.params;
    const { userId } = req.body;

    const result = await this.institutionService.addUserToInstitution(
      institutionId as string,
      userId,
    );

    return res.status(201).json(result);
  }

  async removeUser(req: Request, res: Response) {
    const { institutionId, userId } = req.params;

    const result = await this.institutionService.removeUserFromInstitution(
      institutionId as string,
      userId as string,
    );

    return res.status(200).json(result);
  }

  async listUsers(req: Request, res: Response) {
    try {
      const { institutionId } = req.params;
      const { take, skip, search, excludeInstitution } = req.query;

      const users = await this.institutionService.listInstitutionUsers(
        institutionId as string,
        take ? Number(take) : 10,
        skip ? Number(skip) : 0,
        search as string,
        excludeInstitution === "true",
      );
      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
