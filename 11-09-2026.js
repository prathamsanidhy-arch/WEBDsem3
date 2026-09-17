import express from "express";
import fs from "fs";
const app = express();
const PORT = 3000;
app.get('/', (req,res) => {
    fs.readFile('./pages/index.html',(err,data) => {
        if(err){
            res.status(500).send("Error reading file");
            return;
        }
        res.send(data);
    });
});
app.get('/about',(req,res) => {
    fs.readFile('./pages/about.html',(err,data) => {
        if(err){
            res.status(500).send("Error reading file");
            return;
        }
        res.send(data);
      });     
});
app.get('/contact',(req,res) => {
    fs.readFile('./pages/contact.html',(err,data) => {
        if(err){
            res.status(500).send("Error reading file");
            return;
        }
        res.send(data);  
      });      
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
