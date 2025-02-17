import { PermissionsAndroid, Platform } from "react-native";
import { Linking } from 'react-native';



export async function requestStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title:"Schreibrechte erforderlich",
                message:"Um Anhänge speichern zu können, braucht diese App die Erlaubnis, Dateien zu speichern. Jetzt erlauben?",
                buttonPositive:"Erlauben",
                buttonNegative:"Abbrechen"
            }
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    catch (err) {
        console.warn(err)
        return false;
    }
}

export async function requestManageStoragePermission() {
    if (Platform.Version >= 30) {

        try{

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
                {
                    title: "Schreibrechte erforderlich",
                    message: "Um Anhänge speichern und lesen zu können, braucht diese App die Erlaubnis, Dateien zu speichern. Jetzt erlauben?",
                    
                    buttonNegative: "Abbrechen",
                    buttonPositive: "Erlauben",
            }
            );
        
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true
            }
            else {
                console.warn("Permission denied. Redirecting to settings...");
                Linking.openSettings();
            }
        }
        catch(err)
        {
            console.log(err)
        }
        
    }
}