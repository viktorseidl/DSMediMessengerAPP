import { useContext } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { UserContext } from "../../util/ContextProvider";
import { useNavigation } from "@react-navigation/native";



export default function UserModal({showModal, setShowModal}) {
const navigation = useNavigation()
const {user} = useContext(UserContext)
const theme = useTheme()
const colors = theme.colors

    return(

        <Modal animationType="fade" visible={showModal} presentationStyle={"overFullScreen"} transparent={true}>
          <Pressable onPress={()=>setShowModal(false)} style={{width:"100%",justifyContent:"center", alignItems:"center", height:"100%", backgroundColor:"rgba(0,0,0,0.5)"}} >
            <Pressable style={{ borderRadius:20, width:"70%"}} >

                <View style={{backgroundColor:colors.elevation.level2, width:"100%", borderRadius:20, padding:10, alignItems:"center", }}>
                    <View style={{flexDirection:"row", width:"90%", borderBottomWidth:1, alignItems:"center", justifyContent:"center"}}>

                        <View style={{marginRight: 12,justifyContent:"center", alignItems:"center", backgroundColor:theme.colors.primary, height:40, width:40, borderRadius:40}}>
                            <Text  style={{color:colors.onPrimary, fontSize:20}}>{user?.fullname?user.fullname[0]:user.username[0]}</Text>
                        </View>
                        <View style={{flexDirection:"column"}}>
                            <Text style={{color: colors.onSurface, fontWeight:"bold", fontSize:20, lineHeight:30}}>{user?.fullname?user.fullname:user.username}</Text>
                            <Text style={{color: colors.onSurface, fontSize:15}}>{user?.fullname?user.username:""}</Text>
                        </View>
                    </View>

                        <View style={{flexDirection:"column"}}>
                            <Button mode="outlined" style={{margin:10}} onPress={()=>navigation.navigate("Login")} > 
                                    Abmelden
                            </Button>
                            
                            
                        </View>

                    <Text style={{fontSize:16, color:colors.onSurface}}>Dies ist ein Modal um Modals zu demonstrieren. Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio maiores, accusamus necessitatibus sed voluptas sapiente soluta consequuntur blanditiis autem nulla quisquam ut vel? Eius tempora minima fuga repellat distinctio iure!.</Text>
                    <View style={{paddingTop:20,width:"100%",flexDirection:"row", columnGap:15, justifyContent:"flex-end"}}>
                
                    </View>

                </View> 
            </Pressable>
          </Pressable> 
        </Modal>
    )
}