import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, Pressable, Platform, TextInput } from 'react-native';
// import { TextInput } from 'react-native-windows';
import { Appbar, Avatar, FAB, Searchbar, Drawer, Icon,  } from 'react-native-paper';
import MessageDrawer from '../../components/Drawer/MessageDrawer';
import { useTheme } from '../../services/ThemeContext';




// Dummy data for messages
const emails = [
  
  
];

export default function Trash ({ navigation }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [active, setActive] = useState("")
    const [showDrawer, setShowDrawer] = useState(false)
    const theme = useTheme();
    const styles = useMemo(() =>makeStyles(theme))

    const handleSearchChange = (query) => setSearchQuery(query);

    const renderEmailItem = ({ item }) => (
        <TouchableOpacity style={styles.emailItem}>
            <Avatar.Text size={40} label={item.sender[0]} style={styles.avatar} />
            <View style={styles.emailContent}>
                <Text style={styles.sender}>{item.sender}</Text>
                <Text style={styles.subject}>{item.subject}</Text>
                <Text style={styles.preview}>{item.preview}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Appbar */}
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon="menu"  onPress={() => {setShowDrawer(!showDrawer)}} />
                
                
                {/* <View style={[styles.searchBar,{margin: 5, position:"relative", flexDirection:'row-reverse'}]} >
                    <TextInput  textContentType="none"  textAlignVertical='center' defaultValue={searchQuery} onChangeText={handleSearchChange} style={{height:"100%", width:"90%", borderWidth:0, borderColor:"rgba(0,0,0,0)"}} placeholder={"Nachrichten durchsuchen"}/>
                    
                     <TouchableOpacity style={{ width:"10%", justifyContent:"center", alignItems:"center"}}>
                     <Icon source="magnify"  size={24} color="grey" /> 
                     </TouchableOpacity>
              </View> */}
                <Searchbar
                
                
                inputStyle= {styles.searchBarInput}  
                placeholder="Nachrichten durchsuchen"
                onChangeText={handleSearchChange}
                value={searchQuery}
                onIconPress={()=>{}}
                right={Platform.select({windows: ()=>{}})}  //benötigt, um in Windows doppelte clear buttons zu vermeiden
                
                style={styles.searchBar}
                />
                <TouchableOpacity onPress={() => {}}>
                    <Avatar.Image size={40} source={{ uri: 'https://gravatar.com/avatar/518615ca996fdaf68c6f70625fc1611e?s=400&d=robohash&r=x' }} />
                </TouchableOpacity>
            </Appbar.Header>



            <View style={{flexDirection:"row", height:"100%"}}>


                <MessageDrawer showDrawer={showDrawer} setShowDrawer={(bool)=>setShowDrawer(bool)} currentActive="Inbox" />

                {/* Email list */}
                <FlatList
                    data={emails}
                    keyExtractor={(item) => item.id}
                    renderItem={renderEmailItem}
                    contentContainerStyle={styles.emailList}
                />

            </View>


            {/* Floating Action Button */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {navigation.navigate("NewMessage")}}
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

    emailList: {
        paddingHorizontal: 16,
        paddingTop: 8,
        borderRadius:20
    },
    emailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    avatar: {
        marginRight: 12,
        alignItems:"center"
    },
    emailContent: {
        flex: 1,
    },
    sender: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.colors.onBackground,
    },
    subject: {
        fontSize: 14,
        color: theme.colors.onBackground,
    },
    preview: {
        fontSize: 12,
        color:theme.colors.onSurfaceVariant,
    },
    time: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#4285F4',
    },
});