# Travel Expense Manager

Travel Expense Manager is a web application designed to simplify the management and splitting of travel expenses among friends. With an intuitive interface and Google account integration, it makes tracking and settling travel costs hassle-free and transparent.

## Features

- **Google Account Integration:** Secure login using your Google account.
- **Create Tours:** Organize your trips with custom tour creation.
- **Manage Expenses:** Log and track expenses for each tour.
- **Split Costs:** Automatically calculate who owes whom at the end of the tour.
- **View History:** Access the history of past tours and expenses.
- **Responsive Design:** Accessible on various devices, providing a seamless experience.

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- npm (v6 or later)
- MongoDB

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Set Up Environment Variables

Your application requires setting up environment variables for both the server and the client. These variables are crucial for configuring the database, server, and Google OAuth.

#### Server Environment Variables

1. In the `server` directory, create a `.env` file with the following variables:

   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/YourDatabaseName

   # Server Configuration
   PORT=3000

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=yourGoogleClientId
   GOOGLE_CLIENT_SECRET=yourGoogleClientSecret
   ```

   Replace `yourGoogleClientId`, `yourGoogleClientSecret`, and `YourDatabaseName` with your actual configurations. If you're using MongoDB Atlas or another cloud database, replace the `MONGODB_URI` with your cloud database URI.

#### Client Environment Variables

2. In the `client` directory, create a `.env` file with the following variables:

   ```env
   # Server Configuration
   PORT=4000

   # Google OAuth Configuration
   REACT_APP_GOOGLE_CLIENT_ID=yourGoogleClientId
   REACT_APP_GOOGLE_CLIENT_SECRET=yourGoogleClientSecret

   # API URL
   REACT_APP_API_URL=http://localhost:3000
   ```

   Ensure that `REACT_APP_GOOGLE_CLIENT_ID` and `REACT_APP_GOOGLE_CLIENT_SECRET` match the Google OAuth credentials used in the server configuration. The `REACT_APP_API_URL` should point to the URL where your server is running.


### Running the Application

1. **Start the server:**

   ```bash
   npm start
   ```

   This will start the Node.js server on the default port (usually `5000`).

2. **Accessing the application:**

   Open your browser and navigate to `http://localhost:5000` (or the port you've configured).

## Usage

- **Log in** with your Google account to start using the application.
- **Create a tour** by specifying the tour name, start date, and members.
- **Add expenses** during the tour, specifying who paid and who was involved.
- **End the tour** to see the final settlements - who owes whom and how much.
- **View past tours** and expenses in the history section.

## Contributing

Contributions to Travel Expense Manager are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is currently not open source.

## Contact

Your Name - [your-email@example.com](mailto:tousif.md.amin.faisal@gmail.com)

Project Link: [https://github.com/your-username/your-repo-name](https://github.com/FaisalNabil/TravelTally.git)
