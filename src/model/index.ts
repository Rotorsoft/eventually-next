import { app, store } from "@rotorsoft/eventually"
import { Hotel } from "./Hotel.aggregate"
import { PostgresStore } from "@rotorsoft/eventually-pg"

export const bootstrap = async () => {
  store(PostgresStore("my_hotel"))
  app().with(Hotel)
  app().build()
  await app().listen()
}
