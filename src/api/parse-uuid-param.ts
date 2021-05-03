import { validate as uuidValidate } from "uuid"
import { createAPIErrorResponse } from "./error-response"

export async function parseUUIDParam<ErrorCode extends string>(opts: {
  errorCode: ErrorCode
  paramName: string
  value: unknown
}): Promise<string> {
  if (typeof opts.value !== "string") {
    return Promise.reject(
      createAPIErrorResponse({
        httpStatus: 400,
        err: {
          errorCode: opts.errorCode,
          help: `${opts.paramName} is not a string`,
        },
      })
    )
  }

  if (!uuidValidate(opts.value)) {
    return Promise.reject(
      createAPIErrorResponse({
        httpStatus: 400,
        err: {
          errorCode: opts.errorCode,
          help: `${opts.paramName} is not an UUID`,
        },
      })
    )
  }

  return opts.value
}
