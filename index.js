const express = require('express');
const route = require("./route/route")
const mongoose  = require('mongoose');
const app = express();


app.use(express.json())


mongoose.connect("mongodb+srv://Aman_Mohadikar:V5FW1Y8X6b2pIiud@cluster0.gdww84s.mongodb.net/project-3")
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

// app.use( (req ,res) => {
//     res.status(404).send({status : false , message :`Page Not Found , Given URL ${req.url} is incorrect for this application.`})
// })

app.listen(3000, function () {
    console.log('Express app running on port ' + 3000)
});