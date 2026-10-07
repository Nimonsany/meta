FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /source

# Install Maven wrapper
RUN apk add --no-cache bash
RUN curl -fsSL https://downloads.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz | tar -xzf - -C /usr/local/
ENV MAVEN_HOME=/usr/local/apache-maven-3.9.6
ENV PATH="$MAVEN_HOME/bin:$PATH"

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn -B -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /source/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Environment variables from docker-compose .env
ENV JWT_SECRET=${JWT_SECRET}
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/ecommerce
ENV SPRING_REDIS_HOST=redis
ENV SPRING_REDIS_PORT=6379

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]