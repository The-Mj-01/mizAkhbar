import React from 'react';
import {View,Text,TouchableOpacity,PanResponder,NetInfo,Dimensions,findNodeHandle,Animated,I18nManager,StyleSheet,Image} from 'react-native';
import SwipeableParallaxCarousel from 'react-native-swipeable-parallax-carousel';
import './global.js'
import Toast from './SimpleToast'
import { EventRegister } from 'react-native-event-listeners'

export default class NewsItem extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            paused:true,progress:0,duration:0,LocX:null,LocY:null,bottom:0,score:0,EmojiIcon:'',Liked:false,height:250,
        },
            this.AnimatedItem=new Animated.Value(0)
    }
    componentWillMount() {
        //  this.AnimateItem()
        //this.GetEmojiIcon()
        //const {width}=Dimensions.get('window')
        //if(this.props.item.image_url) Image.getSize(this.props.item.image_url, (height) => {this.setState({height:(width/height)*height})});
        this.MenuResponder = PanResponder.create(
            {
                onStartShouldSetPanResponder: (event, gestureState) => true,

                onStartShouldSetPanResponderCapture: (event, gestureState) => true,

                onMoveShouldSetPanResponder: (event, gestureState) => false,

                onMoveShouldSetPanResponderCapture: (event, gestureState) => false,

                onPanResponderGrant: (event, gestureState) => {
                    this.setState({LocX:event.nativeEvent.pageX})
                    this.setState({LocY:event.nativeEvent.pageY})
                },

                onPanResponderMove: (event, gestureState) => false,

                onPanResponderRelease: (event, gestureState) =>
                {
                    const index=this.props.index
                    const item=this.props.item
                    const X=this.state.LocX
                    const Y=this.state.LocY
                    const data={
                        index,
                        item,
                        X,
                        Y
                    }

                    this.props.ShowMenu(data)
                }
            });
        this.RateResponder = PanResponder.create(
            {
                onStartShouldSetPanResponder: (event, gestureState) => true,

                onStartShouldSetPanResponderCapture: (event, gestureState) => true,

                onMoveShouldSetPanResponder: (event, gestureState) => false,

                onMoveShouldSetPanResponderCapture: (event, gestureState) => false,

                onPanResponderGrant: (event, gestureState) => {
                    this.setState({LocX:event.nativeEvent.pageX})
                    this.setState({LocY:event.nativeEvent.pageY})
                },

                onPanResponderMove: (event, gestureState) => false,

                onPanResponderRelease: (event, gestureState) =>
                {
                    const index=this.props.index
                    const item=this.props.item
                    const X=this.state.LocX
                    const Y=this.state.LocY
                    const data={
                        index,
                        item,
                        X,
                        Y
                    }
                    this.listener = EventRegister.addEventListener('SetScore', (data) => {
                       if(this.props.item.id==data.id)
                        {
                            this.setState({score: data.score})
                            this.GetEmojiIcon()
                        }

                        EventRegister.removeEventListener(this.listener)

                    })
                    this.props.ShowRating(data)

                }
            });
    }
    async Like(id) {
        if(!this.state.Liked)
        {
            var LikeAddress=global.ApiAddress+'/tag/like'
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
                let response = await fetch(LikeAddress, {
                    method: 'POST',
                    headers: {'x-token':this.props.token},
                    body: formData
                });
                let Data=await response.json()
                if(Data.data.status=='success'){
                    this.setState({Liked:true})
                    Toast.showWithGravity('لایک با موفقیت ثبت شد',Toast.LONG,Toast.CENTER)
                }
                else if(Data.data.status=='fail'){
                    if(Data.data.message=='Unauthorized'){
                        Toast.showWithGravity('برای لایک کردن باید ثبت نام کنید یا وارد حساب کاربری شوید',Toast.LONG,Toast.CENTER)
                    }
                    else if(Data.data.message=='like is repeated or invalid news id'){
                        Toast.showWithGravity('شما قبلا لایک کرده اید',Toast.LONG,Toast.CENTER)
                    }
                }
            }
            else{
                Toast.showWithGravity('خطا در ارتباط با سرور، اینترنت دستگاه خود را بررسی نمایید',Toast.LONG,Toast.CENTER)
            }
        }
        else{Toast.showWithGravity('شما قبلا لایک کرده اید',Toast.LONG,Toast.CENTER)}

    }
    GetEmojiIcon(){
        switch(this.state.score){
            case 1:
                this.setState({EmojiIcon:require('.././images/SelectedSurprise.png')})
                break;
            case 2:
                this.setState({EmojiIcon:require('.././images/SelectedHappy.png')})
                break;
            case 3:
                this.setState({EmojiIcon:require('.././images/SelectedApathetic.png')})
                break;
            case 4:
                this.setState({EmojiIcon:require('.././images/SelectedAngri.png')})
                break;
            case 5:
                this.setState({EmojiIcon:require('.././images/SelectedSad.png')})
                break;
            default:
                break;
        }
    }
    AnimateItem(){
        Animated.sequence([
            Animated.delay((this.props.index/10)*300)
            ,Animated.timing(this.AnimatedItem, {
                toValue: 1,
                duration: 600,
            })
        ]).start();
    }
    renderFooter(){
        const {NightMode,ShowMenu,item}=this.props;
        return(
            <View  style={NightMode ? styles.DarkFooter : styles.LightFooter}>

                {item.likes!=null?<View style={[styles.Status,{backgroundColor:NightMode?global.Gray8:global.White2}]}>
                    <Text style={NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {this.state.Liked?item.likes+1:item.likes}
                    </Text>
                    <TouchableOpacity onPress={()=>this.Like(this.props.item.id)} style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                        <Image style={styles.StatusImg}
                               source={this.state.Liked?require('.././images/Liked.png'):(NightMode?require('.././images/LightLike.png'):require('.././images/DarkLike.png'))}/>
                    </TouchableOpacity>
                </View>:null
                }
                {item.comments!=null?<View style={[styles.Status,{backgroundColor:NightMode?global.Gray8:global.White2}]}>
                    <Text style={NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {item.comments}
                    </Text>
                    <View style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                        <Image style={styles.StatusImg}
                               source={NightMode?require('.././images/LightComments.png'):require('.././images/DarkComments.png')}/>
                    </View>
                </View>:null
                }
                {item.views!=null?<View style={[styles.Status,{backgroundColor:NightMode?global.Gray8:global.White2}]}>
                    <Text style={NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {item.views}
                    </Text>
                    <Image style={styles.StatusImg}
                           source={NightMode?require('.././images/LightView.png'):require('.././images/DarkView.png')}/>
                </View>:null
                }
                <View {...this.RateResponder.panHandlers} style={[styles.Status,{backgroundColor:NightMode?global.Gray8:global.White2}]}>
                    {
                        this.state.score==0?
                            <TouchableOpacity  >
                                <Image style={styles.StatusImg}
                                       source={NightMode?require('.././images/LightClick.png'):require('.././images/DarkClick.png')}/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={()=>this.Like(this.props.item.id)} style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                                <Image style={styles.StatusImg}
                                       source={this.state.EmojiIcon}/>
                            </TouchableOpacity>
                    }

                </View>
                <View  {...this.MenuResponder.panHandlers} style={[styles.Status,{backgroundColor:NightMode?global.Gray8:global.White2}]}>
                    <TouchableOpacity >
                        <Image style={styles.StatusImg}
                               source={NightMode?require('.././images/LightMenu.png'):require('.././images/DarkMenu.png')}/>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
    render() {
        const {NightMode,Open,ShowMenu,item} = this.props;

        if(item.style===2)
        {
            return (
                <View  style={NightMode ? styles.DarkContainer : styles.LightContainer}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                    &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>
                        <Image style={[styles.Style2Pic,{minHeight:this.state.height}]} source={item.image_url!==null?{uri:item.image_url}:require('.././images/MizAkhbar.png' )}
                        />
                        {item.category!=null || item.category!=undefined ? <Text style={[styles.Summary3,{bottom:20}]}>
                            {item.category}
                        </Text>:null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                    &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>

                        <Text style={NightMode?styles.DarkTitle:styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={NightMode?styles.DarkAgency:styles.LightAgency}>
                            {item.agency==null?null:this.props.item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}
                        </Text>
                        <Text style={NightMode?styles.DarkSummary:styles.LightSummary}>
                            {item.summary}
                        </Text>
                    </TouchableOpacity>
                    {this.renderFooter()}

                </View>

            )
        }
        if(item.style===3)
        {
            return (

                <View  style={NightMode ? styles.DarkContainer : styles.LightContainer}>

                    <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                    &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>

                        <Image style={[styles.Style3Pic,{minHeight:this.state.height}]} source={item.image_url!==null?{uri:item.image_url}:require('.././images/MizAkhbar.png' )}
                        />
                        {item.category!=null || item.category!=undefined?<Text style={[styles.Agency3,{top:60}]}>
                            {item.category}
                        </Text>:null
                        }
                        <Text style={[styles.Title3,{top:90}]}>
                            {item.title}
                        </Text>
                        <Text style={[styles.Summary3,{bottom:20}]}>
                            {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}
                        </Text>
                    </TouchableOpacity>
                    {this.renderFooter()}
                </View>

            )
        }
        if(item.style===4)
        {
            var images=[]
            for(let i=0;i<item.image_gallery.length-1;i++){
                let image={'imagePath':item.image_gallery[i]}
                images.push(image)
            }
            return (

                <View  style={NightMode ? styles.DarkContainer : styles.LightContainer}>
                    <SwipeableParallaxCarousel
                        data={images}
                        navigationType={'dots'}
                        navigationColor='#FFFFFF'
                        navigation='true'
                        height={250}
                    />
                    <TouchableOpacity onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                    &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>

                        <Text style={NightMode?styles.DarkTitle:styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={NightMode?styles.DarkAgency:styles.LightAgency}>
                            {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                        </Text>
                        <Text style={NightMode?styles.DarkSummary:styles.LightSummary}>
                            {item.summary}
                        </Text>
                    </TouchableOpacity>
                    {this.renderFooter()}
                </View>

            )
        }
        if(item.style===5)
        {
            return (

                <View  style={NightMode ? styles.DarkContainer : styles.LightContainer}>

                    <TouchableOpacity style={styles.PlayBtn} onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                                            &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>
                        <Image style={[styles.Video,{minHeight:this.state.height}]} source={{uri:item.image_url}}
                        />
                        <Image style={styles.PlayImage} source={require('.././images/Play.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.props.navigation.state.routeName!='Search'
                                                    &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>
                        <Text style={NightMode?styles.DarkTitle:styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={NightMode?styles.DarkAgency:styles.LightAgency}>
                            {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                        </Text>
                        <Text style={NightMode?styles.DarkSummary:styles.LightSummary}>
                            {item.summary}
                        </Text>
                    </TouchableOpacity>

                    {this.renderFooter()}
                </View>
            )
        }
        if(item.style==6)/*item.image_url===null*/
        {
            return (

                <View  style={NightMode ? styles.DarkContainer : styles.LightContainer}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                    &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>
                        <Text style={NightMode?styles.DarkTitle:styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={NightMode?styles.DarkAgency:styles.LightAgency}>
                            {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                        </Text>
                        <Text style={NightMode?styles.DarkSummary:styles.LightSummary}>
                            {item.summary}
                        </Text>
                    </TouchableOpacity>
                    {this.renderFooter()}
                </View>
            )
        }
        return (
            <View  style={NightMode ? styles.DarkContainer : styles.LightContainer}>
                <TouchableOpacity onPress={()=>{this.props.navigation.state.routeName!='Search'&&this.props.navigation.state.routeName!='CategoryNews'
                                                &&this.props.navigation.state.routeName!='BookmarkedNews'?this.props.navigation.goBack():null;this.props.navigation.push('NewsDetail',{token:this.props.token,Liked:this.state.Liked,score:this.state.score,RouteName:this.props.RouteName,item:this.props.item,ShowRating:this.props.ShowRating})}} activeOpacity={.95}>
                    <View style={styles.Style1Header}>
                        <Text  style={NightMode ? styles.DarkTitle1 : styles.LightTitle1}>
                            {item.title}
                        </Text>
                        <Image blurRadius={25} source={{uri:item.image_url}}
                               style={styles.Style1Pic}
                        />
                    </View>
                    <Text style={NightMode ? styles.DarkSummary : styles.LightSummary}>
                        {item.summary}
                    </Text>
                    <Text style={NightMode?styles.DarkAgency:styles.LightAgency}>
                        {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                    </Text>
                </TouchableOpacity>
                {this.renderFooter()}
            </View>
        )
        //  return null

    }//end render
}//end class

const styles=StyleSheet.create({
    DarkContainer:{
        borderRadius:2,
        alignSelf:'center',
        width:'100%',
        backgroundColor:global.Gray8,
        // marginTop:2,
        // marginBottom:2,
    },
    LightContainer:{
        borderRadius:2,
        alignSelf:'center',
        width:'100%',
        backgroundColor:global.White2,
    },
    Style1Header:{
        marginBottom:10,
        justifyContent:'space-around',
        paddingLeft:10,paddingRight:10,
        alignSelf:'center',
        alignItems:'center',
        height:150,
        width:'100%',
        flexDirection:I18nManager.isRTL?'row':'row-reverse'
    },
    DarkFooter:{
        alignSelf:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        justifyContent:'space-around',
        width:'100%',
        height:40,
    },
    LightFooter:{
        alignSelf:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        justifyContent:'space-around',
        width:'100%',
        height:40,
    },
    DarkTitle1:{
        width:'40%' ,
        flexWrap:'wrap',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize16,
        color:'#F5F5F5',
        textAlignVertical:'center'
    },
    LightTitle1:{
        width:'40%',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize16,
        color:global.DarkContainer,
        textAlignVertical:'center'
    },
    DarkTitle:{
        flexWrap:'wrap',
        marginRight:'5%',
        marginLeft:'5%',
        paddingTop:10,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize16,
        color:'#F5F5F5',
        textAlignVertical:'center'
    },
    LightTitle:{
        paddingTop:10,
        marginRight:'5%',
        marginLeft:'5%',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize16,
        color:global.DarkContainer,
        textAlignVertical:'center'
    },
    Status:{
        paddingLeft:10,paddingRight:10,
        flexDirection:I18nManager.isRTL?'row-reverse':'row',
        justifyContent:'center',
        alignItems:'center'
    },
    StatusImg:{
        marginRight:I18nManager.isRTL?2:null,
        marginLeft:I18nManager.isRTL?null:2,
        resizeMode:'stretch',
        height:20,
        width:20
    },
    Agency:{
        width:'30%',
        textAlign:'center',
        margin:5,
        borderWidth:1,
        borderColor:'red',
        backgroundColor:'#FA4422',
        color:'#F5F5F5',
        fontSize:global.fontSize13,
        fontFamily:global.fontFamily
    },
    DarkStatusText:{
        // marginRight:5,marginLeft:5,
        paddingTop:5,
        marginLeft:I18nManager.isRtl?null:5,
        marginRight:I18nManager.isRtl?5:null,
        textAlignVertical:'center',
        textAlign:'center',
        fontFamily:global.fontFamily,
        color:'#F5F5F5',
        fontSize:global.fontSize11,
    },
    LightStatusText:{
        // marginLeft:5,marginRight:5,
        marginLeft:I18nManager.isRtl?null:5,
        marginRight:I18nManager.isRtl?5:null,
        textAlignVertical:'center',
        textAlign:'center',
        fontFamily:global.fontFamily,
        color:global.Gray2,
        fontSize:global.fontSize11,
    },
    DarkSummary:{
        marginRight:'5%',
        marginLeft:'5%',
        paddingTop:10,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize13,
        color:global.Gray6,
    },
    LightSummary:{
        marginRight:'5%',
        marginLeft:'5%',
        paddingTop:10,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize13,
        color:global.Gray2,
    },
    DarkAgency:{
        paddingTop:10,
        marginRight:'5%',
        marginLeft:'5%',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize13,
        color:global.Gray4,
    },
    LightAgency:{
        paddingTop:10,
        marginRight:'5%',
        marginLeft:'5%',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize13,
        color:global.Gray3,
    },
    Agency3:{
        textAlign:'center',
        left:I18nManager.isRTL?5:null,
        right:I18nManager.isRTL?null:5,
        backgroundColor:'rgba(66, 66, 66,1)',
        opacity:.7,
        top:30,
        position:'absolute',
        paddingRight:'2%',paddingLeft:'2%',
        marginRight:'5%',
        marginLeft:'5%',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12,
        color:global.White2,
    },
    Title3:{
        textAlign:'center',
        left:I18nManager.isRTL?5:null,
        right:I18nManager.isRTL?null:5,
        backgroundColor:'rgba(66, 66, 66,1)',
        opacity:.7,
        top:20,
        position:'absolute',
        flexWrap:'wrap',
        paddingRight:'2%',paddingLeft:'2%',
        marginRight:'5%',
        marginLeft:'5%',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize16,
        color:global.White1,
        textAlignVertical:'center'
    },
    Summary3:{
        textAlign:'center',
        left:I18nManager.isRTL?5:null,
        right:I18nManager.isRTL?null:5,
        backgroundColor:'rgba(66, 66, 66,1)',
        opacity:.7,
        bottom:50,
        paddingRight:'2%',paddingLeft:'2%',
        marginRight:'5%',
        marginLeft:'5%',
        position:'absolute',
        marginTop:5,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize13,
        color:global.White1,
    },
    DarkCategory:{
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12,
        color:global.White2,
    },
    LightCategory:{
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12,
        color:global.Gray2,
    },
    Style1Pic:{
        marginTop:25,
        resizeMode:'stretch',
        height:150,
        width:200,
    },
    Style2Pic:{
        resizeMode:'stretch',
        alignSelf:'center',
        width:'100%',
    },
    Style3Pic:{
        alignSelf:'center',
        width:'100%',
        resizeMode:'stretch'
    },
    Video:{
        resizeMode:'stretch',
        justifyContent:'center',
        alignItems:'center',
        //minHeight:200,
        width:'100%'
    },
    VideoControls:{
        backgroundColor:'rgba(0,0,0,.5)',
        height:40,width:'100%',
        left:0,
        bottom:0,
        position:'absolute',
        alignItems:'center',
        justifyContent:'space-around',
        paddingHorizontal:10,
        zIndex:1000
    },

    PlayBtn:{
        top:0,
        justifyContent:'center',
        zIndex:1001
    },
    PlayImage:{
        alignSelf:'center',
        position:'absolute',
        height:40,
        width:40,
        resizeMode:'stretch'
    }



})