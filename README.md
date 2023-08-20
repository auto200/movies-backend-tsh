# Movies API

endpoints:

- /v1/movies [GET/POST] - functionality as described in `requirements.md`

## Setup

- for node/pnpm version look at `package.json`
- create `.env` file look at `.env.template`

```bash
pnpm i
pnpm dev

pnpm test
```

😄

### Thoughts

- setting up file as a database was little bit painful, solution heavily inspired by [lowdb](https://github.com/typicode/lowdb)
- database communication layer designed in mind to be replaceable with some more conventional db
- naming difference between `duration` filter name and `runtime` movie property, not sure where we should map one to another. Decided to just keep it constant
