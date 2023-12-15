import React, {useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import  *  as  Realm  from  "realm-web";

const  app = new  Realm.App({ id:  "application-0-deyhz"});

function App() {
  const [inputText, setInput] = useState({
    title: "",
    content: ""
  });
  const [currentNotes, setNotes] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    fetch("/getNotes").then(response => response.json()).then(data => {
      setNotes(data)
    })
  }, []);

  /**
   * This portion of code allows for realtime updates
   * The code has been modified from the following tutorial from Joel Lord on MongoDB's site:
   * https://www.mongodb.com/developer/products/mongodb/real-time-data-javascript/
   */
  useEffect(() => {
    const  login = async () => {
    // Authenticate anonymously
    const  user = await  app.logIn(Realm.Credentials.anonymous());
    setUser(user);
    
    // Connect to the database
    const  mongodb = app.currentUser.mongoClient("mongodb-atlas");
    const  collection = mongodb.db("test").collection("notes");
    
    // Everytime a change happens in the stream, add it to the list of events
    for  await (const  change  of  collection.watch()) {
    updateNotes();
    }
    }
    login();
    }, []);



  async function addNoteToDatabase(note){
    try{
    fetch("/createNote",
    {method: "POST",
    headers: {
      'Content-Type': 'application/json',
  },
    body: JSON.stringify(note)
      
    })}
    catch(error)
    {
      console.log(error)
    }
  }

  async function updateNotes(){
    try{
    const res = await fetch("/getNotes", {method: "GET"})
    const data = await res.json()
    setNotes(data)
  }
    catch(error)
    {
      console.log(error)
    }
  }

  async function deleteNoteFromDatabase(id){
    try{
    fetch("/deleteNote",
    {method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
  },
    body: JSON.stringify({"_id": id})
      
    })}
    catch(error)
    {
      console.log(error)
    }
  }

  function handleChange(event) {
    const { value, name } = event.target;

    setInput((prevValue) => {
      if (name === "title") {
        return {
          title: value,
          content: prevValue.content
        };
      } else if (name === "content") {
        return {
          title: prevValue.title,
          content: value
        };
      }
    });
  }

  function addNote() {
    if(inputText.content.trim().length !== 0 && inputText.title.trim().length !== 0)
    {
      addNoteToDatabase(inputText);
      setNotes((prevNotes) => {
        return [...prevNotes, inputText];
      });
      setInput({
        title: "",
        content: ""
      });

    }
    else
    {

    }
   
  }

  function deleteNote(id) {
    deleteNoteFromDatabase(id)
    setNotes((prevNotes) => {
      const ind = prevNotes.findIndex((note) => {
        return note._id === id;
      });
      if (ind > -1) prevNotes.splice(ind, 1);
      return [...prevNotes];
    });
  }

  function createNote(note) {
    return (
      <Note
        key={note._id}
        id={note._id}
        title={note.title}
        content={note.content}
        deleteNote={deleteNote}
      />
    );
  }

  return (
    <div>
      <Header />
      <div className="note-creator">
        <input
          name="title"
          onChange={handleChange}
          type="text"
          placeholder="Title"
          value={inputText.title}
        />
        <textarea
          name="content"
          onChange={handleChange}
          type="paragraph_text"
          placeholder="Take a note..."
          value={inputText.content}
          rows="3"
        />
        <button onClick={addNote}>
          <span>Add</span>
        </button>
      </div>
      <div />
      {currentNotes.map(createNote)}
      <Footer />
    </div>
  );
}

export default App;
