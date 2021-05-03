# dog-diary

## REST API

### `POST /api/diaries` creates a dog diary

```sh
$ curl --request POST http://localhost:3000/api/diaries -H 'Content-Type: application/json' -d '{"dogName": "Арчи"}'
{"status":"ok","diary":{"id":"dd36545c-1ac2-442f-8d5c-98812dba76df","dogName":"Арчи"}}
```

### `GET /api/diaries/:diaryID` returns a dog diary by its ID

```sh
$ curl http://localhost:3000/api/diaries/70a28f2e-308a-47ef-815d-78919abd0173
{"status":"ok","diary":{"id":"70a28f2e-308a-47ef-815d-78919abd0173","dogName":"Берта"}}
```

### `PATCH /api/diaries/:diaryID` updates dog's name in diary

```sh
$ curl --request PATCH http://localhost:3000/api/diaries/70a28f2e-308a-47ef-815d-78919abd0173 -H 'content-type: application/json' -d '{"dogName": "Берта"}'
{"status":"ok"}
```

### `POST /api/diaries/:diaryID/entries` creates an entry in diary

```sh
$ curl --request POST http://localhost:3000/api/diaries/70a28f2e-308a-47ef-815d-78919abd0173/entries -H 'Content-Type: application/json' -d '{"time":"Mon, 03 May 2021 14:15:26 GMT","timePrecision":"minute","event":{"type":"urination","where":"outside"}}'
{"status":"ok","entity":{"id":"3d36f485-1898-46fd-9dc2-ab1fd3fad6cc","time":"2021-05-03T14:15:26.000Z","timePrecision":"minute","diaryID":"70a28f2e-308a-47ef-815d-78919abd0173","event":{"type":"urination","where":"outside"}}}
```

### `GET /api/diaries/:diaryID/entries` returns entries from diary

```sh
$ curl http://localhost:3000/api/diaries/70a28f2e-308a-47ef-815d-78919abd0173/entries -H 'Content-Type: application/json'
{"status":"ok","entities":[{"id":"3d36f485-1898-46fd-9dc2-ab1fd3fad6cc","time":"2021-05-03T14:15:26.000Z","timePrecision":"minute","diaryID":"70a28f2e-308a-47ef-815d-78919abd0173","event":{"type":"urination","where":"outside"}}]}
```
