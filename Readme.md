# TodoList Web Application

This is a simple web application built with Node.js, Express.js, and MongoDB. It allows users to create todo lists with different titles and manage items within those lists. Users can add new items, delete items, and create custom lists.

## Features

- Create new todo lists with custom titles
- Add new items to todo lists
- Delete items from todo lists
- Automatically populates default items for new lists
- View an "About" page to learn more about the application

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS (Embedded JavaScript) for templating
- Body-parser middleware for parsing HTTP request bodies
- Lodash utility library for JavaScript

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Ekansh3503/ToDo-List.git
   ```

2. Install dependencies:

   ```bash
   cd <project-folder>
   npm install
   ```

3. Make sure MongoDB is running on your local machine.

4. Start the server:

   ```bash
   npm start
   ```

5. Open your web browser and navigate to `http://localhost:3000` to view the application.

## Usage

- To create a new todo list, simply enter a custom list title in the URL (e.g., `http://localhost:3000/MyList`) and hit Enter.
- Add new items to a list by typing in the input field and clicking the "+" button.
- Delete items from a list by clicking the checkbox next to the item and then clicking the delete button.
- Navigate to the "About" page by clicking the "About" link in the navigation.

## Folder Structure

- `public`: Contains static assets (e.g., CSS, client-side JavaScript).
- `views`: Contains EJS templates for rendering HTML pages.
- `app.js`: Main entry point of the application where routes are defined and the server is started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
