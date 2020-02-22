import React from 'react';
import {
    View,
    StatusBar,
    TouchableOpacity,
    Platform,
    TextInput,
    Text,
    Animated,
    Image,
    StyleSheet,
    I18nManager,
    ActivityIndicator
} from 'react-native';
import './global'
import Toast from "./SimpleToast";
import FormData from "react-native/Libraries/Network/FormData";
export default class EditProfileScreen extends React.Component {
    constructor(props){
        super(props);
        this.state={
            name:'',

        }
    }
    changeName(text){
        this.setState({name:text.trim()})
        console.log(name)
    }
    async Register()
    {
        try {

            let RegisterAddress = global.ApiAddress + "/user/update";
            if (this.state.name == '') {
                Toast.showWithGravity('نام نباید خالی باشد', Toast.LONG, Toast.CENTER)
            }
            // else if (this.state.password != this.state.confirmPassword) {
            //     Toast.showWithGravity('رمز عبور با تکرار رمز عبور مطابقت ندارد', Toast.LONG, Toast.CENTER)
            // }
            // else if (this.state.password.length < 6) {
            //     Toast.showWithGravity('رمز عبور حداقل 6 کاراکتر باید باشد', Toast.LONG, Toast.CENTER)
            // }
            else {

                var formData = new FormData();

                formData.append('name', this.state.name)

                let response = await fetch(RegisterAddress, {
                    method: 'POST',
                    headers: {
                        'x-token':this.state.token
                    },
                    body: formData
                });
                let Data = await response.json();

                if (Data.data.status == "success") {
                    this.props.navigation.navigate('Profile', {
                        token: Data.data.token,
                        name:this.state.name,
                        RouteName:this.props.navigation.state.params.RouteName
                    })
                }
                else if (Data.data.status == "fail") {
                    Toast.showWithGravity('تغییر اطلاعات نا معتبر است.', Toast.LONG, Toast.CENTER)
                }
            }
        }
        catch(err)
        {

        }
        finally {this.setState({loading:false})}

    }




    render() {
        return(
            <View style={styles.Container}>
                <StatusBar hidden />
                <View style={styles.Header}>
                    <View style={styles.RightContainer}>

                        <Text style={styles.HeaderTitle}> رمزنامه</Text>
                    </View>
                    <View style={styles.LeftContainer}>

                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} activeOpacity={.6}>
                            <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={styles.Box}>
                    <View style={styles.Top}>
                        <Text style={styles.HeaderTitle}>ویرایش اطلاعات</Text>
                        <Image source={require('.././images/EditProfile.png')}
                               style={styles.Logo}
                        />
                    </View>
                    <View style={styles.Bottom}>


                        <TextInput maxLength = {30} autoFocus = {true}  style={styles.TextInput} underlineColorAndroid={'transparent'} onChangeText={this.changeName.bind(this)}
                                   placeholder={'نام'}  placeholderTextColor={global.Gray2}
                        />

                        {
                            this.state.loading?
                                <View style={styles.DisableBtn}>
                                    <ActivityIndicator size="small" color="#515151" />
                                    <Text style={styles.ButtonText}> ثبت اطلاعات</Text>

                                </View>
                                :
                                <TouchableOpacity onPress={() => this.Register()} activeOpacity={.7}
                                                  style={styles.RegisterBtn}>
                                    <Text style={styles.ButtonText}> ثبت اطلاعات</Text>
                                </TouchableOpacity>
                        }
                    </View>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({

    Container: {
        justifyContent:'center',
        alignItems:'center',
        flex: 1,
        backgroundColor:global.LightContainer1,
    },
    Box:{
        width:'80%',
        borderRadius:3,
        justifyContent:'center',
        alignItems:'center',
        elevation:10

    },
    Top:{
        borderTopRightRadius:3,borderTopLeftRadius:3,
        width:'100%',
       // height:50,
        backgroundColor:global.HeaderColor
    },
    Bottom:{
        borderBottomRightRadius:3,borderBottomLeftRadius:3,
        paddingTop:10,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:global.LightContainer,
    },
    Header:{
        backgroundColor:global.HeaderColor,
        position:'absolute',
        width:'100%',
        top:0,
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:997
    },
    HeaderTitle:{
        textAlign:'center',
        margin:10,
        fontFamily:Platform.OS=='ios'?'IRANSansMobile':'IRANSansMobile_Bold',
        fontWeight:Platform.OS=='ios'?'bold':null,
        fontSize:global.fontSize13,
        color:'#F5F5F5'
    },
    RightContainer:{
        flexDirection:'row',
        flex:.7,
        justifyContent:I18nManager.isRTL?'flex-start':'flex-end',
        alignItems:'center'
    },
    LeftContainer:{
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        flex:.7,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    MenuIcon:{
        margin:10,
        height:15,
        width:15,
        resizeMode:'stretch'
    },
    Logo:{
       // marginTop:20,
        marginBottom:10,
        resizeMode:'stretch',
        alignSelf:'center',
        height:60,
        width:65
    },
    DrawerIcon:{
        marginLeft:5,marginRight:5,
        height:20,
        width:20,
        resizeMode:'stretch'
    },
    RegisterBtn:{
        marginTop:10,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:global.HeaderColor,
        borderWidth:1,
        borderColor:global.HeaderColor,
        borderRadius:3,
        height:40,
        width:150,
    },
    ButtonText:{
        fontFamily:'IRANSansMobile',
        fontSize:12,
        color:global.White1
    },
    TextInput:{
        borderRadius:5,
        margin:5,
        fontSize:12,
        fontFamily:global.fontFamily,
        height:45,
        width:'80%',
        textAlign:'right',
        borderColor:'#c6c6c7',
        borderBottomWidth:1,
        color:'#222'
    },
    Text:{
        padding:5,
        fontFamily:global.fontFamily,
        fontSize:12,
        color:'#222',
    },
    DisableBtn:{
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        alignSelf:'center',
        marginTop:10,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:global.Gray3,
        borderWidth:1,
        borderColor:global.Gray3,
        borderRadius:3,
        height:40,
        width:150,
    },
    RegisterBtn:{
        alignSelf:'center',
        marginTop:10,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:global.HeaderColor,
        borderWidth:1,
        borderColor:global.HeaderColor,
        borderRadius:3,
        height:40,
        width:150,
    },
});
