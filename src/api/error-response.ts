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

export interface APIError {
  httpStatus: number
  err: {
    errorCode: string
    help: string
  }
}

export function isAPIError(err: unknown): err is APIError {
  return (
    !!err &&
    typeof (err as any).httpStatus === "number" &&
    typeof (err as any).err?.errorCode === "string"
  )
}

export function createAPIErrorResponse(errorData: APIError) {
  return errorData
}
