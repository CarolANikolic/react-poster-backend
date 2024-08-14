const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();

app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.get('/posts', async (req, res) => {
    const storedPosts = await getStoredPosts();
    res.json({ posts: storedPosts });
});

app.get('/posts/:id', async (req, res) => {
    const storedPosts = await getStoredPosts();
    const post = storedPosts.find((post) => post.id === req.params.id);
    res.json({ post });
});

app.post('/posts', async (req, res) => {
    const existingPosts = await getStoredPosts();
    const postData = req.body;
    const newPost = {
    ...postData,
    id: uuidv4(),
    };
    const updatedPosts = [newPost, ...existingPosts];
    await storePosts(updatedPosts);
    res.status(201).json({ message: 'Stored new post.', post: newPost });
});

// Set up the server
app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
});