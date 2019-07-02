import React from 'react';
import Routes from './routes';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(
	[
		'Unrecognized WebSocket',
		'Each child in a list should have a unique'
	]
);

export default function App(){
  return <Routes />
}
