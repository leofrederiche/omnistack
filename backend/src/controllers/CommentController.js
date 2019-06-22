const Post = require('../models/Post');

module.exports = {
    async store(req, res){
        const comment = req.body;
        const post = await Post.findById(req.params.id);

        post.comments.push(comment);

        await post.save();
        
        req.io.emit('comment', post)
        return res.json(post);
    }
}