import React, { useEffect, useMemo, useState, useRef, memo, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ToastAndroid, Touchable } from 'react-native';
// import { TextInput } from 'react-native-windows';
import RNSecureStorage from 'rn-secure-storage';

import { useTheme } from '../../services/ThemeContext';
import { UserContext } from '../../util/ContextProvider';
import { Chip, FAB, Icon, IconButton } from 'react-native-paper';
import apiConnect from '../../services/APIConnector';
import LoadingComponent from '../../components/LoadingComponent';



export default function Start ({ navigation, route }) {

    const {user, setUser} = useContext(UserContext)
    const theme = useTheme();
    const colors = theme.colors;
    const styles = useMemo(() =>makeStyles(theme))
    const [isLoading, setIsLoading] = useState(false)
    const {startparams} = route.params;



    async function start() {
        setIsLoading(true)

        try {

            let checkOK = await checkDB();

            if (checkOK) {

                if(startparams !== null  && startparams.user !== null) {
                    setUser(startparams.user)
                    
                }
                else {
                    let hasUser = await checkUserData();
                    
                    if(!hasUser) {
                        navigation.replace("Login")
                        setIsLoading(false)
                        return;
                    }
                }
                
                await login();
            }
                
            }
            catch(error) {
                console.log(error)
            }

        setIsLoading(false)

    }


    
    async function checkDB(dbtype = null) {

        try {

            
            let data = await apiConnect({dbtype}, "dbcheck/2");
            console.log("DATA FROM CHECK: " + JSON.stringify(data.data))
            if(data.data == true) {
                return true
            } else if(data.data == "noConfig") {
                //TODO: Server Config Seite aufrufen
                navigation.navigate("ConfigSetup");
            }
            else if (data.data == "malformedConfig") {
                //TODO: Fehlermeldung mit Adminverweis
            }
            else if (data.data == "noVerwaltung") {
                //TODO: Fehlermeldung mit fehlender Datenbank
            }
            else if (data.data == "noPflege") {
                //TODO: Fehlermeldung mit fehlender Pflege, Frage ob richtige Anwendung gewählt
            }
            else {
                // TODO: Allgemeine Fehlermeldung
            }
        
        } catch(error) {
            console.log("ERROR ON CHECK: "+error)
        }

    }
     

  



    async function checkUserData() {

        let iskeySet = await RNSecureStorage.exist("login");
        if (!iskeySet) {
            return false;
        }

        let userLogin = JSON.parse(await RNSecureStorage.getItem("login"));

        if("username" in userLogin && "password" in userLogin && "dbtype" in userLogin) {
            setUser(userLogin);
            return true;
        }
        else {
            return false;
        }
    } 


    async function login() {

        try{
            let data = await apiConnect({user: user.username, pass: user.password, dbtype: user.dbtype }, "login/1")

            if(!Array.isArray(data.data)) {

                let username = data.data?.Name
                let password = user.password
                let fullname = data.data?.Mitarbeitername
                let gruppe = data.data?.Gruppe

                setUser({username, password, fullname, gruppe, dbtype:user.dbtype})

                navigation.replace("Drawer")
            }

            console.log(data)
                
        } catch(error) {
            console.log(error)
        }

    }

    useEffect(() => {
        start()
    }, [])


    return (
        <View style={styles.container}>
            <LoadingComponent isLoading={isLoading} />
            <View style={{height:"60%", width:"80%", backgroundColor:colors.elevation.level2, borderRadius:30, borderColor:colors.outline, borderWidth:1}}>
                <View style={{flex:1,paddingTop:10, alignItems:"center", justifyContent:"space-around"}}>
                    <View>
                        <Text style={{fontSize:30, fontWeight:"bold", color: colors.onSurfaceVariant}}>
                            Startbildschirm MEDICARE MESSENGER
                        </Text>
                    </View>
                
                    <View>
                        <TouchableOpacity disabled={isLoading} onPress={()=>start()} style={[styles.sendButton,{backgroundColor: isLoading?colors.surfaceDisabled:colors.primary}]}>
                            <Text style={[styles.sendButtonText, { color: isLoading?colors.onSurfaceDisabled:colors.onPrimary}]}>
                                Verbindung aufbauen
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <FAB style={[styles.fab, {backgroundColor:"green"}]} icon="plus" color={"white"} onPress={() => navigation.navigate("Drawer")}/>
            <FAB style={[styles.fab, {backgroundColor:"red",marginRight:100}, ]} icon="plus" color={"white"} onPress={() => navigation.navigate("Login")}/>
        </View>
    );
};



const makeStyles = (theme) =>  StyleSheet.create({
  
    container: {
        justifyContent:"center", 
        alignItems:"center", 
        flex:1, 
        backgroundColor:theme.colors.background
    },

    inputContainer: {
        justifyContent:"center", 
        width:"100%",
        alignItems:"center", 
        paddingVertical:30,
        // borderColor:"red",
        // borderWidth:1,
    },
    textinput: {
        borderRadius:10, 
        borderWidth:1,
        borderColor: theme.colors.outline,
        color: theme.colors.onSurface,
        backgroundColor:theme.colors.surface,
        width:"80%"
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#4285F4',
    },
    sendButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});