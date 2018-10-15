import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    LayoutAnimation,
    PanResponder,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { defaultStyles } from './styles'
import PropTypes from 'prop-types';

const { width, height } = Dimensions.get('window');
const defaultHeight = height * 0.67;

export default class ProjectPopup extends Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    // Project object that has title, stack, thumb, url
    project: PropTypes.object,
    // Gets called when popup closed
    onClose: PropTypes.func,
  }

  state = {
    position: new Animated.Value(this.props.isOpen ? 0 : height),
    // height: height / 2,
    // Backdrop opacity
    opacity: new Animated.Value(0),
    // Popup height that can be changed by pulling it up or down
    height: defaultHeight,
    // Expanded mode with bigger thumb flag
    expanded: false,
    // Visibility flag
    visible: this.props.isOpen,
  };

  _previousHeight = 0

  componentWillMount() {
    // Initialize PanResponder to handle move gestures
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        // Ignore taps
        if (dx !== 0 && dy === 0) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Store previous height before user changed it
        this._previousHeight = this.state.height;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Pull delta and velocity values for y axis from gestureState
        const { dy, vy } = gestureState;
        // Subtract delta y from previous height to get new height
        let newHeight = this._previousHeight - dy;

        // Animate heigh change so it looks smooth
        LayoutAnimation.easeInEaseOut();

        // Switch to expanded mode if popup pulled up above 80% mark
        if (newHeight > height - height / 5) {
          this.setState({ expanded: true });
        } else {
          this.setState({ expanded: false });
        }

        // Expand to full height if pulled up rapidly
        if (vy < -0.75) {
          this.setState({
            expanded: true,
            height: height
          });
        }

        // Close if pulled down rapidly
        else if (vy > 0.75) {
          this.props.onClose();
        }
        // Close if pulled below 75% mark of default height
        else if (newHeight < defaultHeight * 0.75) {
          this.props.onClose();
        }
        // Limit max height to screen height
        else if (newHeight > height) {
          this.setState({ height: height });
        }
        else {
          this.setState({ height: newHeight });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dy } = gestureState;
        const newHeight = this._previousHeight - dy;

        // Close if pulled below default height
        if (newHeight < defaultHeight) {
          this.props.onClose();
        }

        // Update previous height
        this._previousHeight = this.state.height;
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }


  // Handle isOpen changes to either open or close popup
  componentWillReceiveProps(nextProps) {
    // isOpen prop changed to true from false
    if (!this.props.isOpen && nextProps.isOpen) {
      this.animateOpen();
    }
    // isOpen prop changed to false from true
    else if (this.props.isOpen && !nextProps.isOpen) {
      this.animateClose();
    }
  }

  // Open popup
  animateOpen() {
    // Update state first
    this.setState({ visible: true }, () => {
        Animated.parallel([
          // Animate opacity
          Animated.timing(
            this.state.opacity, { toValue: 0.5 } // semi-transparent
          ),
          // And slide up
          Animated.timing(
            this.state.position, { toValue: 0 } // top of the screen
          ),
        ]).start();
      });
  }

  // Close popup
  animateClose() {
    Animated.parallel([
        // Animate opacity
        Animated.timing(
          this.state.opacity, { toValue: 0 } // transparent
        ),
        // Slide down
        Animated.timing(
          this.state.position, { toValue: height } // bottom of the screen
        ),
      ]).start(() => this.setState({
        // Reset to default values
        height: defaultHeight,
        expanded: false,
        visible: false,
      }));
  }

    // Dynamic styles that depend on state
    getStyles = () => {
        return {
          imageContainer: this.state.expanded ? {
            width: width / 2,         // half of screen widtj
          } : {
            maxWidth: 110,            // limit width
            marginRight: 10,
          },
          projectContainer: this.state.expanded ? {
            flexDirection: 'column',  // arrange image and projectinfo in a column
            alignItems: 'center',     // and center them
          } : {
            flexDirection: 'row',     // arrange image and projectinfo in a row
          },
          projectInfo: this.state.expanded ? {
            flex: 0,
            alignItems: 'center',     // center horizontally
            paddingTop: 20,
          } : {
            flex: 1,
            justifyContent: 'center', // center vertically
          },
          title: this.state.expanded ? {
            textAlign: 'center',
          } : {},
        };
      }

  render() {

    const {
        project
    } = this.props;

    const { title, url, stack, thumb, description, created} = project || {};

    // Render nothing if not visible
    if (!this.state.visible) {
      return null;
    }
    return (
      <View style={styles.container}>
        {/* Closes popup if user taps on semi-transparent backdrop */}
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <Animated.View style={[styles.backdrop, {opacity: this.state.opacity}]}/>
        </TouchableWithoutFeedback>
        <Animated.View
          style={[styles.modal, {
            // Animates height
            height: this.state.height,
            // Animates position on the screen
            transform: [{ translateY: this.state.position }, { translateX: 0 }]
          }]}
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Project thumb, title and created */}
            <View
              style={[styles.projectContainer, this.getStyles().projectContainer]}
              {...this._panResponder.panHandlers}
            >
              {/* Thumb */}
              <View style={[styles.imageContainer, this.getStyles().imageContainer]}>
                <Image source={{ uri: thumb }} style={styles.image} />
              </View>
              {/* Title and created */}
              <View style={[styles.projectInfo, this.getStyles().projectInfo]}>
                <Text style={[styles.title, this.getStyles().title]}>{title}</Text>
                <Text style={styles.created}>{created}</Text>
              </View>
            </View>

            {/* Description*/}
            <View>
                <Text style={styles.sectionHeader}>Description</Text>
                <Text>{project.description}</Text>
            </View>

            {/* Stack */}
            <View>
                <Text style={styles.sectionHeader}>Stack</Text>
                {project.stack.map((tech, index) => <Text key={index}>{tech}</Text> )}
            </View>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableHighlight
              underlayColor="#9575CD"
              style={styles.buttonContainer}
            >
              <Text style={styles.button}>Go to website</Text>
            </TouchableHighlight>
          </View>
        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
    // Main container
    container: {
      ...StyleSheet.absoluteFillObject,   // fill up all screen
      justifyContent: 'flex-end',         // align popup at the bottom
      backgroundColor: 'transparent',     // transparent background
    },
    // Semi-transparent background below popup
    backdrop: {
      ...StyleSheet.absoluteFillObject,   // fill up all screen
      backgroundColor: 'black',
    },
    // Popup
    modal: {
      backgroundColor: 'white',
    },
    content: {
      flex: 1,
      margin: 20,
      marginBottom: 0,
    },
    // Project container
    projectContainer: {
      flex: 1,                            // take up all available space
      marginBottom: 20,
    },
    imageContainer: {
      flex: 1,                            // take up all available space
    },
    image: {
      borderRadius: 10,                   // rounded corners
      ...StyleSheet.absoluteFillObject,   // fill up all space in a container
    },
    projectInfo: {
      backgroundColor: 'transparent',     // looks nicier when switching to/from expanded mode
    },
    title: {
      ...defaultStyles.text,
      fontSize: 20,
    },
    created: {
      ...defaultStyles.text,
      color: '#BBBBBB',
      fontSize: 14,
    },
    sectionHeader: {
      ...defaultStyles.text,
      color: '#AAAAAA',
    },
    // Footer
    footer: {
      padding: 20,
    },
    buttonContainer: {
      backgroundColor: '#673AB7',
      borderRadius: 100,
      paddingVertical: 10,
      paddingHorizontal: 15,
      alignItems: 'center',
    },
    button: {
      ...defaultStyles.text,
      color: '#FFFFFF',
      fontSize: 18,
    },
});