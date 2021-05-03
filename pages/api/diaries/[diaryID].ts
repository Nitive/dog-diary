import {
  createRoute,
  APIRequest,
  APIResponse,
} from "../../../src/api/create-route"
import { validate as uuidValidate } from "uuid"

interface BadDiaryIDResponse {
  errorCode: "bad_diary_id"
  help: string
}

interface SuccessResponse {
  status: "ok"
  diary: {
    id: string
    dogName: string
  }
}

type Response = SuccessResponse | BadDiaryIDResponse

async function parseDiaryID(diaryID: unknown): Promise<string> {
  if (typeof diaryID !== "string") {
    return Promise.reject({
      errorCode: "bad_diary_id",
      help: ".diaryID is not a string",
    })
  }

  if (!uuidValidate(diaryID)) {
    return Promise.reject({
      errorCode: "bad_diary_id",
      help: ".diaryID is a UUID",
    })
  }

  return diaryID
}

export default createRoute({
  async GET(req, res: APIResponse<Response>) {
    let diaryID = ""
    try {
      diaryID = await parseDiaryID(req.query.diaryID)
    } catch (err) {
      return res.status(400).json(err)
    }

    const pgRes = await req.ctx.pg.query(
      "SELECT id, dog_name from diaries WHERE id = $1",
      [diaryID]
    )

    if (pgRes.rowCount === 0) {
      return res.status(404).json({
        errorCode: "not_found",
        help: "The diary is not found",
      })
    }

    if (pgRes.rowCount > 1) {
      return res.status(500).json({
        errorCode: "internal_error",
        help: `Expected one diary but found ${pgRes.rowCount}`,
      })
    }

    return res.status(200).json({
      status: "ok",
      diary: {
        id: pgRes.rows[0].id,
        dogName: pgRes.rows[0].dog_name,
      },
    })
  },
  async PATCH(req, res: APIResponse<any>) {
    let diaryID = ""
    try {
      diaryID = await parseDiaryID(req.query.diaryID)
    } catch (err) {
      return res.status(400).json(err)
    }

    const dogName = req.body?.dogName
    if (typeof dogName !== "string") {
      return res
        .status(400)
        .json({ errorCode: "bad_dog_name", help: ".dogName is not a string" })
    }

    await req.ctx.pg.query("UPDATE diaries SET dog_name = $2 WHERE id = $1", [
      diaryID,
      dogName,
    ])

    return res.status(200).json({
      status: "ok",
    })
  },
})
