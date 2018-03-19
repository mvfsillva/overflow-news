import './src/bootstrap'
import express from 'express'
import dotenv from 'dotenv'
import { Post, Feed } from './models'

const app = express();

const { PORT = 8080 } = process.env;

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const posts = await Post.find({})
        .limit(30)
        .sort({'date': -1})
    res.render('index', { posts });
});

app.get('/feeds', async (req, res) => {
    const feeds = await Feed.find({})
        .limit(50)
        .sort({'date': -1})
    res.render('feeds', { feeds });
});

app.listen(PORT);