import {
  simulation,
  scenario,
  constantUsersPerSec,
  global,
  exec,
} from "@gatling.io/core";
import { http, status } from "@gatling.io/http";
import { randomUUID } from "crypto";

export default simulation((setUp) => {
  const httpProtocol = http
    .baseUrl("http://localhost:8080")
    .acceptHeader("application/json")
    .userAgentHeader("Gatling Performance Test");

  const greeting = exec(
    http("get greeting")
      .get(() => `/greet/${randomUUID()}`)
      .check(status().is(200))
  );

  const slowCall = exec(
    http("Randomly slow")
      .get("/slow")
      .check(status().is(200))
  );

  const loadTestScenario = scenario("Load Test Greeting")
    .exec(greeting)
    .pause(5)
    .exec(slowCall);

  setUp(
    loadTestScenario.injectOpen(
      constantUsersPerSec(100).during(60)
    )
  )
    .assertions(global().failedRequests().percent().lte(1))
    .protocols(httpProtocol);
});
