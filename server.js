const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post');
const app = express();

const port = process.env.PORT || 3000;
const ip = process.env.IP || 'localhost'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(port, () => {
    console.log(`Server is running at http://${ip}:${port}`);
})

