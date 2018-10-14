import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    Text,
    View
} from 'react-native';
import { projects } from './data';

export default class Projects extends Component {
    static navigationOptions = {
        title: 'Projects',
      };
      
    render() {
        return (
        <View>
            <ScrollView>
            {projects.map((project, index) => <Text style={style.text}>{project.title}</Text>)}
            </ScrollView>
        </View>
        );
  }

}
const style = StyleSheet.create({
    text : {
        marginTop: 10,
        marginLeft: 10,
    }
});
