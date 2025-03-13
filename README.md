# LLM Service

## Overview

This project is an LLM gateway that ensures prompt sanitization both before they are sent to an AI model and after responses are received.
It runs in Docker using `docker-compose`, with `PostgreSQL` as the database and `NestJS` as the backend framework. Model execution is handled by `node-llama-cpp`, and during each `docker-compose` build, a predefined AI model is automatically downloaded and integrated into the container.
Access to the API requires user registration and authentication, as all endpoints are secured with `JWT-based` authentication.
To simplify the addition of new sanitization rules, I implemented the `Command` design pattern. This approach makes it easy to extend the sanitization logic by adding new commands without modifying existing code, ensuring flexibility and maintainability

## Instructions for Using the Service

1. **Clone the repository:**

```bash
git clone https://github.com/DaanWur/prompt-task.git
cd llm-service
```

2. **Install dependencies:**

```bash
npm install
```

1. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:

```
POSTGRES_USER=db user
POSTGRES_PASSWORD=db password
POSTGRES_DB=db name
JWT_CONSTANT=a constant to use for password hashing
PORT=port-number
DATABASE_URL=valid-RDBMS-connection-url
LLM_NAME=your-llm-model-name
```

1. **Build the project:**
   Use the following command to build the porject

```bash
npm run build
```

2. **Build using Docker-compose:**
   Run

```bash
docker-compose build
docker-compose up
```

3. **Run the service:**

```bash
docker-compose up
```

**In case Docker fails:**
You can run the project locally, by running the database on docker and then run the following command.
You will need to download a model of your choice to your local machine and adjust the .env accordingly

```bash
npm run start
```

## API

**All endpoints besides register and login will be protected with a JWT token which will be recieved after login in order to use it set it as bearer token in postman**

- **register:** `http://localhost:8080/user/register`
  payload:

  ```
  {
  "email": email string,
  "firstName": string,
  "lastName": string,
  "password": string - minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1, minNumbers: 1,
  }

  ```

- **login:** `http://localhost:8080/auth/login`  
   payload:

  ```
  {
   "email": string,
   "password": string
  }

  ```

- **prompt:** `http://localhost:8080/prompt`
  payload:
  ```
  {
   "prompt": string
  }
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
- **More sanitization methods:** The Command design pattern allows easy addition of new sanitization rules without modifying existing code.

## Performance Improvement Ideas

- **Caching:** Implement a more accurate caching mechanisms to store frequently requested responses and reduce model load times.
- **Load Balancing:** Distribute incoming requests across multiple instances of the service to improve performance.
- **Resource Optimization:** Optimize resource usage by fine-tuning the Llama model and context creation processes.
- **LLM integration:** Store the LLM on a separate machine to reduce initialization time.
- **Prallelism:** Create a mechanism that handles many requests at once.

## Testing:

**In order to provide a soild service which can represent the state of the service to the business unit tests should be developed - It was not done in the scope of the assignment, basic tests were done**

**Tests focous**

- **Sanitization:** Test the sanitization on a large amount of emails icluding all kinds of examples.
- **Model calls:** Test the integration with the local LLM.
- **Large amount of requests:** Test the limits of the current project by creating performace tests in which will overload the server.
