const { ObjectId } = require('mongodb');
var Express = require('express')
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
const bodyParser = require('body-parser');

var app = Express()
app.use(cors())
app.use(bodyParser.json());

var CONNECTION_STRING = "mongodb://localhost:27017/Assest"

var DATABASENAME = "Assest";
var database;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EmployeeAssetSchema = new Schema({
  empid: { type: Number, required: true, unique: true },
  empname: { type: String, required: true },
  deptname: { type: String, required: true },
  seatno: { type: Number },

  laptops: [
    {
      host: { type: String },
      model: { type: String },
      serviceTag: { type: String },
      processor: { type: String },
      hdd: { type: String },
      ram: { type: String },
      warranty: { type: Date },
      assigned: { type: Date },
    }
  ],
  monitors: [
    {
      id: { type: Number },
      brand: { type: String },
      size: { type: String },
      serviceTag: { type: String } //Its is seiral Number (S/N)
    }
  ],
  keyboards: [
    {
      id: { type: Number },
      brand: { type: String },
      type: { type: String },
      serialNumber: { type: String }
    }
  ],
  mice: [
    {
      brand: { type: String },
      id: { type: Number },
      type: { type: String },
      serialNumber: { type: String }
    }
  ]
});

const MainModel = mongoose.model('MainModel', EmployeeAssetSchema);

app.listen(5038, () => {
  Mongoclient.connect(CONNECTION_STRING, (error, client) => {
    database = client.db(DATABASENAME);
    console.log("Server is running on port 5038")
  })
})

//Home page get
app.get('/api/Assest/employee', (request, response) => {
  database.collection("mainmodels").find({}).toArray((error, result) => {
    response.send(result);
  })
})

//addNew page Post
app.post('/api/Assest/addemployee', async (req, res) => {
  const {
    empid, empname, deptname, seatno,
    laptops = [],
    monitors = [],
    keyboards = [],
    mice = []
  } = req.body;


  if (!empid || !empname || !deptname) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const newDocument = new MainModel({
    empid,
    empname,
    deptname,
    seatno,
    laptops,
    monitors,
    keyboards,
    mice
  });

  try {
    const savedDocument = await newDocument.save();
    res.status(201).json({ success: true, data: savedDocument });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Employee ID already exists' });
    }
    else {
      res.status(400).json({ success: false, message: error.message });
    }
    console.error(error);
  }
});

//Laptop details Get
app.get('/api/Assest/employee/:id/laptops', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await MainModel.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee.laptops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Add extra laptop
app.post('/api/Assest/employee/:id/laptops', async (req, res) => {
  const employeeId = req.params.id;
  const newLaptop = req.body;

  try {
    const result = await MainModel.findByIdAndUpdate(
      employeeId,
      { $push: { laptops: newLaptop } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error adding laptop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Delete extra laptop
app.delete('/api/Assest/employee/:id/laptops/:laptopId', async (req, res) => {
  const { id, laptopId } = req.params;

  try {
    const result = await MainModel.findByIdAndUpdate(
      id,
      { $pull: { laptops: { _id: laptopId } } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee or Laptop not found' });
    }
  } catch (error) {
    console.error('Error deleting laptop:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Add extra Monitors
app.post('/api/Assest/employee/:id/monitors', async (req, res) => {
  const employeeId = req.params.id;
  const newMonitor = req.body;

  try {
    const result = await MainModel.findByIdAndUpdate(
      employeeId,
      { $push: { monitors: newMonitor } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error adding monitors :', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Delete extra Monitors
app.delete('/api/Assest/employee/:id/monitors/:monitorId', async (req, res) => {
  const { id, monitorId } = req.params;

  try {
    const result = await MainModel.findByIdAndUpdate(
      id,
      { $pull: { monitors: { _id: monitorId } } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee or Monitors not found' });
    }
  } catch (error) {
    console.error('Error deleting monitors :', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Add extra Keyboards
app.post('/api/Assest/employee/:id/keyboards', async (req, res) => {
  const employeeId = req.params.id;
  const newKeyboard = req.body;

  try {
    const result = await MainModel.findByIdAndUpdate(
      employeeId,
      { $push: { keyboards: newKeyboard } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error adding Keyboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Delete extra keyboard
app.delete('/api/Assest/employee/:id/keyboards/:keyboardId', async (req, res) => {
  const { id, keyboardId } = req.params;

  try {
    const result = await MainModel.findByIdAndUpdate(
      id,
      { $pull: { keyboards: { _id: keyboardId } } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee or Keyboard not found' });
    }
  } catch (error) {
    console.error('Error deleting keyboard :', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Add extra Mice
app.post('/api/Assest/employee/:id/mice', async (req, res) => {
  const employeeId = req.params.id;
  const newMouse = req.body;

  try {
    const result = await MainModel.findByIdAndUpdate(
      employeeId,
      { $push: { mice: newMouse } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error adding Keyboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Delete extra mouse
app.delete('/api/Assest/employee/:id/mice/:mouseId', async (req, res) => {
  const { id, mouseId } = req.params;

  try {
    const result = await MainModel.findByIdAndUpdate(
      id,
      { $pull: { mice: { _id: mouseId } } },
      { new: true, useFindAndModify: false }
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Employee or Keyboard not found' });
    }
  } catch (error) {
    console.error('Error deleting keyboard :', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Home page delete button
app.delete('/api/Assest/deleteemployee', (request, response) => {
  // database.collection("mainmodels").deleteOne({
  //     id:request.params.id
  // });
  database.collection("mainmodels").deleteOne({ _id: ObjectId(request.query.id) });
  response.json("Deleted Successfully");
});

//Employee details page
app.get('/api/Assest/employee/:id', async (req, res) => {
  try {
    const employee = await MainModel.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/Assest/search', async (req, res) => {
  try {
      const searchQuery = req.query.q;

      // If the search query is empty, return an empty array
      if (!searchQuery) {
          return res.json([]);
      }

      const searchRegex = new RegExp(searchQuery, 'i'); // case-insensitive regex

      // Building the query
      const query = {
          $or: [
              { empname: searchRegex }, // String field - regex is fine
              { deptname: searchRegex }, // String field - regex is fine
              // Handling nested object properties with regex
              { 'laptops': { $elemMatch: { host: searchRegex } } },
              { 'laptops': { $elemMatch: { model: searchRegex } } },
              { 'laptops': { $elemMatch: { processor: searchRegex } } },
              { 'monitors': { $elemMatch: { brand: searchRegex } } },
              { 'keyboards': { $elemMatch: { brand: searchRegex } } },
              { 'mice': { $elemMatch: { brand: searchRegex } } }
          ]
      };

      // Handling numeric search for empid if applicable
      if (!isNaN(searchQuery)) {
          query.$or.push({ empid: Number(searchQuery) });
      }

      const results = await MainModel.find(query);
      res.json(results);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});




app.put('/api/Assest/updateemployee/:id', async (req, res) => {
  const {
    empid, empname, deptname, seatno,
    laphost, lapmodel, Processor, RAM, HDD, warrenty, assigned,
    moniid, monibrand, monisn, size, servicetag,
    keyID, keybrand, keytype, keysn,
    mousebrand, mousemodel, mouseID, mousetype, mousesn
  } = req.body;

  try {
    const updatedDocument = await MainModel.findByIdAndUpdate(
      req.params.id,
      {
        empid, empname, deptname, seatno,
        laphost, lapmodel, Processor, RAM, HDD, warrenty, assigned,
        moniid, monibrand, monisn, size, servicetag,
        keyID, keybrand, keytype, keysn,
        mousebrand, mousemodel, mouseID, mousetype, mousesn
      },
      { new: true }
    );
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

mongoose.connect('mongodb://localhost:27017/Assest', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connection to MongoDB is open');
});