import {
  AggregateFactory,
  Errors,
  Messages,
  State,
  app,
  store,
} from "@rotorsoft/eventually"
import { PostgresStore } from "@rotorsoft/eventually-pg"

export function bootstrap<
  S extends State,
  C extends Messages,
  E extends Messages
>(factory: AggregateFactory<S, C, E>, table: string) {
  if (app().artifacts.size === 0) {
    store(PostgresStore(table))
    app().with(factory).build()
  }
}

type Status = 500 | 400 | 404 | 409
export function parseHttpError(error: unknown): {
  message: string
  status: Status
  details?: any
} {
  if (error instanceof Error) {
    const { name, message } = error
    let status: Status = 500
    switch (name) {
      case Errors.ValidationError:
      case Errors.InvariantError:
        status = 400
        break
      case Errors.RegistrationError:
        status = 404
        break
      case Errors.ConcurrencyError:
      case Errors.ActorConcurrencyError:
        status = 409
        break
    }
    return { message, status, details: "details" in error && error.details }
  }
  return {
    message: typeof error === "string" ? error : "Oops, something went wrong!",
    status: 500,
  }
}
