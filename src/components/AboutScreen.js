import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity,Image, I18nManager, AsyncStorage} from 'react-native';
import './global';
export default class AboutScreen extends React.Component{

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
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode()
            })
        this.GetNightMode()
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
                <View style={{marginTop:40,flex:1,width:'100%'}}>
                    <Text style={this.state.NightMode?styles.DarkText:styles.LightText}>درباره ما</Text>
                    <Text style={this.state.NightMode?styles.DarkText:styles.LightText}
                    >
                        در انبوه رسانه های رنگارنگ خبری آنچه کمتر مورد توجه قرار میگیرد نیازهای واقعی مخاطب است.
                        رسانه ها هر یک با سلیقه ای اخبار و تحلیل های هدفمند را بازتاب میدهند و
                        نیاز واقعی مخاطبین در میان نویز حاصل از سلیقه های مختلف صاحبان رسانه مغفول میماند.
                        در زلکا بر آنیم شما را کمترین میزان محتوای زائد به نیازهای اصلی تان برسانیم.
                        در زلکا میتوانید
                        مهم ترین عناوین خبری روز را که بر اساس دقیق ترین الگوریتم ها انتخاب میشوند مشاهده کنید
                        گروه و یا دسته های خبری خاص را دنبال نمایید
                        کلیدواژه های مورد نظر خود را به طور مداوم و پویا بیابید
                        مجموعه ای از بهترین تصاویر خبری روز را ورق بزنید
                        از مجموعه ی آنچه دنبال میکنید و بر اساس فعالیتتان
                        در برنامه سلیقه ی خبری شما نام گذاری میشود لیستی دائما به روز از محتوا در اختیار داشته باشید.
                        آنچه در زلکا مشاهده میکنید حاصل کاوش بی وقفه ی ربات های دقیق و سریع ما
                        در مهمترین منابع خبری است. در زلکا هیچ خبری از قلم نمیافتد و منابع زلکا روز به روز کامل تر میشود.
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
        position:'absolute',
        width:'100%',
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:999
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

