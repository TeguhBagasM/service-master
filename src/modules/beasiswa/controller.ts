import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { BeasiswaQueryInput, CreateBeasiswaInput, UpdateBeasiswaInput } from "./schema.js";
import * as service from "./service.js";

export async function listBeasiswaAktifHandler(req: Request, res: Response) {
  const query = req.query as unknown as BeasiswaQueryInput;
  const result = await service.listBeasiswaAktif(query);
  sendSuccess(res, "Daftar beasiswa aktif", result);
}

export async function listAllBeasiswaHandler(req: Request, res: Response) {
  const query = req.query as unknown as BeasiswaQueryInput;
  const result = await service.listAllBeasiswa(query);
  sendSuccess(res, "Semua data beasiswa", result);
}

export async function getBeasiswaByIdHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  const beasiswa = await service.getBeasiswaById(id);
  sendSuccess(res, "Detail beasiswa", beasiswa);
}

export async function createBeasiswaHandler(req: Request, res: Response) {
  const body = req.body as CreateBeasiswaInput;
  const beasiswa = await service.createBeasiswa(body);
  sendSuccess(res, "Beasiswa berhasil dibuat", beasiswa, 201);
}

export async function updateBeasiswaHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  const body = req.body as UpdateBeasiswaInput;
  const beasiswa = await service.updateBeasiswa(id, body);
  sendSuccess(res, "Beasiswa berhasil diperbarui", beasiswa);
}

export async function softDeleteBeasiswaHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  await service.softDeleteBeasiswa(id);
  sendSuccess(res, "Berhasil menonaktifkan beasiswa", null);
}
