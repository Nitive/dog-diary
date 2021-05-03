import type { NextApiRequest } from "next"

export interface InternalError {
  errorCode: "internal_error"
  help: string
}

export interface NotFoundError {
  errorCode: "not_found"
  help: string
}

export function methodNotFoundError(req: NextApiRequest): NotFoundError {
  return {
    errorCode: "not_found",
    help: `${req.method} method is not defined`,
  }
}
