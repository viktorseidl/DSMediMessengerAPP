import React, { useEffect, useMemo, useState,} from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
// import { TextInput } from 'react-native-windows';
import { Appbar, Avatar, FAB, Searchbar, Drawer, Icon,  } from 'react-native-paper';

import { useTheme } from '../../services/ThemeContext';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';


import UserModal from './UserModal';



export default function Main ({ children, title="", searchQuery, setSearchQuery }) {
    
    const [showUserModal, setShowUserModal] = useState(false)
    const theme = useTheme();
    const styles = useMemo(() =>makeStyles(theme))
    const navigation = useNavigation()
 
    const handleSearchChange = (query) => setSearchQuery(query);



        // useEffect(() => {
        // console.log("Mounted Screen1 on " + Platform.select({windows: "Windows", android:"Android"} )+ " at " + new Date().toLocaleTimeString() + "")
        // return () => {
            
        //     console.log("Unmounted Screen1 on " + Platform.select({windows: "Windows", android:"Android"} )+ " at " + new Date().toLocaleTimeString());

        // }
        
        // }, [])

        // useFocusEffect(
        //     React.useCallback(() => {
        //       console.log('Screen 1 Focused');
             
        
        //       return () => {
              
        //         console.log('Screen 1 Unfocused');
        //       };
        //     }, [])
        //   );


       

    return (
        <View style={styles.container}>
            {/* Appbar */}
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon="menu"  onPress={() => {navigation.openDrawer()}} />
                
                <Searchbar
                inputStyle= {styles.searchBarInput}  
                placeholder="Nachrichten durchsuchen"
                onChangeText={handleSearchChange}
                value={searchQuery}
                onIconPress={()=>{}}
                style={styles.searchBar}
                />
                <TouchableOpacity onPress={() => {setShowUserModal(true)}}>
                    <Avatar.Image size={40} source={{ uri: 'https://gravatar.com/avatar/518615ca996fdaf68c6f70625fc1611e?s=400&d=robohash&r=x' }} />
                </TouchableOpacity>
            </Appbar.Header>


            <View style={{flexDirection:"row", flex:1}}>
                <UserModal showModal={showUserModal} setShowModal={(result)=>setShowUserModal(result)} />
                <View style={{flexDirection:"column", flex:1}}>
                    <Text style={{paddingLeft: 30,color: theme.colors.onSurface}}>{title}</Text>
                    
                    {children}

                </View>
            </View>


            {/* Floating Action Button */}
            <FAB
                style={styles.fab}
                icon="plus"
                color={"white"}
                onPress={() => {navigation.navigate("NewMessage")}}
            />
            <FAB
                style={[styles.fab, {backgroundColor:"red",marginRight:100}, ]}
                icon="arrow-left"
                
                color={"white"}
                onPress={() => navigation.replace("Login")}
            />
            
        
        </View>
    );
};


// Styles
const makeStyles = (theme) =>  StyleSheet.create({
  

    header: {
        backgroundColor: theme.colors.elevation.level1,
        paddingLeft:15,
    },
    container: {
        flex: 1,

        backgroundColor: theme.colors.background,
    },
    searchBar: [
        {
            flex: 1,
            marginHorizontal: 13,
            
            backgroundColor: theme.colors.elevation.level2,

        },
        Platform.select({
            windows: {
                
                borderRadius: 10, 
                
            },
            android: {
                
                paddingHorizontal: 10,
                borderRadius: 25, 
            }
        }),
    ],

    searchBarInput:[
        { 
            borderWidth:0, 
            borderColor:"rgba(0,0,0,0)",  
        }, 
        Platform.select({
            windows:{
                paddingTop:18,  //Benötigt, um das Textfeld bei Windows manuell zu zentrieren
                paddingLeft:10
            }
        })
    ],

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#4285F4',
    },
});