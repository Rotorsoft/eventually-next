import {
  AggregateFactory,
  CommitPredicate,
  Errors,
  Messages,
  State,
  app,
  bootstrap,
  broker,
  store,
} from "@rotorsoft/eventually"
import { PostgresStore } from "@rotorsoft/eventually-pg"

export function eventually<
  S extends State,
  C extends Messages,
  E extends Messages
>(
  factory: AggregateFactory<S, C, E>,
  table: string,
  commit?: CommitPredicate<S, E>
) {
  app().artifacts.size === 0 &&
    void bootstrap(async () => {
      store(PostgresStore(table))
      app().with(factory).build()
      commit && broker()
    })
}

type Status = 500 | 400 | 404 | 409
type JsonResponse = {
  status: Status
  statusText: string
  error: {
    message: string
    details?: any
  }
}
export function toJsonResponse(error: unknown): JsonResponse {
  let status: Status = 500
  let statusText = "Internal Server Error"
  if (error instanceof Error) {
    const { name, message } = error
    switch (name) {
      case Errors.ValidationError:
      case Errors.InvariantError:
        status = 400
        statusText = name
        break
      case Errors.RegistrationError:
        status = 404
        statusText = name
        break
      case Errors.ConcurrencyError:
      case Errors.ActorConcurrencyError:
        status = 409
        statusText = name
        break
    }
    return {
      status,
      statusText,
      error: { message, details: "details" in error && error.details },
    }
  }
  return {
    status,
    statusText,
    error: {
      message:
        typeof error === "string" ? error : "Oops, something went wrong!",
    },
  }
}
