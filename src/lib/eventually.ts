import { Hotel } from "@/model/Hotel.aggregate"
import { Sales } from "@/model/Sales.projector"
import {
  Errors,
  InMemoryBroker,
  app,
  bootstrap,
  broker,
  store,
} from "@rotorsoft/eventually"
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
          store: PostgresProjectorStore("my_hotel_sales", { id: "" }, ""),
        })
        .build()
      broker(InMemoryBroker(3000, 1, 1000)).poll()
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
