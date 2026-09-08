import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { CreatePersyaratanInput, UpdatePersyaratanInput } from "./schema.js";
import * as service from "./service.js";

export async function listPersyaratanByBeasiswaHandler(req: Request, res: Response) {
  const beasiswaId = Number(req.params["beasiswaId"]);
  const persyaratan = await service.listPersyaratanByBeasiswa(beasiswaId);
  sendSuccess(res, "Daftar persyaratan beasiswa", persyaratan);
}

export async function createPersyaratanHandler(req: Request, res: Response) {
  const body = req.body as CreatePersyaratanInput;
  const persyaratan = await service.createPersyaratan(body);
  sendSuccess(res, "Persyaratan berhasil dibuat", persyaratan, 201);
}

export async function updatePersyaratanHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  const body = req.body as UpdatePersyaratanInput;
  const persyaratan = await service.updatePersyaratan(id, body);
  sendSuccess(res, "Persyaratan berhasil diperbarui", persyaratan);
}

export async function deletePersyaratanHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  const result = await service.deletePersyaratan(id);
  sendSuccess(res, result.message, null);
}
