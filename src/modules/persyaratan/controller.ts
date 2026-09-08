import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";
import type { CreatePersyaratanInput, PersyaratanQueryInput, UpdatePersyaratanInput } from "./schema.js";
import * as service from "./service.js";

export async function listPersyaratanHandler(req: Request, res: Response) {
  const query = req.query as unknown as PersyaratanQueryInput;
  const result = await service.listPersyaratan(query);
  sendSuccess(res, "Daftar persyaratan", result);
}

export async function getPersyaratanByIdHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  const persyaratan = await service.getPersyaratanById(id);
  sendSuccess(res, "Detail persyaratan", persyaratan);
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

export async function softDeletePersyaratanHandler(req: Request, res: Response) {
  const id = Number(req.params["id"]);
  const result = await service.softDeletePersyaratan(id);
  sendSuccess(res, result.message, null);
}
