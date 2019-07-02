import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, Text, TextInput  } from 'react-native';
import api from '../services/api';
import io from 'socket.io-client';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import comment from '../assets/comment.png';
import like from '../assets/like.png';
import send from '../assets/send.png';

export default class Feed extends Component{
	static navigationOptions = ({ navigation }) => ({
		headerRight: (
			<TouchableOpacity style={{ marginRight: 20 }} onPress={() => { navigation.navigate('New') }}>
				<Image source={camera} />
			</TouchableOpacity>
		),
	});

	state = {
		feed : [],
		newComment: { user: '', comment: ''},
		current_id: ''
	};

	handleLike = (id) => {
		api.post(`/posts/${id}/like`);
	};

	handleSubmitComment = (id) => {
		api.post(`/posts/${id}/comment`, this.state.newComment)
		this.handleNewComment(id);
	};

	handleNewComment = (id) => {
		if (this.state.current_id == id){
			this.setState({ current_id: '' })
		}
		else {
			this.setState({ current_id: id })
		}
	};

	async componentDidMount()	{
		this.registerToSocket();

		const response = await api.get('posts');
		console.log(response.data);

		this.setState({ feed: response.data });
	};

	registerToSocket = () => {
		const socket = io(api.defaults.baseURL);

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
		});
	};

	render(){
		return(
			<View style={styles.container}>
				<FlatList
					data={this.state.feed}
					keyExtractor={post => post._id}
					renderItem={({ item }) => (
						<View style={styles.feedItem}>
							<View style={styles.feedItemHeader}>
								<View style={styles.userInfo}>
									<Text style={styles.name}>{item.author}</Text>
									<Text style={styles.place}>{ item.place }</Text>
								</View>

								<Image source={more} />
							</View>

							<Image style={styles.feedImage} source={{ uri: `${api.defaults.baseURL}/files/${item.image}` }} />

							<View style={styles.feedItemFooter}>
								<View style={styles.actions}>
									<TouchableOpacity onPress={() => { this.handleLike(item._id) }}>
										<Image source={like} />
									</TouchableOpacity>

									<TouchableOpacity onPress={() => { this.handleNewComment(item._id) }}>
										<Image source={comment} />
									</TouchableOpacity>

									<TouchableOpacity onPress={() => {}}>
										<Image source={send} />
									</TouchableOpacity>
								</View>

								<Text style={styles.likes}>{ item.likes } curtidas</Text>
								<Text style={styles.description}>{ item.description }</Text>
								<Text style={styles.hashtags}>{ item.hashtags }</Text>

								{
									item.comments.map((cmt) => {
										return (
											<View style={ styles.comments }>
												<Text style={ styles.commentUser }>{ cmt.user }</Text>
												<Text> { cmt.comment }</Text>
											</View>
										)
									})
								}

								<View style={ [styles.formComment, (this.state.current_id != item._id) && (styles.hideComment) ]}>
									<TextInput
										style={styles.input}
										autoCorrect={false}
										autoCapitalize='none'
										placeholder='Usuário'
										value={this.state.newComment.user}
										onChangeText={user => this.setState({ user })}
									/>

									<TextInput
										style={styles.input}
										autoCorrect={false}
										autoCapitalize='none'
										placeholder='Comentário'
										value={this.state.newComment.comment}
										onChangeText={comment => this.setState({ comment })}
									/>

									<TouchableOpacity style={styles.commentButton} onPress={this.handleSubmitComment()}>
										<Text style={styles.commentButtonText}>Comentar</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)}
				/>
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
	},

	feedItem:{
		marginTop: 20,
	},

	feedItemHeader:{
		paddingHorizontal: 15,

		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center', // Alinhamento Vertical
	},

	name:{
		fontSize: 14,
		color: '#111',
	},

	place:{
		fontSize: 10,
		color: '#555',
	},

	feedImage:{
		width: '100%',
		height: 400,
		marginTop: 15,
	},

	feedItemFooter:{
		paddingHorizontal: 15,
	},

	actions:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginVertical: 15,
	},

	likes:{
		color: '#111',
		fontWeight: 'bold',
	},

	description:{
		color: '#111',
		lineHeight: 18,
	},

	hashtags:{
		color: '#7159c1',
	},

	comments:{
		flexDirection: 'row',
	},

	commentUser: {
		fontWeight: 'bold',
		color: '#333',
	},

	input:{
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#ccc',
		marginTop: 10,
		paddingHorizontal: 15
	},

	commentButton: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
		marginTop: 10,

		backgroundColor: '#7159c1',
		borderRadius: 4
	},

	commentButtonText: {
		color: '#eee'
	},

	hideComment: {
		display: 'none'
	}
	
});
