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