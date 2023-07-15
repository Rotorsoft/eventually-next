import RequireAuth from "@/components/RequireAuth"

export default function Home() {
  return (
    <div>
      <h1>
        Welcome to <b>Eventually Next</b>!
      </h1>
      <br />
      <h3>A NextJS template with:</h3>
      <ul>
        <li>
          Integrated
          <a
            className="mx-1 underline"
            href="https://github.com/Rotorsoft/eventually-monorepo"
          >
            eventually
          </a>
          model, where public commands are exposed as NextJS routes
        </li>
        <li>Secured with Next Auth</li>
        <li>Tested in Vercel&apos;s serverless infrastructure</li>
        <li>
          Event store hosted by serverless providers (such as Railway,
          PlanetScale, Supabase, Couchbase, Firebase, etc)
        </li>
      </ul>
      <RequireAuth />
    </div>
  )
}
