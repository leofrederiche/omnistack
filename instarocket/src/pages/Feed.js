import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, FlatList, Text  } from 'react-native';
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

    handleLike = (id) => {
		api.post(`/posts/${id}/like`);
	};


    state = {
		feed : []
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

                                    <TouchableOpacity onPress={() => {}}>
                                        <Image source={comment} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {}}>
                                        <Image source={send} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.likes}>{ item.likes } curtidas</Text>
                                <Text style={styles.description}>{ item.description }</Text>
                                <Text style={styles.hashtags}>{ item.hashtags }</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },

    feedItem:{
        marginTop: 20,
    },

    feedItemHeader:{
        paddingHorizontal: 15,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center' // Alinhamento Vertical
    },

    name:{
        fontSize: 14,
        color: '#111'
    },

    place:{
        fontSize: 10,
        color: '#555'
    },

    feedImage:{
        width: '100%',
        height: 400,
        marginTop: 15
    },

    feedItemFooter:{
        paddingHorizontal: 15
    },

    actions:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15
    },

    likes:{
        color: '#111',
        fontWeight: 'bold'
    },

    description:{
        color: '#111',
        lineHeight: 18
    },

    hashtags:{
        color: '#7159c1'
    }

});