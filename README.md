# LLM Service

## Overview

The LLM Service is a Node.js application that uses the `node-llama-cpp` library to interact with the Llama language model. It sanitizes input messages before processing them with the Llama model to ensure safe and appropriate responses. The service initializes the Llama model, creates a context and session, and provides an API to generate sanitized responses from input messages.

## Instructions for Using the Service

1. **Clone the repository:**

```bash
git clone https://github.com/your-repo/llm-service.git
cd llm-service
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:

```env
POSTGRES_USER=db user
POSTGRES_PASSWORD=db password
POSTGRES_DB=db name
JWT_CONSTANT=a constant to use for password hashing
PORT=port-number
DATABASE_URL=valid-RDBMS-connection-url
LLM_NAME=your-llm-model-name
```

4. **Run the service:**

```bash
npm run start
```

5. **Run with Docker Compose:**

Alternatively, you can run the service using Docker Compose. Create a `docker-compose.yml` file in the root directory with the following content:

```yaml
version: '3'
services:
  llm-service:
    image: your-docker-image
    environment:
      - LLM_NAME=your-llm-model-name
    ports:
      - '3000:3000'
```

Then, run the following command:

```bash
docker-compose up
```

## Technical Choices

### Libraries

- **nestjs/common:** Provides essential decorators and utilities for building a NestJS application.
- **nestjs/config:** Manages configuration and environment variables in a NestJS application.
- **node-llama-cpp:** Interacts with the Llama language model, providing methods to load the model, create contexts, and generate responses.

### Database

No database is used in this service as it primarily focuses on interacting with the Llama language model. However, for production use, a database might be required to store user sessions, logs, and other relevant data.

## Limitations

- The service currently supports only one Llama model at a time.
- Error handling is basic and may need enhancements for production use.
- The service does not include authentication or authorization mechanisms.

## Future Features/Requirements for Production Readiness

- **Authentication and Authorization:** Implement security measures to restrict access to the service.
- **Scalability:** Add support for multiple instances of the Llama model to handle increased load.
- **Logging and Monitoring:** Integrate logging and monitoring tools to track service performance and errors.
- **Database Integration:** Store user sessions, logs, and other relevant data in a database.
- **API Documentation:** Provide comprehensive API documentation for developers.

## Performance Improvement Ideas

- **Caching:** Implement caching mechanisms to store frequently requested responses and reduce model load times.
- **Load Balancing:** Distribute incoming requests across multiple instances of the service to improve performance.
- **Asynchronous Processing:** Use asynchronous processing for long-running tasks to improve response times.
- **Resource Optimization:** Optimize resource usage by fine-tuning the Llama model and context creation processes.
