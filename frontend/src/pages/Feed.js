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

	async componentDidMount()	{
		this.registerToSocket();

		const response = await api.get('posts');

		this.setState({ feed: response.data });
	};
	
	handleLike = (id) => {
		api.post(`/posts/${id}/like`);
	};

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
								<img src={comment} alt="Comentar"/>
								<img src={send} alt="Enviar Mensagem"/>
							</div>

							<strong>{post.likes} curtidas</strong>

							<p>
								{post.description}
								<span>{post.hashtags}</span>
							</p>
						</footer>
					</article>
				)) }
			</section>	
		);
	}
};

export default Feed;