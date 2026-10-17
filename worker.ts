import { onRequest } from './functions/_middleware'

type WorkerEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

export default {
  fetch(request: Request, env: WorkerEnv) {
    return onRequest({ request, next: () => env.ASSETS.fetch(request) })
  },
}
