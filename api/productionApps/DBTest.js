import mongoose from 'mongoose'
import eods from '../models/eods.js'

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true, useUnifiedTopology: true }, async (e) => {
    console.log(e)    
eods.insertMany([{T:"TEST",	
	t: 0,
	o:0,
	h:0,
	l:0,
	c:0,
	v:0,
    d:"TEST"}])
})