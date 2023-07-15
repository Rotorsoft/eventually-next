import { app, store } from "@rotorsoft/eventually"
import { Hotel } from "./Hotel.aggregate"
import { PostgresStore } from "@rotorsoft/eventually-pg"

export const bootstrap = async () => {
  store(PostgresStore("hotel"))
  app().with(Hotel)
  app().build()
  await app().listen()
}

export const seed = async () => {
  store(PostgresStore("hotel"))
  await store().seed()
}
