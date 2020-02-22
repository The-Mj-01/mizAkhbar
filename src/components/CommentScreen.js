import React from 'react';
import {
    View, Animated, Text,Easing, TouchableOpacity,findNodeHandle, StyleSheet, FlatList, I18nManager,
    Image, AsyncStorage, Platform,TextInput,
} from 'react-native';
import './global';
import Toast from './SimpleToast';
export default class CommentScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            NightMode: false,loading:false,Comment:''
        },
            this.AnimatedItem=new Animated.Value(0)

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
    componentDidMount(){
        this.AnimateBox()
        this.GetNightMode()
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode()
            })
        this.SendComment=this.SendComment.bind(this)
        // this.CloseDrawer.bind(this)
    }
    ChangeComment(text){
        this.setState({Comment:text.trim()})
    }
    async SendComment()
    {
        try {
            this.setState({loading:true})
            let CommentAddress = global.ApiAddress + "/comment/create";
            if (this.state.Comment == '') {
                Toast.showWithGravity('نظر خود را وارد کنید', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }

            else {

                var formData = new FormData();
                formData.append('news_id', this.props.navigation.state.params.item.id)
                formData.append('text',this.state.Comment)
                let response = await fetch(CommentAddress, {
                    method: 'POST',
                    headers: {'x-token':this.props.navigation.state.params.token},
                    body: formData
                });

                let Data = await response.json();

                if (Data.data.status == "success") {
                    this.props.navigation.goBack()
                    this.setState({loading:false})
                    Toast.showWithGravity('نظر شما با موفقیت ثبت شد',Toast.SHORT,Toast.CENTER)
                }
                else if (Data.data.status == "fail") {
                    if (Data.data.message == "news_id and text is required") {
                        Toast.showWithGravity('ثبت نظر با خطا مواجه شد', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                    else if(Data.data.message=="Unauthorized"){
                        Toast.showWithGravity('برای ثبت نظر باید عضو شوید یا با وارد حساب کاربری خود شوید', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                    else{

                        Toast.showWithGravity('ثبت نظر با خطا مواجه شد', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                }
            }
        }
        catch(err)
        {

            Toast.showWithGravity('ثبت نظر با خطا مواجه شد', Toast.LONG, Toast.CENTER)
        }
        finally {this.setState({loading:false})}

    }
    async GetNightMode(){
        await AsyncStorage.getItem('NightMode', (err, result) => {
            result=result==='true'?true:false
            if(result!=this.state.NightMode){
                this.setState({NightMode: result})
            }
        });
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
                        <TouchableOpacity onPress={()=>this.SendComment()} activeOpacity={.4}>
                            <Image  style={styles.CloseIcon}
                                    source={this.state.NightMode?require('.././images/LightSend.png'):require('.././images/DarkSend.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.GroupView}>
                        <Image style={styles.Icon}
                               source={this.state.NightMode?require('.././images/LightUser.png'):require('.././images/DarkUser.png')}
                        />
                        <TextInput autoFocus = {true} onSubmitEditing={() => { this.secondTextInput.focus(); }} style={this.state.NightMode?styles.DarkTextInput:styles.LightTextInput} underlineColorAndroid={'transparent'}
                                   placeholder={'نام{اختیاری}'} placeholderTextColor={this.state.NightMode?'#F0F0F0':global.Gray2}
                        />
                    </View>
                    <View style={styles.GroupView}>
                        <Image style={styles.Icon}
                               source={this.state.NightMode?require('.././images/LightMessage.png'):require('.././images/DarkMessage.png')}
                        />
                        <TextInput onSubmitEditing={() => { this.ThirdTextInput.focus(); }} ref={(input) => { this.secondTextInput = input; }} style={this.state.NightMode?styles.DarkTextInput:styles.LightTextInput} underlineColorAndroid={'transparent'}
                                   placeholder={'ایمیل{اختیاری}'} placeholderTextColor={this.state.NightMode?'#F0F0F0':global.Gray2}
                        />
                    </View>
                    <View style={styles.GroupView}>
                        <Image style={styles.Icon}
                               source={this.state.NightMode?require('.././images/LightComments.png'):require('.././images/DarkComments.png')}
                        />
                        <TextInput onChangeText={this.ChangeComment.bind(this)} ref={(input) => { this.ThirdTextInput = input; }} multiline style={this.state.NightMode?styles.DarkCommentInput:styles.LightCommentInput} underlineColorAndroid={'transparent'}
                                   placeholder={'نظر خود را بنویسید'} placeholderTextColor={this.state.NightMode?'#F0F0F0':global.Gray2}
                        />
                    </View>
                </Animated.View>

            </View>
        )
    }
}//end class

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
        height:'70%',
    },
    GroupView:{
        width:'100%',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        borderTopWidth:1,
        borderColor:'#B0B0B0',
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
    DarkCommentInput:{
        fontFamily:global.fontFamily,
        height:300,
        textAlignVertical:'top',
        textAlign:'right',
        flex:1,
        color:'#F0F0F0'
    },
    LightCommentInput:{
        fontFamily:global.fontFamily,
        height:300,
        textAlignVertical:'top',
        textAlign:'right',
        flex:1,
        color:global.Gray2
    },
})