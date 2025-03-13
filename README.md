# LLM Service

## Overview

The LLM Service is a Node.js application that uses the `node-llama-cpp` library to interact with the Llama language model. It sanitizes input messages before processing them with the Llama model to ensure safe and appropriate responses. The service initializes the Llama model, creates a context and session, and provides an API to generate sanitized responses from input messages.

## Instructions for Using the Service

1. **Clone the repository:**

```bash
[git clone https://github.com/your-repo/llm-service.git](https://github.com/DaanWur/prompt-task.git)
cd llm-service
```

2. **Install dependencies:**

```bash
npm install
```

1. **Set up environment variables:**
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

4. **Download LLM model:**
   Use the following command to choose which LLM to download to your local machine

```bash
npx --no node-llama-cpp chat
```

5. **Init the Database:**
   Run

```bash
docker-compose build
docker-compose up
```

- Note that the node server will fail unless you dockerize a model within the machine

6. **Run the service:**
   In case the docker fails, the postgres instance will be on the air and you can run the app from the terminal:

```bash
npm run start
```

## Technical Choices

### Libraries

- **NestJS:** NestJS provides a structured, scalable, and maintainable codebase with built-in TypeScript support, making it a strong choice for projects that require clean architecture.
- **node-llama-cpp:** Interacts with LLM that runs locally and creates a seamless communication with them, providing methods to load the model, create contexts, and generate responses.

### Database

- **PostgreSQL:** The service uses PostgreSQL for storing user data. The database is deployed using Docker for easy setup and management.

## Limitations

- The service currently supports only one Llama model at a time.
- Error handling is basic and may need enhancements for production use.
- Communication with the model is slow and the model is stored locally.

## Future Features/Requirements for Production Readiness

- **Authorization:** Implement security measures to restrict access to the service on a role basis.
- **Scalability:** Add support for multiple instances of the Llama model to handle increased load.
- **Logging and Monitoring:** Integrate logging and monitoring tools to track service performance and errors.
- **Database Integration:** Further enchance the use of Databace in order to store user sessions, logs, and other relevant data in a database.

## Performance Improvement Ideas

- **Caching:** Implement a more accurate caching mechanisms to store frequently requested responses and reduce model load times.
- **Load Balancing:** Distribute incoming requests across multiple instances of the service to improve performance.
- **Resource Optimization:** Optimize resource usage by fine-tuning the Llama model and context creation processes.
- **LLM integration:** Store the LLM on a separate machine to reduce initialization time.
- **Prallelism:** Create a mechanism that handles many requests at once.
