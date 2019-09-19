const express = require('express');
const fs = require('fs');
const multer = require('multer');
const {TesseractWorker} = require('tesseract.js');

const app = express();

const worker = new TesseractWorker();

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }

})
const upload = multer({storage: storage}).single('avatar');

//ROUTES

app.get('/', (req, res)=>{

    res.render('index.ejs');

})

app.post('/upload', (req, res)=>{

    upload( req, res, (error)=>{
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data)=>{
            if(err)throw err;

            worker.recognize(data, 'eng', {tessjs_create_pdf:"1"})
            .progress(progress=>console.log(progress))
            .then(result=>{res.send(result.text)})
            .then(()=>worker.terminate());

        });
    })


})




const port = 8080; // || process.env.port
app.listen(port, ()=>{console.log(`listening on ${port}`)});