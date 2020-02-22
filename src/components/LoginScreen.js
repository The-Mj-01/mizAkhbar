import React from 'react';
import {View,StatusBar,ActivityIndicator,AsyncStorage,TouchableOpacity,Switch,Platform,TextInput, Text,Animated,Image, StyleSheet, I18nManager} from 'react-native';
import './global'
import Toast from "./SimpleToast";
import EventListener, {EventRegister} from 'react-native-event-listeners'
export default class LoginScreen extends React.Component {
    constructor(props){
        super(props)
        this.state={
            Secure:true,username:'',password:'',loading:false
        }
        this.Login=this.Login.bind(this)
    }
    ChangeUsername(text){
        this.setState({username:text.trim()})

    }
    ChangePassword(text){
        this.setState({password:text.trim()})
    }
    ChangeSecure(){
        this.state.Secure==true?this.setState({Secure:false}):this.setState({Secure:true})
    }
    async Login()
    {
        try {
            this.setState({loading:true})
            let RegisterAddress = global.ApiAddress + "/user/login";
            if (this.state.password == '' ||  this.state.username == '') {
                Toast.showWithGravity('نام کاربری و رمز عبور نباید خالی باشد', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }

            else {
                var formData = new FormData();
                formData.append('username', this.state.username)
                formData.append('password', this.state.password)

                let response = await fetch(RegisterAddress, {
                    method: 'POST',
                    headers: {},
                    body: formData
                });

                let Data = await response.json();

                if (Data.data.status == "success") {
                    AsyncStorage.setItem('token',Data.data.token)
                    AsyncStorage.setItem('UserName',this.state.username)

                    //this.props.navigation.navigate(this.props.navigation.state.params.RouteName)
                    EventRegister.emitEvent('CheckLogin')
                    EventRegister.emitEvent('GetData')
                    this.setState({loading:false})
                    Toast.showWithGravity('ورود شما با موفقیت انجام شد',Toast.SHORT,Toast.CENTER)
                }
                else if (Data.data.status == "fail") {
                    if (Data.data.message == "username and/or password is invalid") {
                        Toast.showWithGravity('شماره موبایل یا رمز عبور اشتباه است', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})

                    }
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
                  {/*  <View style={styles.LeftContainer}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} activeOpacity={.6}>
                            <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                        </TouchableOpacity>
                    </View>*/}

                </View>
                <View style={styles.Box}>
                    <View style={styles.Top}>
                        <Text style={styles.HeaderTitle}>ورود به حساب کاربری</Text>
                        <Image source={require('.././images/Login.png')}
                               style={styles.Logo}
                        />
                    </View>
                    <View style={styles.Bottom}>

                        <TextInput onChangeText={this.ChangeUsername.bind(this)} maxLength = {11} keyboardType={'phone-pad'} autoFocus = {true} onSubmitEditing={() => { this.secondTextInput.focus(); }} style={styles.TextInput} underlineColorAndroid={'transparent'}
                                   placeholder={'شماره موبایل(نام کاربری)'}  placeholderTextColor={global.Gray2}
                        />

                        <View style={{flexDirection:I18nManager.isRTL?'row':'row-reverse'}}>
                            <TextInput onChangeText={this.ChangePassword.bind(this)} secureTextEntry={this.state.Secure} ref={(input) => { this.secondTextInput = input; }} style={[styles.TextInput,{flex:9}]} underlineColorAndroid={'transparent'}
                                       placeholder={'رمز عبور'} placeholderTextColor={global.Gray2}

                            />
                            <Switch value={this.state.Secure} onValueChange={this.ChangeSecure.bind(this)}/>
                        </View>
                        {
                            this.state.loading?
                                <View style={styles.DisableBtn}>
                                    <ActivityIndicator size="small" color="#515151" />
                                    <Text style={styles.ButtonText}> ورود</Text>

                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.Login()} activeOpacity={.7} style={styles.RegisterBtn}>
                                    <Text style={styles.ButtonText}> ورود</Text>
                                </TouchableOpacity>
                        }

                        <View style={styles.Footer} >

                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Register', {RouteName: this.props.RouteName})}
                                activeOpacity={.7}>
                                <Text style={styles.Text}>ثبت نام</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('ForgetPassword', {RouteName:this.props.RouteName})}
                                activeOpacity={.7}>
                                <Text style={styles.Text}>فراموشی رمز عبور؟</Text>
                            </TouchableOpacity>
                        </View>
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
    Footer:{
        width:'100%',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        justifyContent:'space-around'

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
        alignItems:I18nManager.isRTL?'flex-start':'flex-end',
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
        //  marginTop:20,
        marginBottom:10,
        resizeMode:'stretch',
        alignSelf:'center',
        height:35,
        width:40
    },
    DrawerIcon:{
        marginLeft:5,marginRight:5,
        height:20,
        width:20,
        resizeMode:'stretch'
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
    }
});
