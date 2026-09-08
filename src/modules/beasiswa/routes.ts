import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateBody, validateQuery, validateParams } from "../../middlewares/validate.js";
import { idParamSchema } from "../../utils/schemas.js";
import { beasiswaQuerySchema, createBeasiswaSchema, updateBeasiswaSchema } from "./schema.js";
import {
  listBeasiswaAktifHandler,
  listAllBeasiswaHandler,
  getBeasiswaByIdHandler,
  createBeasiswaHandler,
  updateBeasiswaHandler,
  softDeleteBeasiswaHandler,
} from "./controller.js";

export const beasiswaRouter = Router();

// ── Publik ────────────────────────────────────────────────
beasiswaRouter.get("/", validateQuery(beasiswaQuerySchema), listBeasiswaAktifHandler);

// ── Admin only ────────────────────────────────────────────
// DAFTAR PALING ATAS sebelum "/:id": kalau "/all" didaftarkan setelah "/:id",
// path "/all" akan tertangkap route "/:id" dan dikira id="all" (gagal coerce
// ke number → 400). Urutan registrasi route Express bersifat top-down.
beasiswaRouter.get(
  "/all",
  authenticate,
  authorize("admin"),
  validateQuery(beasiswaQuerySchema),
  listAllBeasiswaHandler,
);

beasiswaRouter.get("/:id", validateParams(idParamSchema), getBeasiswaByIdHandler);

beasiswaRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  validateBody(createBeasiswaSchema),
  createBeasiswaHandler,
);

beasiswaRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateParams(idParamSchema),
  validateBody(updateBeasiswaSchema),
  updateBeasiswaHandler,
);

beasiswaRouter.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validateParams(idParamSchema),
  softDeleteBeasiswaHandler,
);
