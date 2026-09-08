import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateBody, validateQuery, validateParams } from "../../middlewares/validate.js";
import { idParamSchema } from "../../utils/schemas.js";
import {
  createBeasiswaSchema,
  updateBeasiswaSchema,
  beasiswaQuerySchema,
} from "./schema.js";
import {
  listBeasiswaHandler,
  listBeasiswaAktifHandler,
  getBeasiswaByIdHandler,
  getBeasiswaDetailHandler,
  createBeasiswaHandler,
  updateBeasiswaHandler,
  softDeleteBeasiswaHandler,
  deactivateBeasiswaHandler,
} from "./controller.js";

export const beasiswaRouter = Router();

beasiswaRouter.get(
  "/",
  validateQuery(beasiswaQuerySchema),
  listBeasiswaHandler,
);

beasiswaRouter.get(
  "/aktif",
  validateQuery(beasiswaQuerySchema),
  listBeasiswaAktifHandler,
);

beasiswaRouter.get(
  "/:id",
  validateParams(idParamSchema),
  getBeasiswaByIdHandler,
);

beasiswaRouter.get(
  "/:id/detail",
  validateParams(idParamSchema),
  getBeasiswaDetailHandler,
);

beasiswaRouter.post(
  "/",
  authenticate,
  authorize("Admin"),
  validateBody(createBeasiswaSchema),
  createBeasiswaHandler,
);

beasiswaRouter.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  validateParams(idParamSchema),
  validateBody(updateBeasiswaSchema),
  updateBeasiswaHandler,
);

beasiswaRouter.patch(
  "/:id/deactivate",
  authenticate,
  authorize("Admin"),
  validateParams(idParamSchema),
  deactivateBeasiswaHandler,
);

beasiswaRouter.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  validateParams(idParamSchema),
  softDeleteBeasiswaHandler,
);
