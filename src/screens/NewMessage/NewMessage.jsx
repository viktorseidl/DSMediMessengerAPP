import React, { useContext, useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, ToastAndroid, Platform, Alert,
} from 'react-native';
import { useTheme } from '../../services/ThemeContext';
import { Checkbox } from 'react-native-paper';
import { LoadingContext, UserContext } from '../../util/ContextProvider';
import apiConnect from '../../services/APIConnector';
import DocumentPicker from 'react-native-document-picker';
import { deflate, inflate } from 'react-native-gzip';
import { numToFileSize } from '../../services/fileSizeCalc';
import { requestManageStoragePermission, requestStoragePermission } from '../../services/permissions/PermissionHandler';
import {check, PERMISSIONS, request} from 'react-native-permissions'
import ReactNativeBlobUtil from 'react-native-blob-util';
import { compress, decompress, testCompression } from '../../services/compression/Compression';
import LoadingComponent from '../../components/LoadingComponent';
import { AsyncAlert } from '../../services/AsyncAlert';

const NewMessage = ({route, navigation}) => {

    const answerObj = route.params?.answerObj;
    const [empfaenger, setEmpfaenger] = useState(answerObj!=null?answerObj.empfaenger:"")
    const {user, setUser} = useContext(UserContext)    
    const [betreff, setBetreff] = useState(answerObj!=null?answerObj.betreff:"")
    const [nachricht, setNachricht] = useState(answerObj!=null?answerObj.prevNachricht:"");
    const [ isImportant, setisImportant] = useState(false)
    const [files, setFiles] = useState ([])
    const theme = useTheme();
    const {isLoading, setIsLoading} = useContext(LoadingContext)
    const colors = theme.colors;
    const {fs} = ReactNativeBlobUtil
    const dirs = fs.dirs;



    async function pickAttachment() {
    try {
        const pickedFiles = await DocumentPicker.pick({
            allowMultiSelection: true,
            type: [DocumentPicker.types.allFiles],
        });

        for (const element of pickedFiles) {
            console.log("Picked File: " + element.name + " of type " + element.type);
            console.log("Full file: " + JSON.stringify(element));

            if (files.find((item) => item.uri === element.uri)) {
                console.log("File was already added");
                await AsyncAlert(
                    "Datei bereits hinzugefügt",
                    `Die Datei "${element.name}" wurde bereits als Anhang hinzugefügt.`,
                    [
                        {
                            text: "OK",
                            onPress: () => true,
                            style: "default",
                        },
                    ]
                );
                continue;
            }

            if (element.size > 10000000) {
                const result = await AsyncAlert(
                    "Datei zu groß",
                    `Die Datei "${element.name}" konnte nicht hinzugefügt werden, da sie größer als 10 MB ist.`,
                    [
                        {
                            text: "OK",
                            onPress: () => true,
                            style: "default",
                        },
                    ]
                );

                console.log("Alert result:", result);
                continue; // Skip adding the file if alert was shown
            }

            // Add file if not too large and not already added
            setFiles((prev) => [...prev, element]);
        }
    } catch (err) {
        if (DocumentPicker.isCancel(err)) {
            console.log("User cancelled the picker");
        } else {
            console.error("Error picking document:", err);
        }
    }
}

     function deleteAttachment(object) {

        setFiles((prevFiles) => 
        prevFiles.filter((item) => item.uri !== object.uri));
     }


    

    async function sendMessage() {
        setIsLoading(true)

        if(empfaenger == "")
        {
            Alert.alert("Kein Empfänger", "Es wurde kein Empfänger festgestellt. Bitte geben Sie einen validen Empfänger für die Nachricht ein.")
            setIsLoading(false)
            return
        }
     
        const base64AttachmentArr = []

        console.log("FILES: " +JSON.stringify(files))
        let i = 0;

        
        //      testCompression(base64file)
        //      setIsLoading(false)
        //      return
        
        for (const element of files)
            {
                const start = Date.now();
                const base64file = await fs.readFile(element.uri, 'base64')
                const end = Date.now();
                console.log(`File size: ${element.size} - reading: ${end - start} ms`);

                const start2 = Date.now();
               // data =  compress(base64file)
               data = base64file
                const end2 = Date.now();

                // console.log(`File compressing: ${element.name} -  ${end2 - start2} ms`);

                // console.log("Compressed Data Example: " + data.slice(0,40))
                // console.log("DB Size: "+(data.length*2))
            
            
            
            const anhangObj = {
                name: element.name,
                base64: data,
                pos: i
            }
            base64AttachmentArr.push(anhangObj)
            console.log("Pushed")
            i++;
        }
   
        // setIsLoading(false)
        //  return

            
        
            let insertObj = {
                "grund" : 79,
                "bezeichnung": betreff,
                "nachricht": nachricht.replace(/\r\n/g, '\n').replace(/\r/g, '\n'),
                "empfaenger": empfaenger,
                "dringlichkeit": isImportant?1:0,
                "sender": user.username,
                "anhangArr": base64AttachmentArr,
    
            }
        

        //console.log(JSON.stringify(base64AttachmentArr))
           
         //   console.log("Insert OBJECT: " + JSON.stringify(insertObj))


           try {

            const start = Date.now();

            const data = await apiConnect({"user": "SEB"}, "messages/2", insertObj)

            const end = Date.now();
            console.log(`Zeit für die Abfrage: ${end - start} ms`);
            //console.log(JSON.stringify(data.data.slice(0,40)))

            if (data.success)
            {
                if (data.data)
                {
                    console.log("Success!")
                    ToastAndroid.show("Nachricht wurde gesendet", ToastAndroid.SHORT)
                    navigation.goBack();
                }
                else {
                    console.log("Failed..")
                }
            }
           }
           catch (error)
           {
            console.log("ERROR IN INSERT: " + error)
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
                    <TextInput style={[{borderColor: colors.outline, backgroundColor: colors.surface, color: colors.onSurface,},]} placeholder="Absender" value={user.username} editable={false} placeholderTextColor={colors.onSurfaceDisabled}  keyboardType="email-address"/>
                </View>
            {/* "To" Field */}
                <View style={styles.inputRow}>
                    <Text style={[styles.label, { color: colors.onSurface }]}>An</Text>
                    <TextInput style={[ styles.input, {borderColor: colors.outline, backgroundColor: colors.surface, color: colors.onSurface,},]} placeholder="Empfänger"  defaultValue={empfaenger} onChangeText={(value)=>setEmpfaenger(value)} placeholderTextColor={colors.onSurfaceDisabled} keyboardType="email-address"/>
                </View>

                {/* "Subject" Field */}
                <View style={styles.inputRow}>
                    <Text style={[styles.label, { color: colors.onSurface, }]}>Betreff</Text>
                        <TextInput style={[ styles.input, { borderColor: colors.outline, backgroundColor: colors.surface, color: colors.onSurface, }, ]} placeholder="Betreff" defaultValue={betreff} onChangeText={(value)=>setBetreff(value)} placeholderTextColor={colors.onSurfaceDisabled}/>
                </View>
                
                <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                    <View style={{flexDirection:"row", alignItems:"center"}} >
                        <Text style={[ { color: colors.onSurface, fontWeight:"bold" }]}>Als wichtig markieren</Text>

                        <Checkbox   status={isImportant ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setisImportant(!isImportant);
                                    }} 
                                    theme={theme}
                                    />

                    </View>
                <TouchableOpacity
                style={[
                    styles.anhangButton,
                    { backgroundColor: colors.elevation.level2, borderColor: colors.outline, },
                ]}
                onPress={()=>pickAttachment()}
            >
                <Text style={[styles.anhangButtonText, { color: colors.onSurface }]}>
                Anhang +
                </Text>

            </TouchableOpacity>
                </View>


            </View>

                {/* "Compose Email" Text Area */}
            <TextInput
                style={[
                    styles.textArea,
                    {
                        borderColor: colors.outline,
                        backgroundColor: colors.surface,
                        color: colors.onSurface,
                    },
                ]}
                placeholder="Nachricht verfassen..."
                defaultValue={nachricht}
                onChangeText={(value)=>setNachricht(value)}
                placeholderTextColor={colors.onSurfaceDisabled}
                multiline
            />

            <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", }} >


                <ScrollView style={{flex:1, maxHeight:150}}>


                    {files.length>0?
            
                        files.map((object, key) =>
            
                    <View key={key} style={{flexDirection:"row", justifyContent:"space-between", padding:10, borderWidth:1, borderColor: colors.outline, marginRight:20, backgroundColor:colors.elevation.level1, marginBottom:10,}}>

                        <View style={{flex:1}}  >
                            <Text ellipsizeMode='middle' numberOfLines={1} style={{color:colors.onSurface}}>
                                {object.name}
                            </Text>
                            <Text style={{fontSize:12, color:colors.onSurface}}>
                                {numToFileSize(object.size)}
                            </Text>
                        </View>
                        <View style={{justifyContent:"center",}}>
                            <TouchableOpacity style={{padding:10}} onPress={()=>deleteAttachment(object)}>
                                <Text  style={{color:colors.onSurface}}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                        )
                    :""
                }
        </ScrollView>

            {/* "Send" Button */}
            <TouchableOpacity
                style={[
                    styles.sendButton,
                    { backgroundColor: colors.primary },
                ]}
                onPress={()=>sendMessage()}
                defaultValue={nachricht}
            >
                <Text style={[styles.sendButtonText, { color: colors.onPrimary }]}>
                Senden
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
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        width: 60,
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
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    anhangButton: {
        borderWidth:1,
       
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom:5,
        alignSelf: 'flex-end',
    },
    anhangButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sendButton: {
       
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent:"center",
        marginRight: "auto"
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default NewMessage;



