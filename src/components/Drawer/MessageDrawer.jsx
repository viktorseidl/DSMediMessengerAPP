
import { Drawer, IconButton } from 'react-native-paper';
import { View,} from 'react-native';

import { useTheme } from '../../services/ThemeContext';
import {DrawerContentScrollView,DrawerItemList, } from '@react-navigation/drawer';


export function CustomDrawerContent(props) {
  const theme = useTheme()
  const {isDarkTheme, toggleTheme} = useTheme();

  return (
    <DrawerContentScrollView {...props} >
      <Drawer.Section style={{paddingTop:10}} theme={theme} >
        <DrawerItemList {...props}
        />
      </Drawer.Section>

      <View style={{flex:1, alignItems:"flex-end"}}>


        <IconButton icon="brightness-6" onPress={()=>toggleTheme()} />

      </View>
    </DrawerContentScrollView>
  );
}

