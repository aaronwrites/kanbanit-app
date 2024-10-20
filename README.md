# Kanbanit

Kanbanit is a kanban-style task management app designed to help you effortlessly organize your tasks, track due dates, and boost productivity. With features like task sorting, due date tracking, and seamless user interaction, Kanbanit offers a powerful yet simple way to manage your projects.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Effortless Task Organization**: Drag and drop tasks to different columns and manage your to-dos with ease.
- **Seamless Sync Across Devices**: Stay up-to-date on any device with data synced in real-time.
- **Customized Dashboard View**: Get a personalized view of your tasks for better focus and productivity.
- **Daily Task Sorting**: Prioritize and organize your tasks for each day of the week.
- **Precise Deadline Monitoring**: Never miss a due date with automatic tracking and reminders.
- **Streamlined Interface Design**: Enjoy a clean, intuitive UI for hassle-free task management.

## Tech Stack

The following technologies are used in Kanbanit:

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Other Tools**: Axios, JWT for authentication

## Project Setup

To set up the Kanbanit project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:
- Node.js (v14.x or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the Repository:**
```bash
    git clone https://github.com/your-username/kanbanit.git
```

3. **Navigate to the Project Directory:**

```bash
    cd kanbanit
```
4. **Install the Dependencies:**

```bash
    npm install
```
5. **Set Up Environment Variables:**

Create a .env file in the project root with respect to the .env.example file and add your MongoDB URL and other environment variables:

```
MONGO_URL = "YOUR MONGO URL"
PORT = PORT
JWT_SECRET = "JWT_SECRET"
```
6. **Start the Development Server:**
```bash
npm run dev
```
Your application should now be running on http://localhost:3000.

### Contributing
Kindly contribute to this project, follow the these steps to do so:
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature-branch).
5. Open a Pull Request.