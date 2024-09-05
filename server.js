const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const WHATSAPP_PHONE_NUMBER_ID = '354266431113065';
const ENDPOINT = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
const TEMP_ACCESS_TOKEN = 'EAAWEh2d9r1IBOZBScO8NHlQpdUjeSlzmX9rYuEYWG7GjnKJyeW5ism0Cl4Ix8NSNGVPvNxxe4I5dLYLxTdKq9et5hd17xZAhi0vWYVtxnkQguJJY91kLNdQFvbJeqx7kxXD5jZAf9Aki8ZANwVxAr3HpRhFGg1QMB4jOwUlMqMF2c8ZCb0WZByxZAqldeIYYRzYoOJqd5ecq5sZBklVH7BeF4odro0cZD';
const ACCESS_TOKEN = 'EAAWEh2d9r1IBO797zYZCdE4B7Je7WY70TCkhe18i0O8LFGDF7hLSps1ysRbEZCb6doXAf5MJg8CfhSdNqaaDaHVORAMPuyZC2ZBzOfR42nYOFC99nZB6C0wmw3qOUiZB5fdC4x1ph35JhkeW80YUBXfn0FCzAlZBdzf9Ro3jjaaM7pzuwAA1NXGRvJDckpI3tPjS3ciyZCHds0f7jvNgaRYOCZBJz8JB9DYpVnaUMh78ZD';
const MESSAGE_TEXT = `This is sample message text`;
const MOBILE_NUMBERS = ['919179430062', '917000890062'];   //,'919582321892'];

app.use(bodyParser.json());

app.listen(port,()=>{
    console.log(`Listening to PORT number ${port}`);
});

app.get('/getMessage',(req,res)=>{
    res.send({'connection':'success'});
});

app.post('/sendMessage',async(req,res)=>{
    console.log(req.body);
    let response = await sendMessage(req?.body?.message);

    console.log(response);

    if(response==='error') res.send({status:'error'});
    else res.send({statusList:response});
});

let sendMessageUtil = async (to,message)=>{
    // console.log('in send message');
    let status;

    let headers = {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${ACCESS_TOKEN}`
    };
    let data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        // "type": "text",
        // "text": {
        // "preview_url": true,
        // "body": MESSAGE_TEXT
        // }
        "type": "template",
        "template": { 
          "name": "hello_world",
          "language": { 
            "code": "en_US" 
          } 
        } 
    };
    await axios.post(ENDPOINT, data, {
        headers: headers
    })
    .then((response) => {
        status = response.status;
        // console.log(response.status);
    })
    .catch((error) => {
        status = error.status
        console.log('in errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror');
    });

    return status;
}

let sendMessage = async (message)=>{
    let response=[];

    console.log('in send message');

    await Promise.all(MOBILE_NUMBERS.map(async(number)=>{
        let response2 = await sendMessageUtil(number,message);
        response.push(response2);
    }))
    .then(res=>{
        // console.log('res in promise all '+res);
    });
    

    return response;
}