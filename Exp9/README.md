# ci-cd-demo

A small Java 17 and Spring Boot project for **Experiment 3.2.1: Continuous Integration (CI) and Continuous Deployment (CD)**. It has two REST endpoints, automated tests, a Docker image, GitHub Actions workflows, and an optional local canary-routing demonstration.

## Dashboard

The project includes a responsive dashboard built with plain HTML, CSS, and JavaScript. Spring Boot serves it from `src/main/resources/static/`, so it uses the same port and origin as the API; no CORS setup or Node.js is needed.

Start the application from the project directory:

```powershell
mvn spring-boot:run
```

Open **http://localhost:8080/** in a browser. Use the buttons to call `/api/hello` and `/api/status`, and use the theme button to switch between dark and light styles. The dashboard also summarizes the project's tests, GitHub Actions workflows, Docker image publishing, and local canary demonstration.

## What the application does

| Method | Endpoint | Example response |
|---|---|---|
| GET | `/api/hello` | `Hello from CI/CD Demo!` |
| GET | `/api/status` | `{"status":"UP","application":"ci-cd-demo","version":"1.0.0"}` |

The status `version` can be set with the `APP_VERSION` environment variable. It helps show which local container received a canary-demo request.

## Major files

- `pom.xml` — Maven project details, Java version, Spring Boot, and test dependencies.
- `src/main/java/com/example/cicddemo/` — application entry point, REST controllers, response type, and small service classes.
- `src/main/resources/static/index.html`, `style.css`, and `script.js` — same-origin dashboard served directly by Spring Boot.
- `src/test/java/com/example/cicddemo/HelloServiceTest.java` — JUnit 5 unit test for the greeting service.
- `src/test/java/com/example/cicddemo/ApiIntegrationTest.java` — MockMvc tests that exercise the application endpoints.
- `src/test/java/com/example/cicddemo/ApiContractTest.java` — a lightweight check of endpoint response types, fields, and expected values. This is **not** full Pact consumer-provider testing.
- `.github/workflows/ci.yml` — runs Maven verification on every push and pull request. A failing test makes the workflow fail.
- `.github/workflows/cd.yml` — after a successful CI run for a push to `main`, builds and publishes the image to GHCR.
- `Dockerfile` — multi-stage build: Maven builds the tested JAR, then a smaller Java runtime image runs it as a non-root user.
- `.dockerignore` — excludes build output and unrelated files from the Docker build context.
- `scripts/canary-demo.ps1` — sends a configurable small percentage of requests to a second local container. It is a **local simulation**, not a real production load balancer.

## Run locally with PowerShell

Prerequisites: Java 17 and Maven installed and available in `PATH`.

From the project directory:

```powershell
mvn spring-boot:run
```

In another PowerShell window, check both endpoints:

```powershell
Invoke-RestMethod http://localhost:8080/api/hello
Invoke-RestMethod http://localhost:8080/api/status
```

The first request prints the greeting. The second prints a PowerShell object with `status`, `application`, and `version`.

## Experiment 1: Run CI tests

Run all unit, integration, and contract tests locally:

```powershell
mvn clean verify
```

Maven exits with a failure code if a test fails. The CI workflow uses the same verification goal with Java 17, so a failed test fails the GitHub Actions check.

## Experiment 2: Build and run Docker

Prerequisites: Docker Desktop is installed and running.

```powershell
docker build -t ci-cd-demo:local .
docker run --rm -p 8080:8080 ci-cd-demo:local
```

Use another PowerShell window to test it:

```powershell
Invoke-RestMethod http://localhost:8080/api/hello
Invoke-RestMethod http://localhost:8080/api/status
```

Stop the container with **Ctrl+C**.

### Local canary demonstration

Build the image first, then start two containers in separate ports. The same image is used twice, but environment variables make their versions easy to distinguish:

```powershell
docker run -d --name ci-cd-stable -p 8081:8080 -e APP_VERSION=stable ci-cd-demo:local
docker run -d --name ci-cd-canary -p 8082:8080 -e APP_VERSION=canary ci-cd-demo:local
```

Send 20 requests, randomly routing about 10% to the canary container:

```powershell
.\scripts\canary-demo.ps1 -Requests 20 -CanaryPercent 10
```

The script displays the selected route and version for each request. The exact count varies because each request is selected randomly; this is intentionally a small **local simulation**, not production traffic management.

Remove the two named demo containers when finished:

```powershell
docker rm -f ci-cd-stable ci-cd-canary
```

## Push to GitHub

Create an empty GitHub repository named `ci-cd-demo` first. In PowerShell, from this project directory, replace the URL below with your repository URL:

```powershell
git init
git add .
git commit -m "Add CI/CD demo project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ci-cd-demo.git
git push -u origin main
```

If Git asks you to authenticate, follow its browser sign-in prompt or use your configured Git Credential Manager.

## Verify the GitHub Actions workflows

1. Open the repository on GitHub and select **Actions**.
2. The **CI** workflow should run for the push. Open its run and confirm the Java setup and Maven test steps are green.
3. Make a change on a branch and open a pull request to confirm CI also runs for pull requests.
4. After a successful push to `main`, **CD - Publish Docker image** starts automatically. It waits for the successful CI workflow run.
5. If the package cannot be published, check the repository's **Settings → Actions → General → Workflow permissions** and ensure workflows can read and write packages. For an organization-owned repository, the organization may need to allow GitHub Actions to create and publish packages. The workflow uses the built-in `GITHUB_TOKEN` with only `contents: read` and `packages: write`; no personal access token or paid cloud service is needed.
6. Open the repository's **Packages** page, or the owner's GitHub Packages page, to find `ci-cd-demo`. The workflow publishes both `latest` and the tested commit SHA tags.

To pull the published image (replace the owner with your lowercase GitHub username or organization):

```powershell
docker pull ghcr.io/YOUR-USERNAME/ci-cd-demo:latest
```

## Practical demonstration checklist

### Experiment 1 — CI

- [ ] Run `mvn clean verify` locally and show the passing tests.
- [ ] Push to GitHub and show the green CI run in the **Actions** tab.
- [ ] Explain that CI checks every push and pull request and blocks success when tests fail.
- [ ] Point out the unit test, MockMvc endpoint tests, and lightweight response contract test.

### Experiment 2 — CD

- [ ] Build and run the Docker image locally; call both endpoints.
- [ ] Start stable and canary containers and run `canary-demo.ps1`.
- [ ] Explain that the canary script is only a local routing simulation.
- [ ] Show the successful CD workflow and the published image tags in GitHub Packages.
