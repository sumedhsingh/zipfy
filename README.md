# ZIPFY: The Zipf Law Analyser

## Introduction
Welcome to the Zipfy: Zipf's Law Analysis Tool! This application analyzes the frequency of words in a given text corpus and calculates how closely the text follows Zipf's Law. The project is designed to be user-friendly and provides insightful analysis results, including a Zipfian score, log-log graph, and other relevant statistics.

## Tech Stack
- **Backend**: Python | Flask
- **Frontend**: HTML | CSS | JS | React
- **Database**: SQLITE3
- **Containerization**: Docker

## Installation
To simplify the setup and ensure a consistent development environment, this project uses Docker. Follow these steps to get started:

### Prerequisites
- **Docker**: Make sure Docker is installed on your machine. You can download Docker Desktop from [here](https://www.docker.com/products/docker-desktop) for Windows or Mac, or follow the [installation instructions](https://docs.docker.com/engine/install/) for Linux.

### Setup

1. **Clone the Repository**

   First, clone this repository to your local machine:

   ```sh
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

Installation:
To simplify the setup and ensure a consistent development environment, this project uses Docker. Follow these steps to get started:

Prerequisites
Docker: Make sure Docker is installed on your machine. You can download Docker Desktop from here for Windows or Mac, or follow the installation instructions for Linux.
Setup
Clone the Repository

First, clone this repository to your local machine:

sh
Copy code
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
Build and Run Containers

Use Docker Compose to build and run the containers:

sh
Copy code
docker-compose up --build
This command will:

Build the Docker images for the frontend and backend services.
Start the containers based on the built images.
Access the Application

Frontend: Open your web browser and navigate to http://localhost. You should see the React application.
Backend: The backend API will be accessible at http://localhost:5000.
Stopping the Containers
To stop the running containers, press CTRL+C in the terminal where docker-compose is running, or use:

sh
Copy code
docker-compose down
This command will stop and remove the containers.

Additional Commands
View Logs: To view the logs of the running containers, use:

sh
Copy code
docker-compose logs
Rebuild Containers: If you make changes to the Dockerfiles or the application code and need to rebuild the containers, use:

sh
Copy code
docker-compose up --build
Troubleshooting
If you encounter any issues, check the logs for errors:

sh
Copy code
docker-compose logs backend
docker-compose logs frontend
Ensure that Docker is running and you have the necessary permissions to run Docker commands.





