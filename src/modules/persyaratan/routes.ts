import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validateBody, validateQuery, validateParams } from "../../middlewares/validate.js";
import { idParamSchema } from "../../utils/schemas.js";
import {
  createPersyaratanSchema,
  updatePersyaratanSchema,
  persyaratanQuerySchema,
} from "./schema.js";
import {
  listPersyaratanHandler,
  getPersyaratanByIdHandler,
  createPersyaratanHandler,
  updatePersyaratanHandler,
  softDeletePersyaratanHandler,
} from "./controller.js";

export const persyaratanRouter = Router();

persyaratanRouter.get(
  "/",
  validateQuery(persyaratanQuerySchema),
  listPersyaratanHandler,
);

persyaratanRouter.get(
  "/:id",
  validateParams(idParamSchema),
  getPersyaratanByIdHandler,
);

persyaratanRouter.post(
  "/",
  authenticate,
  authorize("Admin"),
  validateBody(createPersyaratanSchema),
  createPersyaratanHandler,
);

persyaratanRouter.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  validateParams(idParamSchema),
  validateBody(updatePersyaratanSchema),
  updatePersyaratanHandler,
);

persyaratanRouter.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  validateParams(idParamSchema),
  softDeletePersyaratanHandler,
);
