# Final Project Fullstack Web Development

This is my final project for fullstack web development. I created a fullstack Keeper application that uses a React frontend, Node/Express backend, and MongoDB as a database.

## Frontend
The frontend directory is at `/client`

If run locally (via `npm start`), the url will be http://localhost:3000.

The application is also deployed at https://final-skb2183.vercel.app/
### `src/index.js`
The index of the application which renders the app.

### `src/config.js`
Contains logic for retrieving the `backendURl`, which will change based on the environment. The deployed frontend includes an environment variable `REACT_APP_BACKEND_URL` that contains the url for the deployed backend.

### `src/components/App.jsx`
The App component, which contains the majority of the logic for the application.

The HTML returned will create a page with an area to input notes, and below that a sequential display of all notes currently in the database. Conditional rendering is used to display an error message when a user tries to add a note with empty fields (or just whitespace) as well as to include a loading wheel while data is being retrieved from the database on load.

The logic before this creates states to hold notes, whether there is an error, and a user variable (for real-time updating with MongoDB). Then, the app will try to initially call `updateNotes()` to retrieve and set the notes data. The app will also try to connect to a MongoDB App Services application to allow for real-time updates—this will inform the application that a change has been made in the database so it can update. Finally, a series of functions are used to handle sending requests to retrieve the most recent data, to add a note to the database, and to remove a note from the database.

#### `updateNotes()`
This is an asychronous function that sends a GET request to retrieve notes from the database, and on success will set the variable `currentNotes` to this list of notes. It is called when the page is initially loades, and when the database is updated

#### `addNote()` and `addNoteToDatabase(note)`
The first function is called when the user clicks the add button. It does input validation to ensure no fields are empty, displaying an error message if they are. Otherwise, it will try to add this note to the database and will update its own list of notes using the text in the input fields and the id returned in the response. The latter function simply handles sending the POST request to the backend.

#### `deleteNote(id)` and `deleteNoteFromDatabase(id)`
When a user clicks the delete button on a given note, the first function will be called and will call the second while also removing the note to be removed from `currentNotes`. The second function sends the DELETE request, using headers to send the id to be deleted (this may not be the most ideal way to send id, but I had trouble getting other methods to work correctly).

#### `handleChange(event)`
This function is simply responsible for keeping the state variable storing the values from the two fields updated when either field changes.

#### `createNote(note)`
This function creates a `Note.jsx` component based on the values of the parameter `note`. It is used with the map function to create components for the entire list of `currentNotes`.

### `src/components/Note.jsx`
This is a Note component, which essentially consists of the title and content that are passed into it via props and a button for deleting the note which is able to call the `deleteNote` function from `App.jsx`.

### `src/components/Header.jsx`
This is simply the page header containing the applications title "Keeper".

### `src/components/Footer.jsx`
This is a simple page footer with copyright information.


## Backend
The frontend directory is at `/server`

Run locally in development mode using `npm run dev`, the url will be http://localhost:5042

The backend is also deployed at https://final-skb2183-production.up.railway.app/

### `server.js`
This contains all of the backend code. It creates an express app, connects to the database, and handles requests from the frontend. 

CORS is used with options to specify certain allowed urls (including where the frontend would be run locally and where it is deployed). 

Mongoose is used to interface with MongoDB, and after connecting a `Note` model is created in order to retrieve and modify the `notes` collection. 

- To handle GET requests, the backend simply calls `Note.find()` to obtain a list of all the notes. 

- To handle POST requests, the backend uses `Note.create(req.body)` to create and save to the database a note with the parameters defined by `req.body`. 

- To handle DELETE requests, the backend tries to `Note.deleteOne(req.headers.id)` to delete just the note corresponding to the `id` sent by the request.



