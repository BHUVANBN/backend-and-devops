//Express.js used for setting up server
//ip address - 127.0.0.1:8000
//url - http://localhost:8000
const express = require('express')
const app = express()
const PORT = 8000 //subdirectory of ip address

//middleware
app.use(express.json()) //used to turn raw incoming request data into usable JavaScript objects

//method - nature of the request - http methods
//crud operations - create(post), read(get), update(put), delete(delete)
//routes - endpoints

//website endpoints - sending html
app.get("/",(req,res)=>{
    console.log("requested endpoint / by", req.method, "method")
    res.sendStatus(201)
})
app.get("/dashboard",(req,res)=>{
    res.send("<h1>hii its dashboard</h1>")
    console.log("visited dashboard")
})
//rest client is an extension used to emulate the rest api req and reponse instead of browser
//api endpoints - process data
let data = ["batman"]

app.get("/api/data",(req,res)=>{
    console.log("this is api endpoint")
    res.status(201).send(   //send status and html with response
        `<body style="background:blue; color: red">
            <h1>data - </h1>
            <p>${JSON.stringify(data)}</p>

        </body>`
    )
})
app.post("/api/data",(req,res)=>{
    const newData = req.body   //get the user entering data
    console.log(newData)
    data.push(newData.name)
    res.sendStatus(201)

})
app.delete("/api/data/:name",(req,res)=>{
    data = data.pop()
    console.log(data,"deleted")
    res.sendStatus(201)
})

app.listen(PORT,()=>{console.log(`server started at ${PORT}`)})