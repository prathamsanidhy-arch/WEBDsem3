const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'requests.json');

app.use(express.json());
app.use(express.static('public'));

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET all requests
app.get('/api/requests', (req, res) => {
    const requests = readData();
    res.json(requests);
});

// GET one request
app.get('/api/requests/:id', (req, res) => {
    const requests = readData();
    const request = requests.find(r => r.id === parseInt(req.params.id));
    if (request) {
        res.json(request);
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

// POST a new request
app.post('/api/requests', (req, res) => {
    const requests = readData();
    const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
    const newRequest = {
        id: newId,
        studentName: req.body.studentName,
        email: req.body.email,
        category: req.body.category,
        description: req.body.description,
        priority: req.body.priority
    };
    requests.push(newRequest);
    writeData(requests);
    res.status(201).json(newRequest);
});

// PUT / update a request
app.put('/api/requests/:id', (req, res) => {
    const requests = readData();
    const index = requests.findIndex(r => r.id === parseInt(req.params.id));
    if (index !== -1) {
        requests[index] = {
            id: parseInt(req.params.id),
            studentName: req.body.studentName,
            email: req.body.email,
            category: req.body.category,
            description: req.body.description,
            priority: req.body.priority
        };
        writeData(requests);
        res.json(requests[index]);
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

// DELETE a request
app.delete('/api/requests/:id', (req, res) => {
    let requests = readData();
    const index = requests.findIndex(r => r.id === parseInt(req.params.id));
    if (index !== -1) {
        requests.splice(index, 1);
        writeData(requests);
        res.json({ message: 'Deleted successfully' });
    } else {
        res.status(404).json({ error: 'Request not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
