import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Linking, PermissionsAndroid, Alert, ToastAndroid,
} from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import dayjs from 'dayjs';
import { numToFileSize } from '../../services/fileSizeCalc';
// import { deflate, inflate } from 'react-native-gzip';
import pako from 'pako';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from "react-native-file-viewer";
import apiConnect from '../../services/APIConnector';

import LoadingComponent from '../../components/LoadingComponent';
import { Icon, IconButton } from 'react-native-paper';
import { AsyncAlert } from '../../services/AsyncAlert';
require('dayjs/locale/de')
dayjs.locale("de");
const ShowMessage = ({route, navigation}) => {

    const {item} = route.params;
    const theme = useTheme();
    const files = item.anhaenge;
    const colors = theme.colors;
    const {fs} = ReactNativeBlobUtil
    const dirs = fs.dirs;
    const [isLoading, setIsLoading] = useState(false);
    function getNachrichtStr() {

        return `\n------------------------\nVon: ${item.fullName!==null && item.fullName!== ""?item.fullName+"<"+item.Sender+">":item.Sender} \nGesendet: ${new Date(item.Datum).toLocaleString("de-DE", {  weekday: "long", year: "numeric", month:"2-digit" , day: "2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit"})} \nAn: ${item.Empfänger} \nBetreff: ${item.Betreff} \n\n\n${item.Nachricht}`
    }


    async function saveAttachment(file) {
        console.log("Pressed on attachment")
        setIsLoading(true)
        let fileLocation = dirs.CacheDir+"/"+file.name;
        
        try{
            let alreadyDownloaded = await fs.exists(fileLocation)
            console.log("File already downloaded? "+ alreadyDownloaded)
            if(!alreadyDownloaded){

                    console.log("FILE: "+JSON.stringify(file))
                    const data = await apiConnect({"anhangID":file.ID, "anhangPos": file.Pos}, "messages/4")   //FEHLENDE NUTZER-VERIFIKATION
                    // console.log("Result: " + JSON.stringify(data))                       
                    if(data.success) {
                        if (data.data.length !== 0) {
                        
                            console.log("Saving in: "+fileLocation)

                          //  const result = decompress(data.data.Mail)
                            const result = data.data.Mail
                            console.log("RESULT: "+(data.data.Mail.slice(0,40)))

                            let fileName = file.name;
                            let index = 1;
                            while (await fs.exists(fileLocation)) {
                                var lastIndex = file.name.lastIndexOf('.');
                                const nameParts = [file.name.substr(0,lastIndex), file.name.substr(lastIndex) ];
                                fileName = `${nameParts[0]}(${index})${nameParts[1]}`;
                                fileLocation = `${dirs.LegacyDownloadDir}/${fileName}`;
                                index++;
                            }
                            await fs.writeFile(fileLocation, result, 'base64')
                            console.log("Saved successfully")   
                            
                        } 
                    }
                }
                    console.log("Opening...")
                    const stat = await fs.stat(fileLocation);
                    const mimeType = stat.mime || 'application/octet-stream'; // Default fallback
                           
                    await FileViewer.open(fileLocation, {showAppsSuggestions:true,showOpenWithDialog: true, type: mimeType });
                   
                           
                  
        } catch (err){
            console.error("Error during decompression or file saving:", err);
        }
        setIsLoading(false)
             
    }






    
    
       
   






    async function saveAttachmentLocally(file) {
        console.log("Pressed on download")
        setIsLoading(true)
        let fileLocation = dirs.LegacyDownloadDir+"/"+file.name;
        
        try{
            let alreadyDownloaded = await fs.exists(fileLocation)
            console.log("File already downloaded? "+ alreadyDownloaded)
            let shallDownload = true;
            if(alreadyDownloaded){

                shallDownload = await AsyncAlert("Anhang herunterladen", "Dieser Anhang wurde bereits heruntergeladen. Soll die Datei erneut gespeichert werden?", [
                    {
                        text: "Abbrechen",
                        onPress: () => false,
                        style:"cancel"
                    },
                    {
                        text: "Erneut herunterladen",
                        onPress: () => true,
                        style:"default",
                    }
                ], {cancelable: true, onDismiss:()=>{return false}});
            }
            if(shallDownload){

                    console.log("FILE: "+JSON.stringify(file))
                    ToastAndroid.show("Datei wird heruntergeladen...", ToastAndroid.LONG)
                    const data = await apiConnect({"anhangID":file.ID, "anhangPos": file.Pos}, "messages/4")   //FEHLENDE NUTZER-VERIFIKATION
                    // console.log("Result: " + JSON.stringify(data))                       
                    if(data.success) {
                        if (data.data.length !== 0) {

                            // console.log("TESTING...")
                            // testDecompress(data.data.Mail)
                        
                            console.log("Saving in: "+fileLocation)

                            //ToastAndroid.show("Dekomprimieren...", ToastAndroid.SHORT)

                            // const result = decompress(data.data.Mail)
                            const result = data.data.Mail
                            
                           // console.log("Decompressed!")
                            let fileName = file.name;
                            let index = 1;
                            while (await fs.exists(fileLocation)) {
                                var lastIndex = file.name.lastIndexOf('.');
                                const nameParts = [file.name.substr(0,lastIndex), file.name.substr(lastIndex) ];
                                fileName = `${nameParts[0]}(${index})${nameParts[1]}`;
                                fileLocation = `${dirs.LegacyDownloadDir}/${fileName}`;
                                index++;
                            }
                            await fs.writeFile(fileLocation, result, 'base64')
                            ToastAndroid.show("Datei gespeichert", ToastAndroid.SHORT)
                            console.log("Saved successfully")   
                            
                            console.log("Opening...")
                            const stat = await fs.stat(fileLocation);
                            console.log("STAT: " + JSON.stringify(stat))
                            const mimeType = stat.mime || 'application/octet-stream'; // Default fallback
                            console.log("MIME: "+ stat.mime)
                                   
                            await FileViewer.open(fileLocation, {showAppsSuggestions:true,showOpenWithDialog: true, type: mimeType });
                        } 
                    }
                }
                           
        } catch (err){
            ToastAndroid.show("Fehler beim Öffnen der Datei: " + err, ToastAndroid.LONG)
            console.error("Error during decompression or file saving:", err);
        }
        setIsLoading(false)
             
    }


    
    
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LoadingComponent isLoading={isLoading} />
            <View>
                 {/* "From" Field */}
                 <View style={styles.inputRow}>
                    <Text style={[styles.label, { color: colors.onSurface }]}>Von</Text>
                    <Text style={[styles.label, { color: colors.onSurface, flex:1 }]}>{item.fullName!==null && item.fullName!== ""?item.fullName+"<"+item.Sender+">":item.Sender}</Text>

                    
                </View>
            {/* "To" Field */}
                <View style={styles.inputRow}>
                    <Text style={[styles.label, { color: colors.onSurface }]}>An</Text>
                    <Text style={[styles.label, { color: colors.onSurface,  flex:1 }]}>{item.Empfänger}</Text>

                </View>

                {/* "Subject" Field */}
                <View style={styles.inputRow}>
                    <Text style={[styles.label, { color: colors.onSurface, }]}>Betreff</Text>
                    <Text style={[styles.label, { color: colors.onSurface,  flex:1 }]}>{item.Betreff}</Text>
                        
                </View>
                <View style={styles.inputRow}>
                    <Text style={[styles.label, { color: colors.onSurface, }]}>Gesendet</Text>
                    <Text style={[styles.label, { color: colors.onSurface,  flex:1 }]}>{dayjs(item.Datum).format("DD.MM.YYYY, HH:mm:ss")} </Text>
                      
                        
                </View>

                {item.Dringlichkeit==2?
                    <View style={{alignItems:"center", backgroundColor:colors.error, borderRadius:25, marginBottom:10}} >
                            <Text style={[{lineHeight:30, justifyContent:"center", color: colors.onError, fontWeight:"bold"}]}>Wichtig!</Text>
                    </View>
                :""}

            </View>

            {/* "Compose Email" Text Area */}

      
            
            <ScrollView style={{flex:1, marginBottom:10, borderRadius:10}} contentContainerStyle={{}}>
                <TextInput  editable={false} 
                   
                    multiline 
                    value={item.Nachricht} 
                    style= {[  
                        styles.textArea,
                        {   
                            backgroundColor: colors.elevation.level2, 
                            color: colors.onSurface,
                        }]} 
                />
            </ScrollView>


            <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", }} >
            
            
                            <ScrollView style={{flex:1, maxHeight:150}}>
            
            
                                {files.length>0?
                        
                                    files.map((object, key) =>
                        
                                <TouchableOpacity disabled={isLoading} onPress={()=>saveAttachment(object)} key={key} style={{flexDirection:"row", justifyContent:"space-between", padding:10, borderWidth:1, borderColor: colors.outline, marginRight:20, backgroundColor:colors.elevation.level1, marginBottom:10,}}>
            
                                    <View style={{flex:1}}  >
                                        <Text ellipsizeMode='middle' numberOfLines={1} style={{color:colors.onSurface}}>
                                            {object.name}
                                        </Text>
                                        {/* <Text style={{fontSize:12, color:colors.onSurface}}>
                                            {numToFileSize(object.size)}
                                        </Text> */}
                                    </View>
                                    <View style={{justifyContent:"center",}}>
                                        <TouchableOpacity disabled={isLoading} style={{padding:10, borderColor:colors.outline, backgroundColor:isLoading?colors.surfaceDisabled:colors.elevation.level1 , borderWidth:1, borderRadius:5}} onPress={()=>saveAttachmentLocally(object)}>
                                            <Icon source="download" size={20} color={isLoading?colors.onSurfaceDisabled:colors.onSurface}  />
                                          
                                        </TouchableOpacity>
                                    </View>
                                    
                                </TouchableOpacity>
                                    )
                                :""
                            }
                    </ScrollView>
                
            

                    {/* "Answer" Button */}
                    <TouchableOpacity disabled={isLoading} 
                    onPress={()=>navigation.navigate("NewMessage", {"answerObj" : {"empfaenger": item.Sender, "betreff": "RE: "+item.Betreff, "prevNachricht": getNachrichtStr()}})}
                        style={[
                            styles.sendButton,
                            { backgroundColor: isLoading?colors.surfaceDisabled:colors.primary },
                        ]}
                    >
                        <Text style={[styles.sendButtonText, { color: isLoading?colors.onSurfaceDisabled:colors.onPrimary }]}>
                        Antworten
                        </Text>
                    </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        position:"relative"
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 80,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        fontSize: 16,
    },
    textArea: {
        flex:1,
        borderWidth: 1,
        borderRadius: 5,
        borderColor:"rgba(0,0,0,0)",
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
        minHeight:"100%"
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

export default ShowMessage;