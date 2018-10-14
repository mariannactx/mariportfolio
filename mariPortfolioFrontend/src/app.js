import {
    createStackNavigator,
  } from 'react-navigation';
import Projects from './Projects';

  const App = createStackNavigator({
    Home: { screen: Projects }
  });
  
  export default App;
