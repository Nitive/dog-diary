# dog-diary

## REST API

### `POST /api/diaries` creates a dog diary

```
$ curl --request POST http://localhost:3000/api/diaries -H 'Content-Type: application/json' -d '{"dogName": "Арчи"}'
{"status":"ok","diary":{"id":"dd36545c-1ac2-442f-8d5c-98812dba76df","dogName":"Арчи"}}
```

### `GET /api/diary/:diaryID` returns a dog diary by its ID

```
$ curl http://localhost:3000/api/diaries/70a28f2e-308a-47ef-815d-78919abd0173
{"status":"ok","diary":{"id":"70a28f2e-308a-47ef-815d-78919abd0173","dogName":"Берта"}}
```
