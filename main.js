const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Contact = require('./contact.model');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;
const db = "mongodb://localhost:27017/phonebook";

const storage = multer.diskStorage({
	destination: (req, file, cb)=>cb(null, __dirname+'/public/upload'),
	filename: (req, file, cb)=> cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb, res)=>{
			var ext = path.extname(file.originalname).toLowerCase();
			if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
				return cb(res.send('Only images are allowed'), null)
			}
			cb(null, true)
		}

const upload = multer({storage: storage, fileFilter: fileFilter, limits: {fileSize: 2500000}});

mongoose.Promise = global.Promise;
mongoose.connection.openUri(db);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use((err,req,res,next)=>{
	res.status(422).send({error: err.message})
})

app.get('/', (req, res)=> res.sendFile(__dirname+ '/contacts.html'));

app.get('/get_contacts', (req, res)=>{ 
	Contact.find({}).exec((err, contacts)=>{
		if(err){
           res.send("Error!");
		}else{
		   res.json(contacts);
		}
	});
});

app.post('/add_contact',upload.single('avatar'),(req,res)=>{
	var body = req.body;
	    body.avatar = req.file.filename
        body.hobbies = [{
							"hobby": "Surfing"
						}, {
							"hobby": "Swiming"
						}, {
							"hobby": "Exhibition"
						}, {
							"hobby": "Books"
						}];
      Contact.create(body)
      .then(contact=> res.send(contact))
      .catch(err=> res.send(err))
});


app.post('/hobby/:id', (req,res)=>{
	Contact.findOne({
		_id: req.params.id
	}).exec((err, contacts)=>{
		if(err){ 
			res.send("Error!")
		}else{ 
			res.json(contacts)
		}
	});
});

app.delete('/delete/:id', (req, res)=>{
    Contact.findOneAndRemove({
    	_id: req.params.id
    }, (err, contact)=>{
      	 err?res.send('Error!'):(fs.unlink(`./public/upload/${contact.avatar}`, err=>{
      	 	if(err) throw err;
      	 }),res.send('Deleted'));
    });
});

app.listen(port, ()=> console.log("server Listening to port"+ port));








// app.put('/contact/:id', (req, res)=>{
//     Contact.findOneAndUpdate({
//     	_id: req.params.id
//     },
//       {
//     	$set:{
//     		first_name: req.body.first_name,
//     		last_name: req.body.last_name,
//     		phone: req.body.phone,
//     		email: req.body.email
//     	}
//       }, {upsert: false, new: true}, (err, newContact)=>{
//       	    err?res.send('Error!'):res.send(newContact);
//     });
// });


//let newContact = new Contact(body);

// newContact.name = body.name;
// newContact.lastname = body.lastname;
// newContact.phone = body.phone;
// newContact.email = body.email;
// newContact.avatar = body.avatar;
// newContact.hobbies = body.hobbies;

// newContact.save((err, contact)=>{
// 	err?res.send('Error!'):res.send(contact);
// });