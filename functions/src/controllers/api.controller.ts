import { Request, Response } from "express";
import SESSION from "../models/session.model.js";
import SEMESTER from "../models/semester.model.js";

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

export async function getSemeseters(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const semesters = await SEMESTER.findAll({ where: { sessionId } });

    res.status(200).json({ message: "Success", data: { semesters, session } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSemester(req: Request, res: Response) {
  try {
    const { name } = req.body;
    const { sessionId } = req.params;
    const session = await SESSION.findByPk(sessionId);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }

    const semester = await SEMESTER.create({ name, sessionId });

    res.status(201).json({ message: "Success", data: semester });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}