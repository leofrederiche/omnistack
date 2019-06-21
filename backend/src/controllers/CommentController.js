const Post = require('../models/Post');

module.exports = {
    async store(req, res, data){
        const comment = req.body;
        const post = await Post.findById(req.params.id);

        post.comments.push(comment);

        await post.save();
        
        return res.json(post);
    }
}