import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

function respondInvalid(res: Response, error: unknown) {
  const issues = (error as { issues?: { path: (string | number)[]; message: string }[] }).issues;
  const details = issues
    ? issues.map((i) => ({ path: i.path.join("."), message: i.message }))
    : [{ path: "", message: "validasi gagal" }];
  res.status(400).json({ success: false, message: "Validasi gagal", errors: details });
}

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      respondInvalid(res, result.error);
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      respondInvalid(res, result.error);
      return;
    }
    // Di Express 5, `req.query` adalah GETTER yang di-parse ulang dari URL
    // dan mengembalikan objek BARU setiap kali dibaca — tidak di-cache
    // (beda dengan req.body yang properti biasa). Akibatnya
    // `Object.assign(req.query, result.data)` hanya memutasi objek sementara
    // yang langsung dibuang: nilai ter-coerce (page/limit jadi number,
    // default schema) tidak pernah sampai ke controller/service.
    // Solusinya: shadow property getter dengan defineProperty di instance,
    // sehingga pembacaan req.query berikutnya mengembalikan hasil parse.
    Object.defineProperty(req, "query", {
      value: result.data,
      configurable: true,
      enumerable: true,
      writable: true,
    });
    next();
  };
}

export function validateParams(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      respondInvalid(res, result.error);
      return;
    }
    req.params = result.data as Request["params"];
    next();
  };
}
