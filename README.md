# Installation Guide

## Run with Docker

**Step 1:** Download the latest build of Docker from their website: [https://www.docker.com/](https://www.docker.com/). Once downloaded, follow their instructions to install successfully. Ensure it’s installed properly by running the following command in a terminal:

```bash
docker -v
```

**Step 2:** From the root directory of the project run the following command in a terminal:

```bash
docker-compose up --force-recreate --build
```

This will build the docker image, and start up the docker container which will run the application. The application is available on localhost on port 80 [http://localhost:80/](http://localhost:80/)

## Testing QR Scan Functionality

Currently, as our application runs on localhost, the QR code functionality isn’t possible to check on a desktop (due to required access to the camera). It requires running the application off a public domain in order to have a second device involved to scan the QR code. To do this, follow these steps:

1. Download the latest version of ngrok from their website: [https://ngrok.com/download](https://ngrok.com/download). Make sure to add the executable’s path to the PATH environment variable. Verify that it is installed correctly by running the following command in a terminal: 

```bash
ngrok version
```
2. Once the installation is verified, run the following command in a terminal to register the authentication token and make ngrok’s services available for use:

```bash
ngrok config add-authtoken 2T9AsuHgkprAqQDnquEw4cGmr9T_7cCAPrrbvPbaWuB8B8vSH
```

3. Follow the ‘Run with Docker’ instructions listed above to run the application in a Docker container. 
4. Open a new terminal instance, and run the following command:

```bash
ngrok http --domain=ems.ngrok.app --region=au  80
```

5. Copy this URL: [https://ems.ngrok.app/](https://ems.ngrok.app/). This is the public endpoint from which our application will run. 
6. Navigate to the frontend directory, and then to the src directory, and then to the context directory. Inside each file there is a context file, which requests data from the Flask server. Replace the “http://127.0.0.1:5000” (the local domain on which our Flask server is running), in the baseURL variable in each context file with the URL in step 3. This will reroute the requests to the public domain. 

*Update Context Files**: Paste the copied link into `baseurl` in all the context files. This bit of code specifically:

```javascript
const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
});
```
should now be:

```javascript
const api = axios.create({
  baseURL: "https://ems.ngrok.app",
});
```

7. Terminate the currently running Docker container. 
8. Rerun the Docker container as in the ‘Run with Docker’ section, the public URL should now be hosting the application.



## Run without Docker

**Step 1:** Ensure you have the latest versions of Python installed, as well as the latest version of NodeJS.

**Step 2:** From a terminal, run the following commands from the root directory: 

```bash
cd frontend
npm i
vite
```

This will navigate to the frontend folder, install all required dependencies for the frontend, and run the frontend server in a development environment. If the final command does not run, this command can be run alternatively:

```bash
npm run dev
```

**Step 3:** To setup and run the backend, run the following commands from the root directory:

```bash
cd backend
python -m venv venv
```

This will navigate to the backend directory and create a python virtual environment to run the project in. Then, for macOS or Linux, run the following command:

```bash
source venv/bin activate
```

Or for windows, run:

```bash
.\venv\Scripts\activate
```

This will run the virtual environment created in the previous step.

**Step 4:** Run the following command:

```bash
pip install -r requirements.txt
```

This will install all python dependencies required to run the application. 

**Step 5:** Finally, to run the backend Flask server, run this command from the backend directory:

```bash
python wsgi.py
```
The frontend is accessible on localhost on port 5173 [http://localhost:5173/](http://localhost:5173/).


## Running Tests

We have also taken the liberty to create a test suite to ensure the proper functioning of our application. These tests can be run by navigating to the backend directory in a terminal running the following command:

```bash
python tests/test_all.py
```
