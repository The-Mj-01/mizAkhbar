import React from 'react';
import {View,StatusBar,TouchableOpacity,ActivityIndicator,AsyncStorage,Platform,TextInput, Text,Animated,Image, StyleSheet, I18nManager} from 'react-native';
import './global'
import Toast from "./SimpleToast";
import {EventRegister} from "react-native-event-listeners";
export default class ConfirmationScreen extends React.Component {

    constructor(props){
        super(props)
        this.state={
            Code:'',token:'',username:'',password:'',loading:false
        }
        this.Confirm=this.Confirm.bind(this)
        this.Login=this.Login.bind(this)
    }
    componentDidMount(){
        this.setState({token:this.props.navigation.state.params.token})
        this.setState({username:this.props.navigation.state.params.username})
        this.setState({password:this.props.navigation.state.params.password})
    }
    ChangeConfirm(text){
        this.setState({Code:text.trim()})
    }
    async Login()
    {
        try {
            let RegisterAddress = global.ApiAddress + "/user/login";
            var formData = new FormData();
            formData.append('username', this.state.username)
            formData.append('password', this.state.password)
            let response = await fetch(RegisterAddress, {
                method: 'POST',
                headers: {
                    'x-token':this.state.token
                },
                body: formData
            });
            let Data = await response.json();
            if (Data.data.status == "success") {
                this.setState({loading:false})
                await AsyncStorage.setItem('token',Data.data.token)
                this.props.navigation.navigate(this.props.navigation.state.params.RouteName)
            }

        }
        catch(err)
        {

        }

    }
    Confirm(){
        let ConfirmAddress=global.ApiAddress+"/user/confirm?code="+this.state.Code+"&&username="+this.state.username;
        this.setState({loading:true})
        if(this.state.Code=='')
        {
            Toast.showWithGravity('کد ارسال شده به شماره موبایل خود را وارد کنید.',Toast.LONG,Toast.CENTER)
            this.setState({loading:false})
        }
        else
        {
            fetch(ConfirmAddress, {
                method: 'GET',
                headers: {
                    'x-token':this.state.token
                },
                //body:formData
            }).then(respone=>respone.json())
                .then(Data=>
                    {
                        if(Data.data.status=="success"){
                            Toast.showWithGravity('ثبت نام شما با موفقیت انجام شد ',Toast.LONG,Toast.CENTER)
                            //this.Login()
                            AsyncStorage.setItem('UserName',this.state.username)
                            EventRegister.emitEvent('CheckLogin')
                            this.props.navigation.navigate(this.props.navigation.state.params.RouteName)
                            this.setState({loading:false})
                        }
                        else if(Data.data.status=="fail")
                        {
                            if(Data.data.message=="confirm code is invalid or user is confirmed later" )
                            {
                                Toast.showWithGravity('شماره مورد نظر قبلا تایید شده است یا کد تایید وارد شده اشتباه است ',Toast.LONG,Toast.CENTER)
                                this.setState({loading:false})
                            }
                            else if(Data.data.message=="token is invalid"){
                                Toast.showWithGravity('فعال سازی نا معتبر است',Toast.LONG,Toast.CENTER)
                                this.setState({loading:false})
                            }
                        }
                    }
                ).catch(err=>{ });
        }

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
                        <Text style={styles.HeaderTitle}>تایید شماره موبایل</Text>
                        <Image source={require('.././images/Confirmation.png')}
                               style={styles.Logo}
                        />
                    </View>
                    <View style={styles.Bottom}>

                        <View style={{width:'78%'}}>
                            <Text style={styles.Text}>لطفاً کد فعال سازی ارسال شده به شماره موبایل را در کادر زیر وارد نمایید</Text>
                        </View>

                        <TextInput maxLength = {11} keyboardType={'phone-pad'} autoFocus = {true} style={styles.TextInput} underlineColorAndroid={'transparent'}
                                   onChangeText={this.ChangeConfirm.bind(this)} placeholder={'کد فعال سازی'}  placeholderTextColor={global.Gray2}
                        />
                        {
                            this.state.loading ?
                                <View style={styles.DisableBtn}>
                                    <ActivityIndicator size="small" color="#515151"/>
                                    <Text style={styles.ButtonText}> ارسال کد</Text>

                                </View>
                                :
                                <TouchableOpacity onPress={() => this.Confirm()} activeOpacity={.7}
                                                  style={styles.RegisterBtn}>
                                    <Text style={styles.ButtonText}>ارسال کد</Text>
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
