
import './packagehandlers/gesture-handler'
import React from 'react';
import {StyleSheet} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/services/ThemeContext';


function App(): React.JSX.Element {
  

  return (

    <ThemeProvider>

      <AppNavigator/>
    </ThemeProvider>
 
  );
}


export default App;
