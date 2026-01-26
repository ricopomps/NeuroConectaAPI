import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  private userService = new UserService();

  async get(req: Request, res: Response) {
    try {
      const user = await this.userService.getUser(
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
}
