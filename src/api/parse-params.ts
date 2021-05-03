import { validate as uuidValidate } from "uuid"
import { createAPIErrorResponse, isAPIError } from "./error-response"

interface ValidateOptions<ErrorCode> {
  errorCode: ErrorCode
  paramName: string
  value: unknown
}

function badRequest<E extends string>(
  opts: ValidateOptions<E>,
  errorMessage: string
) {
  return Promise.reject(
    createAPIErrorResponse({
      httpStatus: 400,
      err: {
        errorCode: opts.errorCode,
        help: `${opts.paramName} ${errorMessage}`,
      },
    })
  )
}

function notAString<E extends string>(opts: ValidateOptions<E>) {
  return badRequest(opts, "is not a string")
}

export async function parseUUIDParam<E extends string>(
  opts: ValidateOptions<E>
): Promise<string> {
  if (typeof opts.value !== "string") {
    return notAString(opts)
  }

  if (!uuidValidate(opts.value)) {
    return badRequest(opts, "is not an UUID")
  }

  return opts.value
}

export async function parseDate<E extends string>(
  opts: ValidateOptions<E>
): Promise<Date> {
  if (typeof opts.value !== "string") {
    return notAString(opts)
  }

  const date = new Date(opts.value)

  if (isNaN(date.getTime())) {
    return badRequest(opts, "could not be converted to date")
  }

  return date
}

export async function parseEnum<E extends string, T>(
  opts: ValidateOptions<E>,
  values: T[]
): Promise<T> {
  if (!values.includes(opts.value as any)) {
    return badRequest(opts, `does not belong to enum ${values.join(" | ")}`)
  }

  return opts.value as any
}

export async function parseJsonb<E extends string>(
  opts: ValidateOptions<E>
): Promise<any> {
  try {
    const stringified = JSON.stringify(opts.value)
    if (stringified.length > 3000) {
      return badRequest(opts, "is too long. Max json length is 3000")
    }
  } catch (err) {
    return badRequest(opts, "could not be converted to jsonb")
  }

  return opts.value
}
