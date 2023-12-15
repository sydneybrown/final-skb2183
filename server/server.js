const express = require('express')
const mongoose = require('mongoose')
const app = express()
const uri = 'mongodb+srv://skb2183:NxNeGsad60skwIrx@keeperappcluster.mv3qjzw.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json());

var cors = require('cors');


var corsOptions = {
	origin: ['https://final-skb2183.vercel.app', 'http://localhost:3000', 'https://final-skb2183-sydneybrowns-projects.vercel.app'],
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.use(cors(corsOptions));

app.get("/getNotes", async (req, res) => {
	try{
		curNotes = await Note.find()
		res.status(201).json(curNotes)

	}
	catch(error)
	{
		console.log(error)
		res.status(500)
	}
})

app.post("/createNote", async(req,res) => {
	try{
		console.log(req.body)
		let newNote = await Note.create(req.body)
		res.status(201).json(newNote)
		console.log("Successfully added note to database")
	}
	catch(error){
		console.log(error)
		res.status(500)
	}
})

app.delete("/deleteNote", async(req,res) => {
	try{
		await Note.deleteOne({_id: req.headers.id})
		console.log("Successfully deleted note from database")
		res.status(201)
	}
	catch(error){
		console.log(error)
		res.status(500)
	}
})

async function connect(){
	try{
		await mongoose.connect(uri)
		console.log("Connected to MongoDB")
	}
	catch(error){
		console.log(error)
	}
}


connect();
var noteSchema = new mongoose.Schema({ title: 'string', content: 'string' });
var Note = mongoose.model('Note', noteSchema);

app.listen(5042,() => {console.log("Server started on port 5042")})