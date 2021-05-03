// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createRoute } from "../../../src/api/create-route"
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

export default createRoute<Response>("GET", async (req, res) => {
  const { diaryID } = req.query
  if (typeof diaryID !== "string") {
    return res
      .status(400)
      .json({ errorCode: "bad_diary_id", help: ".diaryID is not a string" })
  }

  if (!uuidValidate(diaryID)) {
    return res
      .status(400)
      .json({ errorCode: "bad_diary_id", help: ".diaryID is a UUID" })
  }

  const pgRes = await req.ctx.pg.query("SELECT * from diaries WHERE id = $1", [
    diaryID,
  ])

  if (pgRes.rowCount === 0) {
    return res.status(404).json({
      errorCode: "not_found",
      help: "The diary is not found",
    })
  }

  return res.status(200).json({
    status: "ok",
    diary: {
      id: pgRes.rows[0].id,
      dogName: pgRes.rows[0].dog_name,
    },
  })
})
