import { Hotel } from "@/model/Hotel.aggregate"
import { Sales } from "@/model/Sales.projector"
import { Errors, app, bootstrap, broker, store } from "@rotorsoft/eventually"
import { PostgresProjectorStore, PostgresStore } from "@rotorsoft/eventually-pg"

// bootstrap the hotel app
export function eventually() {
  app().artifacts.size === 0 &&
    void bootstrap(async () => {
      store(PostgresStore("my_hotel"))
      app()
        // commit hotel state every 100 events
        .with(Hotel, { commit: (snap) => snap.applyCount >= 100 })
        .with(Sales, {
          projector: {
            store: PostgresProjectorStore("my_hotel_sales"),
            indexes: [],
          },
        })
        .build()
      broker() // to handle commits/state events
      void broker().drain() // to drain event handlers
    })
}

type Status = 400 | 404 | 409 | 500
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
