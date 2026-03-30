# Gatling Performance Testing on HyperExecute (TypeScript)

This project shows how to run **Gatling load tests** written in **TypeScript** on [LambdaTest HyperExecute](https://www.lambdatest.com/hyperexecute).

It comes with a sample Express server and a ready-to-run Gatling simulation so you can try it out right away.

---

## What's Inside

```
├── HYE.yaml                                  # HyperExecute config file
├── package.json                              # Project dependencies
├── tsconfig.json                             # TypeScript settings
├── resources/
│   └── gatling.conf                          # Report settings (thresholds, percentiles)
└── src/
    ├── server/
    │   └── app.ts                            # Sample Express server to test against
    └── simulations/
        └── GreetingSimulation.gatling.ts      # The Gatling load test
```

---

## Before You Start

You need these installed on your machine:

- [Node.js](https://nodejs.org/) **v18 or newer** — run `node -v` to check
- [Git](https://git-scm.com/)

For running on HyperExecute, you also need:

- A [LambdaTest](https://www.lambdatest.com/) account
- [HyperExecute CLI](https://www.lambdatest.com/support/docs/hyperexecute-cli-run-tests-on-hyperexecute-grid/) binary for your OS

---

## Try It Locally

### Step 1: Clone and install

```bash
git clone https://github.com/LambdaTest/gatling-hyperexecute-typescript.git
cd gatling-hyperexecute-typescript
npm install
```

### Step 2: Start the sample server

Open a terminal and run:

```bash
npm run start:server
```

You should see:

```
Server running on http://localhost:8080
```

Keep this terminal open.

### Step 3: Run the load test

Open a **second terminal** and run:

```bash
npm run test:gatling
```

This will send requests to the server for 60 seconds. When it finishes, you'll see a summary like:

```
---- Global Information --------------------------------
> request count                         12000
> mean response time (ms)                 744
> response time 95th percentile (ms)     2673
> percentage of failed requests           0.0%
```

### Step 4: View the report

Open the generated HTML report in your browser:

```
results/jssimulation-<timestamp>/index.html
```

This report includes response time charts, percentile breakdowns, and pass/fail stats.

---

## Run on HyperExecute

### Step 1: Set your LambdaTest credentials

```bash
export LT_USERNAME=your_username
export LT_ACCESS_KEY=your_access_key
```

You can find these in your [LambdaTest Profile](https://accounts.lambdatest.com/detail/profile).

### Step 2: Run

```bash
./hyperexecute --config HYE.yaml
```

HyperExecute takes care of everything:
- Installs dependencies
- Starts the server in the background
- Runs the Gatling test
- Uploads the HTML report

### Step 3: View results

Go to the [HyperExecute Dashboard](https://hyperexecute.lambdatest.com/hyperexecute). Click on your job and go to the **Artifacts** tab to download the Gatling HTML report.

---

## How the Test Works

The sample server has two endpoints:

| Endpoint | What it does |
|----------|-------------|
| `GET /greet/:name` | Returns `"Hello <name>"` |
| `GET /slow` | Waits a random time (0–3s), then returns the delay |

The Gatling simulation:

1. Hits `/greet/<random-id>` and checks for status `200`
2. Waits 5 seconds
3. Hits `/slow` and checks for status `200`
4. Repeats with **100 new users every second** for **60 seconds**
5. Fails if more than **1% of requests** return errors

---

## Make It Your Own

**Test a different URL** — Change `baseUrl` in `src/simulations/GreetingSimulation.gatling.ts`:

```typescript
const httpProtocol = http
  .baseUrl("https://your-api.example.com")
```

If you're testing an external URL, remove the `background` section from `HYE.yaml` (you won't need the local server).

**Change the load** — Adjust users and duration:

```typescript
// 50 users per second for 30 seconds
constantUsersPerSec(50).during(30)
```

**Change report thresholds** — Edit `resources/gatling.conf`:

```
indicators {
  lowerBound = 500     # ms - requests below this are "fast"
  upperBound = 1000    # ms - requests above this are "slow"
}
```

---

## Common Issues

| Problem | Fix |
|---------|-----|
| `node -v` shows less than 18 | [Update Node.js](https://nodejs.org/) |
| Port 8080 already in use | Stop the other process or change the port in `src/server/app.ts` |
| Gatling can't connect to server | Make sure the server is running in a separate terminal |
| No files in `results/` folder | The test hasn't run yet — run `npm run test:gatling` |

---

## Documentation

- [HyperExecute Getting Started](https://www.lambdatest.com/support/docs/getting-started-with-hyperexecute/)
- [HyperExecute YAML Configuration](https://www.lambdatest.com/support/docs/deep-dive-into-hyperexecute-yaml/)
- [Gatling JS/TS Documentation](https://docs.gatling.io/reference/integrations/build-tools/js-cli/)
