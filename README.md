# project-management-frontend
Project Management is a tool designed to help multiple projects, and the associated stories. It allows users to create projects, status them as a whole. As well as, create smaller stories for each project, and status them out as well.  

## Installation

### Local Development

Step One: Fork and Clone Repository.

```bash
git clone <repository-url>
cd project-management-frontend
```

Step Two: Install dependencies.

```bash
npm install
```

Step Three: You will need to install the backend [project-management-api](https://github.com/pbsmith82/project-management-api). Once you have setup the backend, you will be able use Project Management. 

Step Four: Start the development server.

```bash
npm start
```

The application will be available at `http://localhost:3001`

Alternatively, for quick local testing without the server:

```zsh
open index.html
```

## Deployment to Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed
- Backend API deployed (or use environment variable for API URL)

### Deployment Steps

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set the API Base URL (if your backend is on a different server):**
   ```bash
   heroku config:set API_BASE_URL=https://your-backend-api.herokuapp.com
   ```
   
   If your backend is on the same domain, you can omit this and the app will use relative URLs.

4. **Deploy to Heroku:**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

5. **Open your app:**
   ```bash
   heroku open
   ```

### Environment Variables

- `API_BASE_URL`: (Optional) The base URL for your backend API. If not set, the app will use relative URLs (same origin).
- `PORT`: Automatically set by Heroku (defaults to 3001 for local development)

### Notes

- The app will automatically detect if it's running on localhost and use `http://localhost:3000` for the API.
- When deployed, if `API_BASE_URL` is not set, it will use relative URLs (assuming the backend is on the same domain).
- Make sure your backend API has CORS enabled if it's on a different domain.

## Usage
Users will be able to create projects, status them as a whole. As well as, create smaller stories for each project, and status them out as well.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
Project Management is available as open source under the terms of the [MIT License](https://github.com/pbsmith82/project-management-frontend/blob/main/LICENSE).
