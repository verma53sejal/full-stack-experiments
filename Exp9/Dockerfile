FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /workspace

COPY pom.xml .
COPY src ./src
RUN mvn --batch-mode --no-transfer-progress package

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN useradd --system --uid 10001 appuser
COPY --from=build --chown=appuser:appuser /workspace/target/ci-cd-demo-1.0.0.jar app.jar

USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
