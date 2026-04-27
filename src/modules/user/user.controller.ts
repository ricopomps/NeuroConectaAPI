import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  private readonly userService = new UserService();

  async me(req: Request, res: Response) {
    const userId = req.userId;

    const user = await this.userService.getUserById(userId!);

    return res.json(user);
  }

  async get(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(
        req.params.userUuid as string,
      );
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async listByInstitution(req: Request, res: Response) {
    try {
      const users = await this.userService.listUsersByInstitution(
        req.params.institutionId as string,
      );
      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await this.userService.list();
      return res.status(200).json(users);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
