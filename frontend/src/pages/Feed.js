import React, { Component } from 'react';
import api from '../services/api';

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
		const response = await api.get('posts');

		this.setState({ feed: response.data });
	}

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
								<img src={like} alt="Curtir"/>
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