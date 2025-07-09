# InnovAIte Projects Dashboard - Frontend

React frontend for the InnovAIte Projects Dashboard application.

## Features

- **Project Management**: Browse, create, and manage projects
- **User Authentication**: Login/registration with session management
- **Project Details**: View project information with comments
- **Comment System**: Add comments to projects (automatically approved)
- **Responsive Design**: Mobile-friendly interface with Bootstrap
- **Search & Filter**: Find projects by various criteria

## Tech Stack

- **React 18**: Frontend framework
- **Bootstrap 5**: CSS framework
- **Axios**: HTTP client
- **React Router**: Navigation
- **Context API**: State management

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

For production:
```
REACT_APP_API_URL=https://innovaiteprojectsbackend.onrender.com/api
CI=false
```

## Deployment

This application is configured for deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Set the build command: `npm run build`
3. Set the publish directory: `build`
4. Add environment variables in Netlify dashboard

## Local Development

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Pages

- **Home**: Landing page with application overview
- **Projects**: Browse all projects with search and filtering
- **Project Details**: View individual project with comments
- **Create Project**: Add new project (authenticated users only)
- **Login/Register**: User authentication
- **Profile**: User profile management
- **Admin Setup**: Initial admin user creation

## Authentication

The application uses Basic Authentication with the backend API. User credentials are stored in localStorage and automatically included in API requests.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation header
│   ├── Footer.js       # Footer component
│   ├── Home.js         # Landing page
│   ├── ProjectList.js  # Projects grid view
│   ├── ProjectDetail.js # Individual project view
│   ├── CreateProject.js # Project creation form
│   ├── Login.js        # Login form
│   ├── Register.js     # Registration form
│   └── Profile.js      # User profile
├── context/            # React context providers
│   └── AuthContext.js  # Authentication context
├── services/           # API services
│   └── api.js          # Axios API client
├── styles/             # CSS stylesheets
└── utils/              # Utility functions
```

## API Integration

The frontend communicates with the backend API for:
- User authentication and registration
- Project CRUD operations
- Comment management
- User profile management

All API calls are made through the centralized `api.js` service with automatic authentication headers.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
