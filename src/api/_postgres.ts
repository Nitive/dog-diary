import type { NextApiRequest, NextApiResponse } from "next"
import { Client } from "pg"
import { appConfig } from "./_app-config"

export function withPg<
  ResData,
  Req extends NextApiRequest = NextApiRequest,
  Res extends NextApiResponse<ResData> = NextApiResponse<ResData>
>(handle: (req: Req & { pg: Client }, res: Res) => Promise<void>) {
  const client = new Client(appConfig.psql)
  return async (req: Req & { pg: Client }, res: Res) => {
    await client.connect()
    req.pg = client
    await handle(req, res)
    await client.end()
  }
}
