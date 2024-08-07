# Stage1: Build Flask app
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app/backend

# Copy the requirements into the container
COPY requirements.txt /app/backend

# Install the python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code into the container
COPY backend/ .

# Expose the port that the application will run on
EXPOSE 5000

# Command to run the application
CMD ["python","app.py"]