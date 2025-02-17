import React, { useEffect, useMemo, useState, useRef, memo, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, Pressable, Platform, TextInput, Alert, ScrollView, RefreshControl } from 'react-native';
// import { TextInput } from 'react-native-windows';
import { useTheme } from '../../../services/ThemeContext';
import apiConnect from '../../../services/APIConnector';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import LoadingComponent from '../../../components/LoadingComponent';
import { UserContext } from '../../../util/ContextProvider';
import dayjs from 'dayjs';
import Main from '../Main';



export default function Sent ({ navigation }) {
    const [searchQuery, setSearchQuery] = useState("")
    const {user, setUser} = useContext(UserContext)
    const theme = useTheme();
    const styles = useMemo(() =>makeStyles(theme))
    const [mails, setMails] =  useState([]);
    const [refreshing, setRefreshing] = useState(false)



    const flatListRef = useRef(null);
    const [mailsIsLoaded, setMailsIsLoaded] = useState(false);
    const isFocused = useIsFocused();



    const renderEmailItem = ({ item }) => (

        searchQuery === "" || Object.values(item).toString().toLowerCase().includes(searchQuery.toLowerCase()) ?

            <Pressable style={({pressed})=> [styles.emailItem,{opacity:pressed?0.5:1}]} onPress={()=>navigation.navigate("ShowMessage", {item: item})}>

                {/* <Avatar.Text size={40} label={item.fullName!==null && item.fullName!==""? item.fullName[0]:item.Erfasser[0]} style={styles.avatar} /> */}
                <View style={[styles.avatar,{justifyContent:"center", alignItems:"center", backgroundColor:theme.colors.primary, height:40, width:40, borderRadius:40}] }>

                    <Text  style={{color:theme.colors.onPrimary, fontSize:20}}>{item.fullName!==null && item.fullName!==""? item.fullName[0]:item.Sender[0]}</Text>

                </View>


                <View style={styles.emailContent}>
                    <Text style={styles.Sender}>{item.fullName!==null && item.fullName!==""? item.fullName:item.Sender}</Text>
                    
                    <Text style={styles.Betreff}>{item.Betreff}</Text>
                    <Text numberOfLines={1} style={styles.Nachricht}>{(item.Nachricht.replace(/\r?\n|\r/g, " "))}</Text>
                </View>
                {/* {item.Dringlichkeit==2&&
                    
                <Avatar.Icon size={30} icon={"exclamation"} style={[styles.avatar, {backgroundColor:"red",}]} />
                } */}
                
                    <Text style={styles.time}>{ (new Date(item.Datum) < new Date(new Date().toDateString()) ?  dayjs(item.Datum).format("DD.MM.YYYY") : new Date(item.Datum).toLocaleTimeString([], {hour: "2-digit", minute:"2-digit"}))}</Text>
            </Pressable>
        : null
    );


    async function loadMessages() {

        setMailsIsLoaded(false);
        try {
            const data = await apiConnect({"user": user.username, "password": user.password, "dbtype": user.dbtype}, "messages/3")
            //console.log("Result: " + JSON.stringify(data))
            
            if(data.success)
            {
                if (data.data.length !== 0)
                {

                    data.data.forEach(((element, id) => 
                        {
                            
                            data.data[id].Nachricht = data.data[id].Nachricht.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                            
                        }
                    ))
                    data.data.sort((a,b) =>  new Date(b.Datum)- new Date(a.Datum) )
                    console.log("CHANGED DATA: " + JSON.stringify(data.data))
                    console.log(new Date(data.data[0].Datum))
                    console.log(new Date(new Date().toDateString()))
                    setMails(data.data)
                }
                else 
                {
                    console.log("DATA EMPTY")
                    setMails([])
                }
               
            }
        }
        catch(error)
        {
            console.log(" ERROR IN FETCH: "+ error)
            Alert.alert("Fehler", "Es ist ein Fehler beim Laden der Nachrichten aufgetreten: " + error.message)
        }
        setMailsIsLoaded(true);
    }

        const onRefresh = useCallback(() => {
                setRefreshing(true);
                loadMessages()
                setRefreshing(false)
            
            }, []);


        useEffect(() => {
        loadMessages()
       
            
        
        }, [])


    return (
     
        <Main title="Postausgang" searchQuery={searchQuery} setSearchQuery={(query)=>setSearchQuery(query)}>
                {/* Email list */}

                {!mailsIsLoaded?
                
                <LoadingComponent isLoading={!mailsIsLoaded} />
                :
                
                mails.length>0 ?

                
                
                
                <FlatList
                data={mails}
                onRefresh={()=>loadMessages()}
                ref={flatListRef}
                keyExtractor={(item, index) => item.ID.toString()}
                renderItem={renderEmailItem}
                refreshing={!mailsIsLoaded}
                //onScroll={handleScroll}
                initialNumToRender={30} 
                maxToRenderPerBatch={30} 
                windowSize={21} 
                getItemLayout={(data, index) => ({
                    length: 80, // Fixed height of emailItem
                    offset: 80 * index,
                    index,
                })}
                disableVirtualization={true}
                contentContainerStyle={styles.emailList}
                
                />
                
                : 
                
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} /*iOS only, use color for android *//>} contentContainerStyle={{ flex:1,  justifyContent:"center", alignItems:"center"}}>
                <Text style={{color: theme.colors.onSurface}} >Keine Nachrichten vorhanden</Text>
            </ScrollView>
            }

            </Main>
      


        
       
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
        height:80,
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
    Sender: {
        fontWeight: 'bold',
        fontSize: 16,
        color: theme.colors.onBackground,
    },
    Betreff: {
        fontSize: 14,
        fontWeight:"bold",
        color: theme.colors.onBackground,
    },
    Nachricht: {
        fontSize: 12,
        color:theme.colors.onSurfaceVariant,
        
    },
    time: {
        paddingLeft:30,
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