const express = require('express')
const mongoose = require('mongoose')
const app = express()
const uri = 'mongodb+srv://skb2183:NxNeGsad60skwIrx@keeperappcluster.mv3qjzw.mongodb.net/?retryWrites=true&w=majority'

app.use(express.json());

var cors = require('cors');


var corsOptions = {
	origin: ['http://localhost:3000', 'https://final-skb2183.vercel.app/'],
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  app.use(cors(corsOptions));

app.get("/getNotes", (req, res) => {
	Note.find().then((curNotes) => {
		res.json(curNotes)
	})
})

app.post("/createNote", async(req,res) => {
	try{
		console.log(req.body)
		await Note.create(req.body)
		console.log("Successfully added note to database")
	}
	catch(error){
		console.log(error)
	}
})

app.delete("/deleteNote", async(req,res) => {
	try{
		await Note.deleteOne({_id: req.headers.id})
		console.log("Successfully deleted note from database")
	}
	catch(error){
		console.log(error)
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