import type { NextApiRequest, NextApiResponse } from "next"
import { Client } from "pg"
import { appConfig } from "./app-config"
import {
  InternalError,
  methodNotFoundError,
  NotFoundError,
} from "./error-response"

const client = new Client(appConfig.psql)
const clientP = client.connect()

interface AppContext {
  pg: Client
}

export type APIRequest = NextApiRequest & { ctx: AppContext }

export type APIResponse<ResData> = NextApiResponse<
  ResData | InternalError | NotFoundError
>

type MethodHandler<ResData = any> = <
  Res extends APIResponse<ResData> = APIResponse<ResData>
>(
  req: APIRequest,
  res: Res
) => Promise<void>

export function createRoute(methods: {
  GET?: MethodHandler
  POST?: MethodHandler
  PUT?: MethodHandler
  PATCH?: MethodHandler
  DELETE?: MethodHandler
}) {
  return async (req: APIRequest, res: APIResponse<any>) => {
    for (const [method, handler] of Object.entries(methods)) {
      if (handler && method === req.method) {
        try {
          await clientP
          req.ctx = { pg: client }
          await handler(req, res)
        } catch (err) {
          console.error(err)
          res
            .status(500)
            .json({ errorCode: "internal_error", help: "Internal error" })
        }
      }
    }

    return res.status(404).json(methodNotFoundError(req))
  }
}
