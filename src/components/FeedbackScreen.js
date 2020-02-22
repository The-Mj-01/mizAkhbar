import React from 'react';
import {
    View, Animated, Text,Easing, TouchableOpacity,findNodeHandle, StyleSheet, FlatList, I18nManager,
    Image, AsyncStorage, Platform,TextInput,
} from 'react-native';
import './global';
import Toast from './SimpleToast';
import ImagePicker from 'react-native-image-crop-picker';
export default class FeedBacks extends React.Component{

    constructor(props){
        super(props)
        this.state={
            NightMode:false,loading:false,Message:'',File:'',Title:''
        }
        this.AnimatedItem=new Animated.Value(0)
        this.SendMessage=this.SendMessage.bind(this)
        this.PickImage=this.PickImage.bind(this)
    }
    AnimateBox(){
        Animated.sequence([
            Animated.delay(300),
            Animated.spring(this.AnimatedItem,{
                toValue:1,
                velocity:1
            }),

        ]).start()
    }
    async SendMessage(){
        try {
            this.setState({loading:true})
            let CommentAddress = global.ApiAddress + "/message/create";
            if (this.state.Message == '' || this.state.Title=='') {
                Toast.showWithGravity('عنوان و متن پیام را وارد کنید', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }

            else {

                var formData = new FormData();
                formData.append('title', this.state.Title)
                formData.append('body',this.state.Message)

                //formData.append('image',this.state.File)
                let response = await fetch(CommentAddress, {
                    method: 'POST',
                    headers: {'x-token':this.props.navigation.state.params.token},
                    body: formData
                });

                let Data = await response.json();
                if (Data.data.status == "success") {
                    this.props.navigation.goBack()
                    this.setState({loading:false})
                    Toast.showWithGravity('پیام شما با موفقیت ارسال شد',Toast.SHORT,Toast.CENTER)
                }
                else if (Data.data.status == "fail") {
                    if (Data.data.message == "news_id and text is required") {
                        Toast.showWithGravity('ثبت نظر با خطا مواجه شد', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                    else if(Data.data.message=="Unauthorized"){
                        Toast.showWithGravity('برای ارسال پیامباید عضو شوید یا با وارد حساب کاربری خود شوید', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                    else{

                        Toast.showWithGravity('ارسال پیام با خطا مواجه شد', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                }
            }
        }
        catch(err)
        {
            Toast.showWithGravity('ارسال پیام با خطا مواجه شد', Toast.LONG, Toast.CENTER)
        }
        finally {this.setState({loading:false})}
    }//end send message
    ChangeMessage(text){
        this.setState({Message:text.trim()})
    }
    ChangeTitle(text){
        this.setState({Title:text.trim()})
    }
    PickImage(){
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.setState({File:image})
        });
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
        this.AnimateBox()
        this.GetNightMode()
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode()
            })
    }

    render(){
        const translateY=this.AnimatedItem.interpolate({
            inputRange:[0,1],
            outputRange:[700,1]
        })
        return(
            <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                <Animated.View style={[styles.Box,{ backgroundColor:this.state.NightMode?'#515151':'#E0E0E0',transform:[{translateY:translateY}]}]}>
                    <View style={styles.Top}>
                        <TouchableOpacity activeOpacity={.4} onPress={()=>this.props.navigation.goBack()}>
                            <Image style={styles.CloseIcon}
                                   source={this.state.NightMode?require('.././images/LightClose.png'):require('.././images/DarkClose.png')} />
                        </TouchableOpacity>
                        <View style={{flex:1}}>

                        </View>
                        <TouchableOpacity onPress={(text)=>this.SendMessage(text)} activeOpacity={.4}>
                            <Image  style={styles.CloseIcon}
                                    source={this.state.NightMode?require('.././images/LightSend.png'):require('.././images/DarkSend.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.GroupView}>
                        <Image style={styles.Icon}
                               source={this.state.NightMode?require('.././images/LightMessage.png'):require('.././images/DarkMessage.png')}
                        />
                        <TextInput onChangeText={this.ChangeTitle.bind(this)} onSubmitEditing={() => { this.SecondTextInput.focus(); }} style={this.state.NightMode?styles.DarkTextInput:styles.LightTextInput} underlineColorAndroid={'transparent'}
                                   placeholder={'عنوان'} placeholderTextColor={this.state.NightMode?'#F0F0F0':global.Gray2}
                        />
                    </View>
                    <View style={styles.GroupView}>
                        <Image style={styles.Icon}
                               source={this.state.NightMode?require('.././images/LightComments.png'):require('.././images/DarkComments.png')}
                        />
                        <TextInput onChangeText={this.ChangeMessage.bind(this)} ref={(input) => { this.SecondTextInput = input; }} multiline style={this.state.NightMode?styles.DarkCommentInput:styles.LightCommentInput} underlineColorAndroid={'transparent'}
                                   placeholder={'بدنه پیام'} placeholderTextColor={this.state.NightMode?'#F0F0F0':global.Gray2}
                        />
                    </View>
                   {/* <View style={styles.GroupView}>
                        <TouchableOpacity style={styles.Button} onPress={()=>this.PickImage()}>
                            <Text style={styles.LightErrText}>انتخاب عکس</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.File!=''?
                        <View style={styles.GroupView}>
                            <Text style={[styles.Text,{color:this.state.NightMode?global.LightContainer:global.DarkContainer}]}>
                                فایل ارسالی
                            </Text>
                            <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} activeOpacity={.4} onPress={()=>this.setState({File:''})}>
                                <Image style={{height:15,width:15}}
                                       source={this.state.NightMode?require('.././images/LightClose.png'):require('.././images/DarkClose.png')} />
                            </TouchableOpacity>
                        </View>:null
                    }*/}
                </Animated.View>

            </View>
        )

    }  //end render

} // end class

const styles=StyleSheet.create({
    DarkContainer:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        backgroundColor:global.DarkContainer,
    },
    LightContainer:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        backgroundColor:"#C0C0C0",
    },
    Box:{
        elevation:5,
        width:'90%',
        minHeight:'50%',
    },
    GroupView:{
        width:'100%',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        borderTopWidth:1,
        borderColor:'#B0B0B0',
    },
    LightErrText:{
        fontFamily:global.fontFamily,
        color:global.White1,
        fontSize:global.fontSize15,
    },
    Button:{
        width:100,
        margin:5,
        backgroundColor:'#CC1111',
        padding:5,
        borderRadius:3,
        justifyContent:'center'
    },
    Top:{
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse'
    },
    Icon:{
        margin:5,
        height:22,
        width:22,
        resizeMode:'stretch'
    },
    CloseIcon:{
        marginLeft:20,marginRight:20,
        height:25,
        width:25,
        resizeMode:'stretch'
    },
    DarkTextInput:{
        fontFamily:global.fontFamily,
        height:40,
        textAlign:'right',
        flex:1,
        color:'#F0F0F0'
    },
    LightTextInput:{
        fontFamily:global.fontFamily,
        height:40,
        textAlign:'right',
        flex:1,
        color:global.Gray2
    },
    Text:{
        padding:5,
        fontFamily:global.fontFamily,
        fontSize:13,
        textAlign:'right',
    },

    DarkCommentInput:{
        fontFamily:global.fontFamily,
        height:200,
        textAlignVertical:'top',
        textAlign:'right',
        flex:1,
        color:'#F0F0F0'
    },
    LightCommentInput:{
        fontFamily:global.fontFamily,
        height:200,
        textAlignVertical:'top',
        textAlign:'right',
        flex:1,
        color:global.Gray2
    },
})