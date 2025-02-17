import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

//import Test from '../screens/Mains/Test';
import { Button, PaperProvider } from 'react-native-paper';

import NewMessage from '../screens/NewMessage/NewMessage';

import { useTheme } from '../services/ThemeContext';
//import Trash from '../screens/Trash/Trash';
import ShowMessage from '../screens/ShowMessage/ShowMessage';
import PersistentScreen from '../util/PersistentScreen';
import { LoadingContext, UserContext } from '../util/ContextProvider';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Login from '../screens/Login/Login';
import Start from '../screens/Start/Start';
import ConfigSetup from '../screens/ConfigSetup/ConfigSetup';

import { createDrawerNavigator } from '@react-navigation/drawer';
import Inbox from '../screens/Main/Inbox/Inbox';
import Sent from '../screens/Main/Sent/Sent';
import { CustomDrawerContent } from '../components/Drawer/MessageDrawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Main from '../screens/Main/Main';


const Drawer = createDrawerNavigator();

export default function AppNavigator() {

   // const Stack = createStackNavigator();
    const Stack = createStackNavigator();
    const [user, setUser] = useState({username: "SC", password:"959ab9a0695c467e7caf75431a872e5c", dbtype: "P"})
    const [isLoading, setIsLoading] = useState(false)


    const { ...theme } = useTheme();




    function MessageDrawer() {
      return (
        <Drawer.Navigator initialRouteName='Inbox'  drawerContent={(props)=> <CustomDrawerContent {...props} />} screenOptions={{header: () => null,   drawerStyle:{backgroundColor: theme.colors.elevation.level2}, drawerLabelStyle:{activeTintColor:theme.colors.primary}, drawerActiveTintColor: theme.colors.primary, drawerInactiveTintColor:theme.colors.onSurface,}}>
          <Drawer.Screen name="Inbox" component={Inbox} options={{ title: "Posteingang", drawerIcon: ({color, size})=> <Icon name="inbox" color={color} size={size} />, }} />
          <Drawer.Screen name="Trash" component={Trash} options={{ title: "Gelöschte Elemente", drawerIcon: ({color, size})=>  <Icon name="trash-can-outline" color={color} size={size} />}} />
          <Drawer.Screen name="All Messages" options={{ title: "Alle Nachrichten", drawerIcon: ({color, size})=>  <Icon name="email-multiple-outline" color={color} size={size} /> }} component={AllMessages} />
          <Drawer.Screen name="Sent" options={{ title: "Gesendete Elemente", drawerIcon: ({color, size})=>  <Icon name="send" color={color} size={size} /> }} component={Sent} />
        </Drawer.Navigator>
      );
    }


    function Trash({navigation}) {
      return(
        <Main title="Gelöschte Elemente">

        <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
        <Text style={{color:"black"}}>TEST</Text>


      </View>
      </Main>
      )
    }
    function AllMessages({navigation}) {
      return(
        <Main title="Alle Nachrichten">

        <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center"}}>
        <Text style={{color:"black"}}>TEST</Text>


      </View>
      </Main>
      )
    }









  return (
  

      <PaperProvider theme={theme}>
        <UserContext.Provider value={{user, setUser}}>
          <LoadingContext.Provider value={{isLoading, setIsLoading}}>

            <NavigationContainer /*onStateChange={(state) => console.log('New state is ', state)}*/>
    
              <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown:false,  headerMode:"screen",headerStyle: {backgroundColor:theme.colors.elevation.level1,}, headerTintColor:theme.colors.onSurface,}}>
                
                <Stack.Screen name = "Start" component={Start} initialParams={{startparams: {user: user}}}/>
                <Stack.Screen name = "ConfigSetup" component={ConfigSetup}/>
                <Stack.Screen name = "Login" component={Login}/>
                <Stack.Screen name = "Drawer" component={MessageDrawer} />
                {/* <Stack.Screen name = "Drawer"  >
                  {({ navigation, route })=> (
                    <PersistentScreen>
                      <Main navigation={navigation} route={route}/>
                    </PersistentScreen>
                  )}
                </Stack.Screen> */}
                <Stack.Screen name = "Trash" component = {Trash} />
                <Stack.Screen name = "NewMessage" component={NewMessage} options={{headerShown:true, headerTitle:"Neue Nachricht"}} />
                <Stack.Screen name = "ShowMessage" component={ShowMessage} options={{headerShown:true, headerTitle:"Nachricht",  }} />
                

              </Stack.Navigator>
            </NavigationContainer>
          </LoadingContext.Provider>
        </UserContext.Provider>
      </PaperProvider>

       
  );
}


