import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';

import './Feed.css';

import like from '../assets/like.svg';
import more from '../assets/more.svg';
import comment from '../assets/comment.svg';
import send from '../assets/send.svg';

class Feed extends Component {
	state = {
		feed : []
	};

	new_comment = {  
		id: '',
		user: '',
		comment: ''
	};

	async componentDidMount()	{
		this.registerToSocket();

		const response = await api.get('posts');

		this.setState({ feed: response.data });
	}
	
	handleLike = (id) => {
		api.post(`/posts/${id}/like`);
	}

	handleNewComment = (id) => {
		if (document.getElementById(id).style.display == 'block'){
			document.getElementById(id).style.display = 'none';
		}
		else{
			document.getElementById(id).style.display = 'block';
			this.new_comment.id = id;
		}
	}

	handleChangeComment = (e) => {
		if (e.target.name == 'user'){
			this.new_comment.user = e.target.value
		}
		else{
			this.new_comment.comment = e.target.value	
		}	
	}

	handleSendComment = async (e) => {
		e.preventDefault();

		api.post(`/posts/${this.new_comment.id}/comment`, this.new_comment);
		
		document.getElementById(this.new_comment.id).style.display = 'none';
	}

	registerToSocket = () => {
		const socket = io('http://localhost:3333');

		socket.on('post', (newPost) => {
			this.setState({ feed: [newPost, ...this.state.feed] });
		});

		socket.on('like', (newLike) => {
			this.setState({ 
				feed : this.state.feed.map(post => {
					if (post._id == newLike._id){
						post.likes += 1;
					};
					
					return post;
				})
			})
		});

		socket.on('comment', (newComment) => {
			this.setState({
				feed : this.state.feed.map(post => {
					if (post._id == newComment._id){
						post.comments = newComment.comments;
					};

					return post;
				})
			})
		})
		
	};

	render(){
		return(
			<section id="post-list">	
				{ this.state.feed.map(post => (


					<article>
						<header>
							<div class="user-info">
								<span>{post.author}</span>
								<span class="place">{post.place}</span>
							</div>

							<img src={more} alt="Mais" />
						</header>

						<img src={`http://localhost:3333/files/${post.image}`}/>

						<footer>
							<div class="actions">
								<button type="button" onClick={() => this.handleLike(post._id)}>
									<img src={like} alt="Curtir"/>
								</button>
								<img src={comment} alt="Comentar" onClick={() => this.handleNewComment(post._id)} />
								<img src={send} alt="Enviar Mensagem"/>
							</div>

							<strong>{post.likes} curtidas</strong>

							<p>
								{post.description}
								<span>{post.hashtags}</span>
							</p>

							<div class="comments">
								{ post.comments.map(comment => (
									<p>
										<b>{comment.user}</b> {comment.comment}
									</p>
								)) }
							</div>

							<div class="new-comment" id={post._id} >
								<form class="form-comment">
									<input 
										type="text"
										name="user"
										placeholder="Usuário"
										onChange={this.handleChangeComment}
									/>

									<input 
										type="text"
										name="comment"
										placeholder="Comentário"
										onChange={this.handleChangeComment}
									/>

									<button type="submit" onClick={this.handleSendComment}>
										Comentar
									</button>
								</form>
							</div>

						</footer>
					</article>
				)) }
			</section>	
		);
	}
};

export default Feed;