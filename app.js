// @ts-nocheck
const express = require('express'); 
const cors = require('cors');
const spawn = require("child_process").spawn; 
const app = express(); 

app.use(cors());
app.use(express.json());
require('dotenv').config();
  
app.get('/products', function(req, res) {
    const productName = req.query.name;

    const pythonProcess = spawn(process.env.PYTHON_PATH, ["./generate.py", productName]);
    let dataToSend = '';
    
    pythonProcess.stdout.on('data', function(data) { 
        dataToSend += data.toString();
    }); 
    
    pythonProcess.stderr.on('data', function(data) { 
        console.error('stderr: ' + data);
    }); 

    pythonProcess.on('close', function(code) { 
        console.log('child process exited with code ' + code);
        res.send({response: dataToSend});
    });
    
    pythonProcess.on('error', function(err) {
        console.error('Failed to start subprocess:', err);
        res.status(500).send('Internal server error');
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});