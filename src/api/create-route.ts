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

export type HandleWithAppContext<Req, Res> = (
  req: Req & { ctx: AppContext },
  res: Res
) => Promise<void>

function createRouteAnyMethod<
  ResData = void,
  Req extends NextApiRequest = NextApiRequest,
  Res extends NextApiResponse<ResData | InternalError> = NextApiResponse<
    ResData | InternalError
  >
>(handle: HandleWithAppContext<Req, Res>): HandleWithAppContext<Req, Res> {
  return async (req, res) => {
    try {
      await clientP
      req.ctx = { pg: client }
      await handle(req, res)
    } catch (err) {
      console.error(err)
      res
        .status(500)
        .json({ errorCode: "internal_error", help: "Internal error" })
    }
  }
}

export function createRoute<
  ResData = void,
  Req extends NextApiRequest = NextApiRequest,
  Res extends NextApiResponse<
    ResData | InternalError | NotFoundError
  > = NextApiResponse<ResData | InternalError | NotFoundError>
>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  handle: HandleWithAppContext<Req, Res>
): HandleWithAppContext<Req, Res> {
  return async (req, res) => {
    if (req.method === method) {
      return await createRouteAnyMethod<ResData, Req, Res>(handle)(req, res)
    }

    return res.status(404).json(methodNotFoundError(req))
  }
}
