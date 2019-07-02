import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import api from '../services/api';

export default class New extends Component{
	static navigationOptions = {
		headerTitle: 'Nova publicação'
	};

	state = {
		preview : null,
		image : null,
		author: '',
		description: '',
		place: '',
		hashtags: ''
	};

	handleSelectImage = () => {
		const options = { 
			title: 'Selecione uma imagem'
		};

		ImagePicker.showImagePicker(options, 
			(upload) => {
				if (upload.error){
					console.log('Erro ao realizar o upload da imagem');
				}
				else if (upload.didCancel){
					console.log('Upload cancelado');
				}
				else{
					const preview = {
						uri: `data:image/jpeg;base64,${upload.data}`,
					}

					const fileName = new Date().toISOString().slice(0,19).replace(/:/g, '').replace(/-/g,'')

					const image = {
						uri: upload.uri,
						type: upload.type,
						name: `${fileName}.jpg`
					}

					this.setState({ preview, image })
				}
			}
		)
	}

	handleSubmit = async () => {
		const data = new FormData()

		data.append('image', this.state.image);
		data.append('author', this.state.author);
		data.append('description', this.state.description);
		data.append('place', this.state.place);
		data.append('hashtags', this.state.hashtags);

		await api.post('posts', data);

		this.props.navigation.navigate('Feed')
	}

	render(){
		return(
			<View style={styles.container}>
				<TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
					<Text style={styles.selectButtonText}>Selecionar Imagem</Text>
				</TouchableOpacity>

				<View style={styles.containerPreview}>
					{ this.state.preview && <Image style={styles.preview} source={this.state.preview} /> }
				</View>

				<TextInput 
					style={styles.input}
					autoCorrect={false}
					autoCapitalize='none'
					placeholder='Nome do autor'
					value={this.state.author}
					onChangeText={author => this.setState({author})}
				/>

			<TextInput  
				style={styles.input}
				autoCorrect={false}
				autoCapitalize='none'
				placeholder='Local'
				value={this.state.place}
				onChangeText={place => this.setState({place})}
			/>

		<TextInput  
			style={styles.input}
			autoCorrect={false}
			autoCapitalize='none'
			placeholder='Descrição'
			value={this.state.description}
			onChangeText={description => this.setState({description})}
		/>

	<TextInput  
		style={styles.input}
		autoCorrect={false}
		autoCapitalize='none'
		placeholder='Hashtags'
		value={this.state.hashtags}
		onChangeText={hashtags => this.setState({hashtags})}
	/>

<TouchableOpacity style={styles.shareButton} onPress={this.handleSubmit}>
	<Text style={styles.shareButtonText}>Compartilhar</Text>
</TouchableOpacity>
						</View>
		);
	}
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 30
	},

	selectButton:{
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#ccc',

		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 15
	},

	input:{
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#ccc',
		marginTop: 10,
		paddingHorizontal: 15
	},

	shareButton:{
		backgroundColor: '#7159c1',
		borderRadius: 4,

		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 15,
		fontSize: 16,
		marginTop: 10
	},

	shareButtonText:{
		color: '#FFF'
	},

	containerPreview:{
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10,
	},

	preview:{
		width: 100,
		height: 100,

		borderRadius: 4,
		borderColor: '#ccc',
		borderWidth: 1
	}
});
