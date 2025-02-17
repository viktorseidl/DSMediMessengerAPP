import React, { useEffect, useMemo, useState, useRef, memo, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, Pressable, Platform, TextInput, Alert, ToastAndroid, Touchable } from 'react-native';
// import { TextInput } from 'react-native-windows';
import RNSecureStorage from 'rn-secure-storage';

import { useTheme } from '../../services/ThemeContext';
import { UserContext } from '../../util/ContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chip, FAB, Icon, IconButton } from 'react-native-paper';
import apiConnect from '../../services/APIConnector';
import  md5  from 'crypto-js/md5';



export default function Login ({ navigation }) {

    const {user, setUser} = useContext(UserContext)
    const theme = useTheme();
    const colors = theme.colors;
    const styles = useMemo(() =>makeStyles(theme))
    const [isLoading, setIsLoading] = useState(false)
    const [userName, setUserName] = useState("")
    const [pw, setPw] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [dbtype, setDBtype] = useState("V")
    const [verwaltungSelected, setVerwaltungSelected] = useState(true)





        async function checkDB() {

            let data = await apiConnect({dbtype}, "dbcheck/2");
            console.log("DATA FROM CHECK: " + JSON.stringify(data.data))
        }
 


        async function checkUser() {

            let keySet = await RNSecureStorage.exist("login");
            if (!keySet) {
                return null;
            }

            let userLogin = JSON.parse(await RNSecureStorage.getItem("login"));

        } 

        async function saveUser(name, pass) {

            let loginObj = { name, pass};
            await RNSecureStorage.setItem("login",JSON.stringify(loginObj));

        } 

        async function login() {

            let mdPass = md5(pw.trim().toString());
            mdPass = mdPass.toString();
            console.log("mdPASS: "+ mdPass)
            console.log("dbtype: "+dbtype)

            if(userName == "")
            {
                ToastAndroid.show("Kein Nutzername angegeben, bitte ausfüllen.")
                return;
            }
            
            try{

                
                let data = await apiConnect({user: userName, pass: mdPass, dbtype: dbtype }, "login/1")

                if(!Array.isArray(data.data))
                {
                    let username = data.data?.Name
                    let password = mdPass
                    let fullname = data.data?.Mitarbeitername
                    let gruppe = data.data?.Gruppe

                    setUser({username, password, fullname, gruppe, dbtype})

                    navigation.navigate("Drawer")

                   
                }

                console.log(data)

               // navigation.navigate("Drawer", {"answerObj" :""})
                
            } catch(error) {
                console.log(error)
            }

        }

        useEffect(() => {

            checkUser();
        
        }, [])



    return (
        <View style={styles.container}>
            <View style={{height:"60%", width:"80%", backgroundColor:colors.elevation.level2, borderRadius:30, borderColor:colors.outline, borderWidth:1,}}>

            <View style={{flex:1,paddingTop:10, alignItems:"center", justifyContent:"space-around"}}>
                <View>
                    <Text style={{fontSize:30, fontWeight:"bold", color: colors.onSurfaceVariant}}>
                        Anmeldung
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                <Text style={{color:colors.onSurfaceVariant}} >Anwendung</Text>
                    <View style={[styles.inputContainer, { flexDirection:"row", alignItems:"center", }]} >

                        <Chip  mode='outlined' style={{marginHorizontal:10}} showSelectedOverlay={true} icon={verwaltungSelected?"check":""}  selected={verwaltungSelected}   onPress={()=>(setVerwaltungSelected(true), setDBtype("V"))}>Verwaltung</Chip>
                        <Chip  mode='outlined' style={{marginHorizontal:10}} showSelectedOverlay={true} icon={!verwaltungSelected?"check":""} selected={!verwaltungSelected}  onPress={()=>(setVerwaltungSelected(false), setDBtype("P"))}>Pflege</Chip>
                    </View>

                   <View style={styles.inputContainer} >
                    <Text style={{color:colors.onSurfaceVariant}} >Nutzername</Text>
                    <TextInput style={styles.textinput} editable={!isLoading} placeholderTextColor={colors.onSurfaceDisabled} placeholder='Nutzername' onChangeText={(value)=>setUserName(value)}/>
                   </View>
                    
                    
                    <View style={styles.inputContainer}>
                        <Text style={{color:colors.onSurfaceVariant}}>Passwort</Text>
                        <View style={{flexDirection:"row-reverse", alignItems:"center"}}>
                            <TextInput style={styles.textinput}  editable={!isLoading} placeholderTextColor={colors.onSurfaceDisabled} keyboardType={showPassword?'visible-password':"default"} textContentType='password' secureTextEntry={!showPassword} placeholder='Passwort' onChangeText={(value)=>setPw(value)} />

                            <IconButton style={{position:"absolute"}} icon={showPassword?"eye-off-outline":"eye-outline"} color={theme.colors.onSurface} size={24} onPress={()=>setShowPassword(!showPassword)} />
                        </View>
                    </View>

                </View>

                <View>
                    <TouchableOpacity disabled={isLoading} 
                                    onPress={()=>login()}
                                        style={[
                                            styles.sendButton,
                                            { backgroundColor: isLoading?colors.surfaceDisabled:colors.primary },
                                        ]}
                                    >
                        <Text style={[styles.sendButtonText, { color: isLoading?colors.onSurfaceDisabled:colors.onPrimary }]}>
                            Anmelden
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>


            </View>
            <FAB
                         style={[styles.fab, {backgroundColor:"green"}]}
                         icon="plus"
                         
                         color={"white"}
                         onPress={() => navigation.navigate("Drawer")}
                     />
            <FAB
                         style={[styles.fab, {backgroundColor:"red",marginRight:100}, ]}
                         icon="plus"
                         
                         color={"white"}
                         onPress={() => checkDB()}
                     />
                     
                    
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
    chipIcon: {
        
    }
});