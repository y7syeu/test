const express = require('express');
const app = express();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const axios = require("axios")
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

function generateRandomToken() {
    const length = 16; // 字符串的长度（以字节为单位）
    const randomBytes = crypto.randomBytes(length);
    const randomString = randomBytes.toString('hex');
    return randomString;
}


app.get('/admin', async (req, res) => {
    try {
        const template = req.query.template;
        console.log(template)
        if (!template) {
            return res.status(400).json({ error: '参数不能为空' });
        }

        axios.get(`http://127.0.0.1:4000/visit?template=${template}`)
            .then(_res => {
                return res.status(200).send("success");
            })
            .catch(err => {
                console.log(err);
            });
    } catch (error) {
        res.status(500).json({ error: 'waring！！！' });
    }
});

app.get('/render', (req, res) => {
    const token = req.query.token || "this_test_token"
    const templateName = req.query.template || 'index';
    console.log(token)
    console.log(templateName)
    res.render(templateName, {token});
});




app.post('/write', (req, res) => {
    const content = req.body.content;
    const token = req.body.token;

    if (!content || !token) {
        return res.status(400).send('content和token不能为空');
    }

    if (content.includes('{{') || content.includes('<%') || content.includes('<') || token.includes("/")) {
        return res.status(400).send('NO you cant！');
    }

    const fileName = `${token}`;
    const filePath = path.join(__dirname, "/public/views/htmls/" + fileName + ".ejs");
    const _content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS-TEST</title>
    <style>
        .your_css {
        ${content}
        }
    </style>

</head>
<body>
<input class="your_css" type="text" name="this_is_input">
<input type="hidden" name="token" value="<%= token %>">
</body>
</html>`

    fs.writeFile(filePath, _content, (err) => {
        if (err) {
            console.error('写入文件时出错：', err);
            return res.status(500).send('写入文件时出错');
        }
        res.status(200).send(`内容已成功写入到public/views/htmls/${fileName}.ejs,<a href="/render?template=htmls/${fileName}&token=${token}">点击查看</a><a href="/admin?template=htmls/${fileName}.ejs">点击发送给admin查看</a>`);
    });
});




app.get('/', (req, res) => {
    const templateName = req.query.template || 'index';
    const token = generateRandomToken();
    // console.log(token);
    res.render(templateName, {token});
});


app.listen(port, () => {
    console.log(`应用正在运行，访问 http://localhost:${port}`);
});
