import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateBody, validateParams } from "../../middlewares/validate.js";
import { idParamSchema, beasiswaIdParamSchema } from "../../utils/schemas.js";
import { createPersyaratanSchema, updatePersyaratanSchema } from "./schema.js";
import {
  listPersyaratanByBeasiswaHandler,
  createPersyaratanHandler,
  updatePersyaratanHandler,
  deletePersyaratanHandler,
} from "./controller.js";

export const persyaratanRouter = Router();

// ── Publik ────────────────────────────────────────────────
// Dipakai frontend applicant untuk tahu dokumen apa yang harus diupload
// sebelum submit wizard pendaftaran.
persyaratanRouter.get(
  "/beasiswa/:beasiswaId/persyaratan",
  validateParams(beasiswaIdParamSchema),
  listPersyaratanByBeasiswaHandler,
);

// ── Admin only ────────────────────────────────────────────
persyaratanRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  validateBody(createPersyaratanSchema),
  createPersyaratanHandler,
);

persyaratanRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateParams(idParamSchema),
  validateBody(updatePersyaratanSchema),
  updatePersyaratanHandler,
);

persyaratanRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateParams(idParamSchema),
  deletePersyaratanHandler,
);
