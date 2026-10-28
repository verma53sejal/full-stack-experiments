# Experiment 8 — Kafka-Based Event-Driven Publishing Pipeline

A small scheduled-post dashboard backed by Spring Boot, an H2 database, and Apache Kafka. Create a post with a future schedule time, then follow its status as the backend scheduler sends it through the Kafka publishing pipeline.

## Technology stack

- Java 17 and Spring Boot 4.1.1
- Spring Web MVC, Spring Data JPA, and H2
- Apache Kafka in KRaft mode, started with Docker Compose
- React 18, Vite 5, and JavaScript

## Architecture and event flow

1. The React app sends post content and a local date/time to the Spring Boot API.
2. The API stores a `ScheduledPost` with status `PENDING` in the in-memory H2 database.
3. `PostSchedulerService` checks every 10 seconds for due `PENDING` posts, publishes each to Kafka topic `post-topic`, and changes its status to `PUBLISHING`.
4. `KafkaConsumerService` consumes the event, checks the `ProcessedEvent` table to skip previously processed IDs, and marks successful posts `PUBLISHED`.
5. If consumer processing throws an exception, the current implementation sends the event directly to `post-topic-dlq` and marks the post `FAILED`.
6. The dashboard reads `GET /api/posts` and refreshes the list every 3 seconds.

The project creates `post-topic` (3 partitions) and `post-topic-dlq` (1 partition) through `KafkaConfig`.

### Existing implementation notes

- The consumer contains a random 20% simulated processing failure to demonstrate the DLQ path.
- Retry-related properties exist in `application.properties`, but the consumer does not currently use them to retry; a caught processing failure is sent directly to the DLQ.
- Idempotency is implemented as a processed-event database check before processing and recording the event after success. This is a simple demonstration, not an atomic distributed exactly-once guarantee.
- There is no API for Kafka health, event history, retry counts, DLQ inspection, post editing, or post deletion. The dashboard reports backend reachability from the posts API only and does not invent Kafka health or event records.
- Posts have `content`, `scheduledTime`, and `status` fields; they do not have a separate title.
- H2 is configured as an in-memory database, so posts do not persist after the backend process stops.

## Features

- Dashboard cards for total, scheduled, published, and failed posts, calculated from API data.
- Search by post content and filter by actual backend status.
- Responsive post scheduling form with required content, future-time validation, duplicate-submit protection, and success/error feedback.
- Local-time display, status badges, refresh button, loading and empty states, and a backend connectivity indicator.
- Recent posts show their current status; no event history is available from the backend.

## Prerequisites

- Docker Desktop with Docker Compose
- Java 17
- Node.js and npm

No separate Maven installation is needed when using the included Maven Wrapper. No credentials or secrets are required by the supplied local configuration.

## Run locally (Windows PowerShell)

Run each command from the `exp_8_code` project directory unless another directory is shown.

### 1. Start Kafka

```powershell
docker compose up -d
```

Kafka is exposed at `localhost:9092`. The Compose file starts Kafka in single-node KRaft mode; it does not start the backend or frontend.

### 2. Start the backend

In a second terminal:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend base URL is `http://localhost:8080`.

### 3. Start the frontend

In a third terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

The frontend uses `http://localhost:8080` by default. To use a different backend base URL, set `VITE_API_BASE_URL` before starting Vite, for example:

```powershell
$env:VITE_API_BASE_URL = "http://localhost:8081"
npm run dev
```

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/posts` | Return all scheduled posts |
| `POST` | `/api/posts/schedule` | Store a post; send JSON with `content` and `scheduledTime` |

Example request body:

```json
{
  "content": "A scheduled post",
  "scheduledTime": "2026-10-29T10:30:00"
}
```

The API stores the schedule as a Java `LocalDateTime`. The browser submits the selected local date/time without a timezone offset; run the backend in the intended local timezone.

## Verify the pipeline

1. Start Kafka, the backend, and the frontend using the commands above.
2. Schedule a post for a future time and verify it appears as **Scheduled**.
3. Wait until the scheduled time. The scheduler checks every 10 seconds, and the UI polls the API every 3 seconds.
4. Check backend logs and the post status. Successful consumer processing becomes **Published**; the simulated consumer failure becomes **Failed** and is sent to the DLQ topic.
5. Verify the API directly at `http://localhost:8080/api/posts`.

Build and test commands:

```powershell
# From exp_8_code\backend
.\mvnw.cmd test
```

```powershell
# From exp_8_code\frontend
npm run lint
npm run build
```

The frontend currently has no automated test script. Kafka-dependent end-to-end processing must be verified with Docker and the running services; a successful compile alone does not verify broker connectivity or message delivery.

## Stop Kafka

From `exp_8_code`:

```powershell
docker compose down
```
