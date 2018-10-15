import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { defaultStyles } from './styles';
import PropTypes from 'prop-types';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// How many thumbs we want to have in each row and column
const cols = 3, rows = 3;

export default class Project extends Component {
  // Component prop types
  static propTypes = {
    // Project object with title, url, and thumb
    project: PropTypes.object.isRequired,
    // Called when user taps on a thumb
    onOpen: PropTypes.func.isRequired,
  }
  render() {
    const { project, project: { title, url, thumb }, onOpen } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={() => onOpen(project)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: thumb }} style={styles.image} />
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.url} numberOfLines={1}>{url}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: (height - 20 - 20) / rows - 10,
    width: (width - 10) / cols - 10,
  },
  imageContainer: {
    flex: 1,                          // take up all available space
  },
  image: {
    borderRadius: 10,                 // rounded corners
    ...StyleSheet.absoluteFillObject, // fill up all space in a container
  },
  title: {
    ...defaultStyles.text,
    fontSize: 14,
    marginTop: 4,
  },
  url: {
    ...defaultStyles.text,
    color: '#BBBBBB',
    fontSize: 12,
    lineHeight: 14,
  },
});