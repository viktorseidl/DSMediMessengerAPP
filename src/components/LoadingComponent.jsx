import { ActivityIndicator, View } from "react-native";


/**
 * component, displaying a loading circle on a background in the middle of the screen

 * @param {boolean} isLoading boolean indicating, whether the app is loading or not
 * @returns component
 * @author Sebastian Schaffrath
 */
export default function LoadingComponent({isLoading})  {


    if(isLoading)
    {
        return (
            <View style={{top:0, left:0, right: 0, bottom: 0, zIndex:1000,justifyContent:"center", alignItems:"center", position:"absolute"}}>
                <View style={{backgroundColor:'rgba(100,100,100,0.7)', padding:20, justifyContent: "center", alignItems:"center", borderRadius:40}}>
                    <ActivityIndicator size={70}  color="#FFF"/>
                </View>
            </View>
        )
    }
    return null
}