import { Request, Response } from "express";
import SESSION from "../models/session.model.js";

export async function getSessions(_: Request, res: Response) {
  try {
    const sessions = await SESSION.findAll({ order: [["startYear", "DESC"]] });

    res.status(200).json({message: "Success", data: sessions});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSession(req: Request, res: Response) {
  try {
    const { name, startYear } = req.body;
    const session = await SESSION.create({ name, startYear });

    res.status(201).json({ message: "Success", data: session });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}