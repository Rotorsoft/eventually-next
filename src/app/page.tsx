import RequireAuth from "@/components/RequireAuth"

export default function Home() {
  return (
    <div>
      <h1>
        Welcome to <b>Eventually Next</b>!
      </h1>
      <br />
      <h3>A NextJS template featuring:</h3>
      <ul>
        <li>
          Integrated
          <a
            className="mx-1 underline"
            href="https://github.com/Rotorsoft/eventually-monorepo"
          >
            eventually
          </a>
          model - Aggregates are exposed as NextJS api routes
        </li>
        <li>Secured with OAuth (Supabase Auth, Next Auth, etc)</li>
        <li>Tested in Vercel&apos;s serverless infrastructure</li>
        <li>Reactive - New events are pushed to handler routes in real time</li>
        <li>UI reacts to changes in data projections</li>
        <li>
          Event store hosted by serverless providers (such as Railway,
          PlanetScale, Supabase, Couchbase, Firebase, etc)
        </li>
      </ul>
      <RequireAuth />
    </div>
  )
}
