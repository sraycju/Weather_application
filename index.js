const express =require('express');
const app=express();
app.get("/", function(req, res){
    res.send("");
});
const http=require('http');
const fs = require("fs");
var requests=require("requests");
const homeFile= fs.readFileSync("home.html","utf-8");
  
const replaceVal=(tempVal, orgVal)=>{
    let temperature =tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature =temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature =temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature =temperature.replace("{%location%}", orgVal.name);
    temperature =temperature.replace("{%country%}", orgVal.sys.country);
    temperature =temperature.replace("{%condition%}", orgVal.weather[0].main);
    temperature =temperature.replace("{%feels like%}", orgVal.main.feels_like);
    temperature =temperature.replace("{%wind%}", orgVal.wind.speed);
    temperature =temperature.replace("{%humidity%}", orgVal.main.humidity);
    return temperature;
}
const server=http.createServer((req, res) =>{
    if(req.url=="/"){
    requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=881b3b4ae970de45d39e361657d6c549"
    )
    .on("data",(chunk)=>{
        const objdata=JSON.parse(chunk);
        const arrData=[objdata];

        //console.log(arrData[0].main.temp);
        const realTimeData=arrData
        .map((val)=> replaceVal(homeFile, val))
        .join("");
        res.write(realTimeData);
        //console.log(realTimeData);
    })
    .on("end",(err)=>{
        if(err)return console.log("connection lost due to errors", err);
        res.end();
    });

    }
      
});
server.listen(8000);