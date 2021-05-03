import { createRoute, APIResponse } from "@/src/api/create-route"
import {
  parseDate,
  parseEnum,
  parseJsonb,
  parseUUIDParam,
} from "@/src/api/parse-params"

interface BadDiaryIDResponse {
  errorCode: "bad_diary_id"
  help: string
}

type TimePrecision = "day" | "minute"
interface DiaryEntity {
  id: string
  time: string // parseble by new Date()
  timePrecision: TimePrecision
  diaryID: string
  event: any
}

interface SuccessPOSTResponse {
  status: "ok"
  entity: DiaryEntity
}

interface SuccessGETResponse {
  status: "ok"
  entities: DiaryEntity[]
}

type POSTResponse = SuccessPOSTResponse | BadDiaryIDResponse
type GETResponse = SuccessGETResponse | BadDiaryIDResponse

async function parseDiaryID(value: unknown) {
  return await parseUUIDParam({
    value,
    errorCode: "bad_diary_id",
    paramName: "diaryID",
  })
}

export default createRoute({
  async POST(req, res: APIResponse<POSTResponse>) {
    const diaryID = await parseDiaryID(req.query.diaryID)
    const time = await parseDate({
      errorCode: "bad_time",
      paramName: "time",
      value: req.body?.time,
    })
    const timePrecision = await parseEnum(
      {
        errorCode: "bad_time_precision",
        paramName: "timePrecision",
        value: req.body?.timePrecision,
      },
      ["day", "minute"] as TimePrecision[]
    )
    const event = await parseJsonb({
      errorCode: "bad_event",
      paramName: "event",
      value: req.body?.event,
    })

    const pgRes = await req.ctx.pg.query(
      "INSERT INTO diary_entries(time, time_precision, diary_id, event) VALUES($1, $2, $3, $4) RETURNING id, time",
      [time, timePrecision, diaryID, event]
    )

    return res.status(200).json({
      status: "ok",
      entity: {
        id: pgRes.rows[0].id,
        time: pgRes.rows[0].time,
        timePrecision,
        diaryID,
        event,
      },
    })
  },
  async GET(req, res: APIResponse<GETResponse>) {
    const diaryID = await parseDiaryID(req.query.diaryID)
    const pgRes = await req.ctx.pg.query(
      "SELECT id, time, time_precision, event FROM diary_entries WHERE diary_id = $1",
      [diaryID]
    )

    return res.status(200).json({
      status: "ok",
      entities: pgRes.rows.map((row) => ({
        id: row.id,
        time: row.time,
        timePrecision: row.time_precision,
        diaryID: diaryID,
        event: row.event,
      })),
    })
  },
})
