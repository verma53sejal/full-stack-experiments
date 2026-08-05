const Post = require('../models/Post');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('author', 'name email role').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    const post = new Post({ title, content, category, author: req.user.userId });
    await post.save();
    try { await Activity.create({ actor: req.user.userId, actorName: req.user.email, action: 'created post', targetType: 'Post', targetId: post._id }); } catch(e){}
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { title, content, category } = req.body;
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.category = category ?? post.category;
    await post.save();
    try { await Activity.create({ actor: req.user.userId, actorName: req.user.email, action: 'updated post', targetType: 'Post', targetId: post._id }); } catch(e){}
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid post id' });

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found or already deleted' });

    try { await Activity.create({ actor: req.user.userId, actorName: req.user.email, action: 'deleted post', targetType: 'Post', targetId: post._id }); } catch(e){}
    res.status(200).json({ message: 'Post deleted successfully', id: post._id });
  } catch (err) {
    next(err);
  }
};
