// Task1: initiate app and run server at 3000
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));

// Task2: create mongoDB connection 


mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('MongoDB connection error:', error.message));




//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);







//TODO: get data from db  using api '/api/employeelist'

app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching employees'
        });
    }
});




//TODO: get single data from db  using api '/api/employeelist/:id'


app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json(employee);
    } catch (error) {
        res.status(400).json({
            message: 'Error fetching employee'
        });
    }
});




//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}

app.post('/api/employeelist', async (req, res) => {
    try {
        const employee = new Employee({
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary
        });

        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        res.status(400).json({
            message: 'Error adding employee'
        });
    }
});






//TODO: delete a employee data from db by using api '/api/employeelist/:id'


app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json({
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error deleting employee'
        });
    }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}


app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, id, name, location, position, salary } = req.body;

        const employeeId = _id || id;

        if (!employeeId) {
            return res.status(400).json({
                message: 'Employee ID is required'
            });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { name, location, position, salary },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({
            message: 'Error updating employee'
        });
    }
});


//! dont delete this code. it connects the front end file.

app.get(/.*/, function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'Frontend', 'index.html'));
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});



