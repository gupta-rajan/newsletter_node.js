const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); 

const app = express();

app.get("/",function(req,res){
    res.sendFile(__dirname+ "/signup.html");
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.post("/",function(req,res){
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;

    const data = {members:[{email_address: email,
                status: "subscribed",
                merge_fields: {FNAME: firstName,
                               LNAME: lastName}
                         }
                        ] 
                };
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/f9f3a8651c"
    const options = {
        method: "POST",
        auth: "Rajan:84256d4825844310bac3756bfbeb4ff0-us21"
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("The server is running on port 3000");
});


// api key
// 84256d4825844310bac3756bfbeb4ff0-us21

// list id
// f9f3a8651c