import React, { useEffect, useMemo, useState, useRef, memo, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput, Alert, ToastAndroid, Touchable, KeyboardAvoidingView, ScrollView } from 'react-native';
// import { TextInput } from 'react-native-windows';

import { useTheme } from '../../services/ThemeContext';
import { Chip, FAB, Icon, IconButton } from 'react-native-paper';
import apiConnect from '../../services/APIConnector';


export default function ConfigSetup ({ navigation }) {

    const theme = useTheme();
    const colors = theme.colors;
    const styles = useMemo(() =>makeStyles(theme))
    const [isLoading, setIsLoading] = useState(false)
    const [serverName, setServerName] = useState("")
    const [dBVerwaltung, setDBVerwaltung] = useState("")
    const [dBPflege, setDBPflege] = useState("")
    const [userName, setUserName] = useState("")
    const [pw, setPw] = useState("")

    const [showPassword, setShowPassword] = useState(false)



    async function createConfig() {

        setIsLoading(true)

        try {
            const data = await apiConnect({
                "host": serverName, 
                "dbname": dBVerwaltung, 
                "dbnamepflege":dBPflege, 
                "user": userName, 
                "pass": pw
            }, "dbcheck/1")  
    
            console.log(data)
            if (data.success) {
                if(data.data) {
                    console.log("Success!")
                    ToastAndroid.show("Datenbank gefunden!", ToastAndroid.SHORT)
                }
                       
            }
        } catch (error) {
            console.log("ERROR : " + error)
        }

        setIsLoading(false)
    }

        useEffect(() => {
        
        }, [])



    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{minHeight:"60%",width:"80%", backgroundColor:colors.elevation.level2, borderRadius:30, borderColor:colors.outline, borderWidth:1,}}>

            <View style={{flex:1,paddingTop:10, alignItems:"center", justifyContent:"space-around"}}>
                <View>
                    <Text style={{fontSize:30, fontWeight:"bold", color: colors.onSurfaceVariant}}>
                        Datenbank-Verbindung
                    </Text>
                </View>
                <View style={styles.inputContainer}>

                    <View style={styles.inputContainer} >
                        <Text style={{color:colors.onSurfaceVariant}} >Server-Name</Text>
                        <TextInput style={styles.textinput} editable={!isLoading} placeholderTextColor={colors.onSurfaceDisabled} placeholder='Server' onChangeText={(value)=>setServerName(value)}/>
                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={{color:colors.onSurfaceVariant}} >Datenbank Verwaltung</Text>
                        <TextInput style={styles.textinput} editable={!isLoading} placeholderTextColor={colors.onSurfaceDisabled} placeholder='Datenbank Verwaltung' onChangeText={(value)=>setDBVerwaltung(value)}/>
                    </View>

                    <View style={styles.inputContainer} >
                        <Text style={{color:colors.onSurfaceVariant}} >Datenbank Pflege (wenn vorhanden)</Text>
                        <TextInput style={styles.textinput} editable={!isLoading} placeholderTextColor={colors.onSurfaceDisabled} placeholder='Datenbank Pflege' onChangeText={(value)=>setDBPflege(value)}/>
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
                                    onPress={()=>createConfig()}
                                        style={[
                                            styles.sendButton,
                                            { backgroundColor: isLoading?colors.surfaceDisabled:colors.primary },
                                        ]}
                                    >
                        <Text style={[styles.sendButtonText, { color: isLoading?colors.onSurfaceDisabled:colors.onPrimary }]}>
                            Datenbank registrieren
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>


            </ScrollView>
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
        paddingVertical:10,
        // borderColor:"red",
        // borderWidth:1,
    },
    textinput: {
        borderRadius:10, 
        borderWidth:1,
        marginTop:2,
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