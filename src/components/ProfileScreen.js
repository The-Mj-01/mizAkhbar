import React from 'react';
import {View,StatusBar,ActivityIndicator,AsyncStorage,TouchableOpacity,Switch,Platform,TextInput, Text,Animated,Image, StyleSheet, I18nManager} from 'react-native';
import './global'
import EventListener, {EventRegister} from 'react-native-event-listeners'
import VideoPlayer from 'react-native-video-controls';
import Toast from "./SimpleToast";
import Login from './LoginScreen'
export default class ProfileScreen extends React.Component {
    constructor(props){
        super(props)
        this.state={
            Secure:true,username:'',loading:true,token:''
        }

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
    componentDidMount(){
        this.CheckLogin()
        this.listener = EventRegister.addEventListener('CheckLogin', () => {
            this.CheckLogin()
        })
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.CheckLogin()
            })
    }
    CheckLogin(){
        this.GetUserName()

    }
    GetToken(){
        AsyncStorage.getItem('token', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({token: result})
            }
        });
    }
    GetUserName(){
        this.setState({username:''})
        this.setState({loading:true})
        AsyncStorage.getItem('UserName', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({username: result})
                this.setState({loading:false})
            }
            else {
                this.setState({loading:false})
                this.setState({username:''})
            }
        });

    }
    gotoEditProfile(){
        this.props.navigation.navigate('EditProfile')
    }

    render() {
        if(this.state.loading){
            return(
                <View style={[styles.Container,{justifyContent:'center'}]}>
                    <StatusBar hidden />
                    <ActivityIndicator size={'large'} color={'blue'}/>
                </View>
            )
        }

        return(
            <View style={styles.Container}>
                <StatusBar hidden />
                <View style={styles.Top}>
                    <View style={{backgroundColor:global.Gray3, borderRadius:50}}>
                        <Image source={require('.././images/Login.png')}
                               style={styles.Logo}
                        />
                    </View>
                </View>
                {this.state.username!=''?<View style={styles.Bottom}>
                        <View style={styles.GroupView}>
                            <Text style={styles.Text}>نام:</Text>
                            <Text style={styles.Text}>{this.state.name }</Text>
                        </View>


                        <View style={styles.GroupView}>
                            <Text style={styles.Text}>نام کاربری:</Text>
                            <Text style={styles.Text}>{this.state.username }</Text>
                        </View>
                        <TouchableOpacity onPress={this.gotoEditProfile.bind(this)} activeOpacity={.7}
                                          style={styles.button}>
                            <Text style={styles.ButtonText}>ویرایش پروفایل</Text>
                        </TouchableOpacity>

                    </View>:
                    <Login navigation={this.props.navigation} RouteName={this.props.navigation.state.routeName} />
                }
                {/* <View style={styles.Bottom}>
                        <Text style={styles.Text}>برای نمایش اطلاعات کاربری وارد حساب کاربری شوید یا ثبت نام کنید</Text>
                    </View>*/}


            </View>



        )
    }
}
const styles = StyleSheet.create({

    Container: {
        flex: 1,
        backgroundColor:global.LightContainer1,
    },
    GroupView:{
        flexDirection:I18nManager.isRTL?'row':'row-reverse',

    },
    Top:{
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:150,
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
    Logo:{
        marginBottom:10,
        resizeMode:'stretch',
        alignSelf:'center',
        borderRadius:50,
        overflow: 'hidden',
        height:70,
        width:80
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
        fontSize:fontSize12,
        color:global.White1
    },
    Text:{
        padding:5,
        fontFamily:global.fontFamily,
        fontSize:fontSize14,
        color:'#222',
    },
    button:{
        width:100,
        backgroundColor:global.DarkBlue,
    }

});
