import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, PanResponder, I18nManager, NetInfo} from 'react-native';
import Toast from "./SimpleToast";
import { EventRegister } from 'react-native-event-listeners'
import './global';
export default class Rating extends React.PureComponent {

    constructor(props){
        super(props)
        this.state={
        }
        this.Score=this.Score.bind(this)
    }
    componentDidMount(){
        this.props.index!=undefined && this.props.index!=null? this.setState({index:this.props.index}):null
    }
    async Score(id,score) {
        var ScoreAddress=global.ApiAddress+'/tag/score'
        var NetWorkResponse = true
        NetInfo.getConnectionInfo().then((ConnectionInfo) => {
            if (ConnectionInfo.type == 'none') {
                NetWorkResponse = false
            }
            else {
                NetWorkResponse = true
            }
        });

        if(NetWorkResponse==true){
            var formData = new FormData();
            formData.append('news_id',id)
            formData.append('score',score)
            let response = await fetch(ScoreAddress, {
                method: 'POST',
                headers: {'x-token':this.props.token},
                body: formData
            });
            let Data=await response.json()
            if(Data.data.status=='success'){
                Toast.showWithGravity('امتیاز با موفقیت ثبت شد',Toast.SHORT,Toast.CENTER)
                let data={
                    score,
                    id
                }
                EventRegister.emitEvent('SetScore',data)
            }
            else if(Data.data.status=='fail'){
                if(Data.data.message='Unauthorized'){
                    Toast.showWithGravity('برای امتیاز باید ثبت نام کنید یا وارد حساب کاربری شوید',Toast.SHORT,Toast.CENTER)
                }
            }
        }
        else{
            Toast.showWithGravity('خطا در ارتباط با سرور، اینترنت دستگاه خود را بررسی نمایید',Toast.SHORT,Toast.CENTER)
        }
        this.props.CloseMenu()
    }
    render(){
        const {item,NightMode,CloseMenu} =this.props;
        return(
            <View  style={[NightMode?styles.DarkContainer:styles.LightContainer,{top:this.props.LOCY-200>60?this.props.LOCY-200:60,
                right:I18nManager.isRTL?this.props.LOCX-(130/2):null,
                left:I18nManager.isRTL?null:this.props.LOCX-(130/2)}]} >
                <View >
                    <View style={{flexDirection:'column'}}>
                        <Text style={NightMode?styles.LightText:styles.DarkText}>متعجب</Text>
                        <TouchableOpacity onPress={()=>this.Score(this.props.item.id,1)} activeOpacity={.7} style={styles.GroupView}>
                            <Image style={styles.Image} source={NightMode?require('.././images/LightSurprise.png'):require('.././images/DarkSurprise.png')} />
                            <View style={[styles.RateBar,{backgroundColor:NightMode?'#F0F0F0':'#B1B1B1'}]}></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <Text style={NightMode?styles.LightText:styles.DarkText}>خوشحال</Text>
                        <TouchableOpacity onPress={()=>this.Score(this.props.item.id,2)} activeOpacity={.7} style={styles.GroupView}>
                            <Image style={styles.Image} source={NightMode?require('.././images/LightHappy.png'):require('.././images/DarkHappy.png')} />
                            <View style={[styles.RateBar,{backgroundColor:NightMode?'#F0F0F0':'#B1B1B1'}]}></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <Text style={NightMode?styles.LightText:styles.DarkText}>بی تفاوت</Text>
                        <TouchableOpacity onPress={()=>this.Score(this.props.item.id,3)} activeOpacity={.7} style={styles.GroupView}>
                            <Image style={styles.Image} source={NightMode?require('.././images/LightApathetic.png'):require('.././images/DarkApathetic.png')} />
                            <View style={[styles.RateBar,{backgroundColor:NightMode?'#F0F0F0':'#B1B1B1'}]}></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <Text style={NightMode?styles.LightText:styles.DarkText}>عصبانی</Text>
                        <TouchableOpacity onPress={()=>this.Score(this.props.item.id,4)} activeOpacity={.7} style={styles.GroupView}>
                            <Image style={styles.Image} source={NightMode?require('.././images/LightAngri.png'):require('.././images/DarkAngri.png')} />
                            <View style={[styles.RateBar,{backgroundColor:NightMode?'#F0F0F0':'#B1B1B1'}]}></View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <Text style={NightMode?styles.LightText:styles.DarkText}>متاسف</Text>
                        <TouchableOpacity onPress={()=>this.Score(this.props.item.id,5)} activeOpacity={.7} style={styles.GroupView}>
                            <Image style={styles.Image} source={NightMode?require('.././images/LightSad.png'):require('.././images/DarkSad.png')} />
                            <View style={[styles.RateBar,{backgroundColor:NightMode?'#F0F0F0':'#B1B1B1'}]}></View>
                        </TouchableOpacity>
                    </View>

                </View>
               {/* <View style={{width:'100%',justifyContent:'center',flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                    <TouchableOpacity style={styles.SendButton} activeOpacity={.8}>
                        <Text style={styles.ButtonText}>ثبت امتیاز</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>CloseMenu()} style={styles.CancelButton} activeOpacity={.8}>
                        <Text style={styles.ButtonText}>انصراف</Text>
                    </TouchableOpacity>
                </View>*/}
            </View>
        )

    }//end render
}//end class

const styles=StyleSheet.create({
    DarkContainer:{
        borderRadius:3,
        zIndex:999,
        position:'absolute',
        backgroundColor:'#414141',
        elevation:10,
        width:130,
    },
    LightContainer:{
        borderRadius:3,
        zIndex:999,
        position:'absolute',
        backgroundColor:'#E1E1E1',
        elevation:10,
        width:130,
    },
    GroupView:{
        padding:2,
        flexDirection:I18nManager.isRTL?'row-reverse':'row',
        width:'100%'
    },
    RateBar:{
        margin:4,
        flex:9,
        alignSelf:'center',
        height:5,
        borderRadius:10
    },
    Image:{
        margin:4,
        height:25,
        width:25
    },
    DarkText:{
        zIndex:1,
        position:'absolute',
        top:1,
        right:I18nManager.isRTL?null:2,
        left:I18nManager.isRTL?2:null,
        paddingRight:5,paddingLeft:5,
        paddingRight:5,paddingLeft:5,
        color:'#212121',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize10
    },
    LightText:{
        zIndex:1,
        position:'absolute',
        top:1,
        right:I18nManager.isRTL?null:2,
        left:I18nManager.isRTL?2:null,
        paddingRight:5,paddingLeft:5,
        color:'#F5F5F5',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize10
    },
    ButtonText:{
        textAlign:'center',
        paddingRight:5,paddingLeft:5,
        color:'#F5F5F5',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize11
    },
    CancelButton:{
        borderRadius:2,
        justifyContent:'center',
        margin:5,
        alignSelf:'center',
        width:70,
        height:30,
        backgroundColor:'#FF5555',
    },
    SendButton:{
        borderRadius:2,
        justifyContent:'center',
        margin:5,
        alignSelf:'center',
        width:70,
        height:30,
        backgroundColor:'#5555FF',
    },
    StarIcon:{
        resizeMode:'stretch',
        height:30,
        width:30
    }
})