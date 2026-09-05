# ============================================================
# MediCore HMS Backend — Dockerfile for Cloud / Railway
# ============================================================

# Stage 1: Build stage with Maven & Eclipse Temurin JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /build

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package executable JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal runtime image with JRE 17
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user for security
RUN groupadd -r medicore && useradd -r -g medicore medicore
USER medicore

# Copy packaged jar from build stage
COPY --from=builder /build/target/hms-0.0.1-SNAPSHOT.jar app.jar

# Expose dynamic port (Railway assigns $PORT at container start)
EXPOSE 8081

# JVM flags and Railway $PORT binding
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8081} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
