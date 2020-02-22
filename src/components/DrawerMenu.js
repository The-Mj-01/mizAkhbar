import React, { Component } from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, StatusBar, AsyncStorage} from 'react-native';
import {I18nManager} from 'react-native';
import { navigation,DrawerActions } from 'react-navigation';
import './global';
import ImagePicker from 'react-native-image-crop-picker';
export default class DrawerMenu extends Component{

    constructor(props)
    {
        super(props)
        this.state={
            NightMode:false,token:''
        }
    }

    componentWillReceiveProps(nextProps){
        this.GetNightMode()
        this.GetToken()

    }
    componentDidMount(){
        this.GetNightMode()
        this.GetToken()
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetToken();
            })
    }
    GetNightMode(){
        AsyncStorage.getItem('NightMode', (err, result) => {
            if(result!==null ) {

                if(result==='true')
                    this.setState({NightMode: true})
                else this.setState({NightMode: false})
            }
            else this.setState({NightMode: false});

        });
    }
    GetToken(){
        AsyncStorage.getItem('token', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({token: result})
            }
            else if(result==null)
            {
                this.setState({token:''})
            }
        });
    }
    Test(){
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.warn(image);
        });
    }
    render(){

        return(

            <View style={this.state.NightMode?styles.DarkDrawerContainer:styles.LightDrawerContainer}>
                <StatusBar hidden />
                <Image
                    style={styles.DrawerImage}
                    source={require('../images/DrawerImage.jpg')}
                />
                <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Settings');this.props.navigation.dispatch(DrawerActions.closeDrawer())}}
                                  style={this.state.NightMode?styles.DarkDrawerBTN:styles.LightDrawerBTN} >

                    <Text style={this.state.NightMode?styles.DarkDrawerBTNText:styles.LightDrawerBTNText}>تنظیمات</Text>
                </TouchableOpacity>
             {/*   <TouchableOpacity  onPress={()=>{this.props.navigation.navigate('Privacy');this.props.navigation.dispatch(DrawerActions.closeDrawer())}}
                                   style={this.state.NightMode?styles.DarkDrawerBTN:styles.LightDrawerBTN}>

                    <Text style={this.state.NightMode?styles.DarkDrawerBTNText:styles.LightDrawerBTNText}>سلب مسئولیت</Text>
                    </TouchableOpacity>*/}
                <TouchableOpacity  onPress={()=>{this.props.navigation.navigate('Feedback',{token:this.state.token});this.props.navigation.dispatch(DrawerActions.closeDrawer())}}
                                   style={this.state.NightMode?styles.DarkDrawerBTN:styles.LightDrawerBTN}
                >
                    <Text style={this.state.NightMode?styles.DarkDrawerBTNText:styles.LightDrawerBTNText}>ارسال پیام</Text>

                </TouchableOpacity>
                {
                    this.state.token != '' ?
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.dispatch(DrawerActions.closeDrawer())
                        this.props.navigation.navigate('ChangePassword',{token:this.state.token,RouteName:this.props.navigation.state.routeName});

                    }}
                                      style={this.state.NightMode ? styles.DarkDrawerBTN : styles.LightDrawerBTN}
                    >
                        <Text style={this.state.NightMode ? styles.DarkDrawerBTNText : styles.LightDrawerBTNText}>تغییر رمز عبور</Text>
                    </TouchableOpacity> : null
                }
               {/* <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Aboutus');this.props.navigation.dispatch(DrawerActions.closeDrawer())}}
                                  style={this.state.NightMode?styles.DarkDrawerBTN:styles.LightDrawerBTN}
                >
                    <Text style={this.state.NightMode?styles.DarkDrawerBTNText:styles.LightDrawerBTNText}>درباره ما...</Text>
                </TouchableOpacity>*/}

            </View>
        );

    }
}// end class


const styles=StyleSheet.create(
    {
        DarkDrawerContainer:{
            flex:1,
            width:'100%',
            backgroundColor:'#263238',
            //alignItems:'flex-start',
        },
        LightDrawerContainer:{
            flex:1,
            width:'100%',
            backgroundColor:'#F5F5F5',
            //alignItems:'flex-start',
        },
        DrawerImage:{
            width:'100%',
            height:150,
            resizeMode:'stretch',
            //marginBottom:10
        },
        DarkDrawerBTN:{
            alignItems:'center',
            padding:5,
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            width:'100%',
            backgroundColor:'#263238',
            borderBottomWidth:1,
            borderBottomColor:'rgba(255, 255, 255,.2)'

        },
        LightDrawerBTN:{
            alignItems:'center',
            padding:5,
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            width:'100%',
            backgroundColor:'#F5F5F5',
            borderBottomWidth:1,
            borderBottomColor:'rgba(66, 66, 66,.2)'
        },
        DarkDrawerBTNText:{
            padding:5,
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
            textAlign:'center',
        },
        LightDrawerBTNText:{
            padding:5,
            fontFamily:global.fontFamily,
            fontSize:12,
            color:'#212121',
            textAlign:'center',
        },
        DarkDrawerBTNIcon:{
            paddingRight:10,
        },
        LightDrawerBTNIcon:{
            color:'#212121',
            paddingRight:10,
        }

    }
);