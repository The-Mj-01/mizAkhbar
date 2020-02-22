import React from 'react';
import {View, Text, StyleSheet,Image,TouchableOpacity ,I18nManager, AsyncStorage} from 'react-native';
import './global';
export default class PrivacyScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            NightMode:false
        }
    }
    async GetNightMode(){
        await AsyncStorage.getItem('NightMode', (err, result) => {
            result=result==='true'?true:false
            if(result!=this.state.NightMode){
                this.setState({NightMode: result})
            }
        });
    }
    componentDidMount(){
        this.GetNightMode()
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode()
            })
        // this.CloseDrawer.bind(this)
    }
    render(){
        return(
            <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                <View style={styles.Header}>
                    <View style={styles.RightContainer}>
                        <TouchableOpacity activeOpacity={.6} onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={styles.DrawerIcon} source={require('.././images/DrawerIcon.png')}/>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.LeftContainer}>

                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} activeOpacity={.6}>
                            <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={{flex:1,width:'100%'}}>
                    <Text style={this.state.NightMode?styles.DarkText:styles.LightText}>هشدار!</Text>
                    <Text style={this.state.NightMode?styles.DarkText:styles.LightText}
                    >این اپلیکیشن تمام محتوای خبری خود را از منابع رسمی و سرویس های قانونی تهیه می کند
                        ماشین های جمع آوری محتوای این اپلیکیشن منابع را با دقت بررسی می کنند و در راستای پایبندی به اصل امانتداری
                        بی آنکه مطلبی از قلم بیافتد آنها را در دسته بندی های اصلاح شده به شما نشان می دهد.
                        تمامی آمار و جداول اطلاعاتی این اپلیکیشن بر مبنای الگوریتم های هوشمند مبتنی بر اصول علمی ، از محتوای رسانه هاست و این
                        اپلیکیشن به هیچ عنوان در اولویت ها نحوه چینش اطلاعات و ارتباط میان مطالب
                        از سلیقه کاربری استفاده نمی کند. این نیز صرفاً از حذف بخش های تکراری مطالب بهره برده، کلامی به
                        محتوای منتشر شده در رسانه ها اضافه نمیشود.
                    </Text>
                </View>
            </View>
        );

    }

} // end class
const styles=StyleSheet.create({
    DarkContainer:{
        flex:1,
        backgroundColor:global.DarkContainer,
    },
    LightContainer:{
        flex:1,
        backgroundColor:global.LightContainer,
    },
    Header:{
        backgroundColor:global.HeaderColor,
        width:'100%',
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
    },
    RightContainer:{
        flexDirection:'row',
        flex:.3,
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
    DrawerIcon:{
        marginRight:5,marginLeft:5,
        height:20,
        width:20,
        resizeMode:'stretch'
    },
    DarkText:{
        padding:10,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize14,
        color: '#F5F5F5',
        width:'98%'
    },
    LightText:{
        padding:10,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize14,
        color:'#212121',
        width:'98%'
    }
})

