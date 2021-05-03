import { APIResponse, createRoute } from "@/src/api/create-route"

interface BadDogNameResponse {
  errorCode: "bad_dog_name"
  help: string
}

interface SuccessResponse {
  status: "ok"
  diary: {
    id: string
    dogName: string
  }
}

type Response = SuccessResponse | BadDogNameResponse

export default createRoute({
  async POST(req, res: APIResponse<Response>) {
    const dogName = req.body?.dogName
    if (typeof dogName !== "string") {
      return res
        .status(400)
        .json({ errorCode: "bad_dog_name", help: ".dogName is not a string" })
    }

    const pgRes = await req.ctx.pg.query(
      "INSERT INTO diaries(dog_name) VALUES($1) RETURNING id",
      [dogName]
    )

    return res.status(200).json({
      status: "ok",
      diary: {
        id: pgRes.rows[0].id,
        dogName,
      },
    })
  },
})
