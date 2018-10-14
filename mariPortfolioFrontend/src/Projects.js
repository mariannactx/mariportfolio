import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View
} from 'react-native';
import { projects } from './data';
import Project from './Project';
import ProjectPopup from './ProjectPopup';

export default class Projects extends Component {
    static navigationOptions = {
        title: 'Projects',
    };

    state = {
        popupIsOpen: false,
    }

    openProject = (project) => {
        this.setState({
            popupIsOpen: true,
            project
        })
    }
    closeProject = (project) => {
        this.setState({
            popupIsOpen: false
        })
    }
      
    render() {
        return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}    
            >
            {projects.map((project, index) => <Project 
                project={project}
                onOpen={this.openProject}
                key={index}
                />)}
            </ScrollView>

            <ProjectPopup
                project={this.state.project}
                isOpen={this.state.popupIsOpen}
                onClose={this.closeProject}
            />
        </View>
        );
  }

}
const styles = StyleSheet.create({
    text : {
        marginTop: 10,
        marginLeft: 10,
    },
    container: {
        paddingTop: 20,         // start below status 
        flex: 1
    },
    scrollContent: {
        flexDirection: 'row',   // arrange posters in rows
        flexWrap: 'wrap',       // allow multiple rows
    },
});
