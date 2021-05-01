// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withPg } from "../../src/api/_postgres"

export default withPg(async (req, res) => {
  if (req.method === "POST") {
    const dogName = req.body?.dogName
    if (typeof dogName !== "string") {
      return res
        .status(400)
        .json({ errorCode: "bad_dog_name", help: ".dogName is not defined" })
    }

    const pgRes = await req.pg.query(
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
  }

  return res.status(404).json({ errorCode: "not_found" })
})
