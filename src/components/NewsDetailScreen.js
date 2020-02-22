import React from 'react';
import {
    View, Text, ScrollView,RefreshControl ,StyleSheet, Animated, TouchableOpacity, Image, FlatList, ListView, AsyncStorage, NetInfo,
    I18nManager, PanResponder
} from 'react-native';
import SwipeableParallaxCarousel from 'react-native-swipeable-parallax-carousel';
import VideoPlayer from 'react-native-video-controls';
import './global';
import ContextMenu from './ContextMenu'
import Rating from './Rating';
import NewsItem from './NewsItem'
import {EventRegister} from "react-native-event-listeners";
import Toast from "./SimpleToast";
let Address=global.ApiAddress+'/news?page=1';

export default class NewsDetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            NightMode: false, NetworkErr: false, scrollY: new Animated.Value(0),EmojiIcon:'',isRefreshing:false,Liked:false,ImageHeight:200,
            SimilarNews:[], LocX: null,score:0, LocY: null, open: false, item: null,Rating:false,Comments:null,InitTab:'Comments'

        }
        this.isRefreshing=false
        this.ShowMenu = this.ShowMenu.bind(this)
        this.CloseMenu = this.CloseMenu.bind(this)
        this.ShowRating=this.ShowRating.bind(this)
        this.CloseRating=this.CloseRating.bind(this)
    }
    /*componentWillReceiveProps() {
     // this.GetDataFromServer()
     this.refs.FlatList.scrollToOffset(true, 0)
     this.refs.ScrollView.scrollTo({x: 0, y: 0, animated: true})
     }*/
    componentWillMount() {

        if (this.props.navigation.state.params.score!=null || this.props.navigation.state.params.score!=undefined)
        {
            this.setState({score:this.props.navigation.state.params.score})

        }
        if (this.props.navigation.state.params.Liked!=null || this.props.navigation.state.params.Liked!=undefined)
        {
            this.setState({Liked:this.props.navigation.state.params.Liked})

        }
        this.props.navigation.addListener('willFocus',
            () => {
                this.GetNightMode()
            })
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
                    const item=this.props.navigation.state.params.item
                    const X=this.state.LocX
                    const Y=this.state.LocY
                    const data={
                        index,
                        item,
                        X,
                        Y
                    }
                    this.ShowMenu(data)
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
                    const item=this.props.navigation.state.params.item
                    const X=this.state.LocX
                    const Y=this.state.LocY
                    const data={
                        item,
                        X,
                        Y
                    }
                    this.listener = EventRegister.addEventListener('SetScore', (data) => {
                        if(this.props.navigation.state.params.item.id==data.id)
                        {
                            this.setState({score: data.score})
                        }
                        this.GetEmojiIcon()
                        EventRegister.removeEventListener(this.listener)

                    })
                    this.ShowRating(data)
                }
            });
    }
    componentDidMount() {
        this.GetEmojiIcon()
        this.GetDataFromServer()
        this.GetNightMode()
        this.GetComments()
    }
    async GetComments(){

        var CommentAddress=global.ApiAddress+'/comment?news_id='+ this.props.navigation.state.params.item.id
        var NetWorkResponse = true
        NetInfo.getConnectionInfo().then((ConnectionInfo) => {
            if (ConnectionInfo.type == 'none') {
                NetWorkResponse = false
            }
            else {
                NetWorkResponse = true
            }
        });
        if(NetWorkResponse==true) {
            let response = await fetch(CommentAddress, {
                method: 'GET',
                headers: {'x-token': this.props.navigation.state.params.token},
            });
            let Data = await response.json()
            if(Data.data.status=='fail' ) {}
            else if(Data.data.status==undefined)
                this.setState({Comments: Data.data})
        }
        //this.setState({isRefreshing:false})
    }
    async Like(id) {
        if(!this.state.Liked){
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
                    headers: {'x-token':this.props.navigation.state.params.token},
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
                Toast.showWithGravity('خطا در ارتباط با سرور، انیترنت دستگاه خود را بررسی نمایید',Toast.LONG,Toast.CENTER)
            }
        }
        else{   Toast.showWithGravity('شما قبلا لایک کرده اید',Toast.LONG,Toast.CENTER)}

    }
    async GetDataFromServer() {
        try{
            let Address = global.ApiAddress + '/news?page=1';
            var NetWorkResponse = true
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type == 'none') {
                    NetWorkResponse = false

                }
                else {
                    NetWorkResponse = true
                }
            });
            if(NetWorkResponse==true){
                let response=await fetch(Address,{
                    method: 'GET',
                    headers: {},
                });
                let Data=await response.json();
                if(Data.data!=undefined)
                    if(Data.data.status!='fail' && Data.data.message!='Unauthorized') this.setState({SimilarNews:Data.data})
            }
        } //end try
        catch(error){

        }
    }
   async SetView(){
        try{
            let Address = global.ApiAddress + '/news/view?id='+this.props.navigation.state.params.item.id;
            var NetWorkResponse = true
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type == 'none') {
                    NetWorkResponse = false

                }
                else {
                    NetWorkResponse = true
                }
            });
            if(NetWorkResponse==true){
                let response=await fetch(Address,{
                    method: 'GET',
                    headers: {},
                });
                let Data=await response.json();
                if(Data.data.status=='success'){

                }
                else if(Data.data.status=='fail'){

                }
            }
        } //end try
        catch(error){

        }
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
    ShowMenu(data) {
        this.setState({item: data.item})
        this.setState({LocX: data.X})
        this.setState({LocY: data.Y})
        this.setState({open: true})
    }
    CloseMenu() {
        this.setState({open: false})
    }
    ShowRating(data){
        this.setState({item: data.item})
        this.setState({LocX: data.X})
        this.setState({LocY: data.Y})
        this.setState({Rating:true})
    }
    CloseRating(){
        this.setState({Rating:false})
    }
    renderHeader() {
        const HeadVisible = this.state.scrollY.interpolate({
            inputRange: [0, global.HEADER_SCROLL_DISTANCE],
            outputRange: ['rgba(0,0,0,.1)', global.HeaderColor],
            extrapolate: 'clamp',
        })
        return (
            <Animated.View style={[styles.Header, {backgroundColor: HeadVisible}]}>
                <View style={styles.RightContainer}>
                    <TouchableOpacity activeOpacity={.6} onPress={() => this.props.navigation.openDrawer()}>
                        <Image style={styles.DrawerIcon} source={require('.././images/DrawerIcon.png')}/>
                    </TouchableOpacity>

                </View>
                <View style={styles.LeftContainer}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate(this.props.navigation.state.params.RouteName)} activeOpacity={.6}>
                        <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                    </TouchableOpacity>

                </View>

            </Animated.View>
        )
    }
    renderFooter(){
        const {item} = this.props.navigation.state.params;
        const {NightMode,ShowMenu}=this.props;
        return(
            <View  style={this.state.NightMode ? styles.DarkFooter : styles.LightFooter}>

                {item.likes!=null?<View style={[styles.Status,{backgroundColor:this.state.NightMode?global.Gray8:global.White2}]}>
                    <Text style={this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {this.state.Liked?item.likes+1:item.likes}
                    </Text>
                    <TouchableOpacity onPress={()=>this.Like(this.props.navigation.state.params.item.id)} style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                        <Image style={styles.StatusImg}
                               source={this.state.Liked?require('.././images/Liked.png'):(this.state.NightMode?require('.././images/LightLike.png'):require('.././images/DarkLike.png'))}/>
                    </TouchableOpacity>
                </View>:null
                }
                {item.comments!=null?<View style={[styles.Status,{backgroundColor:this.state.NightMode?global.Gray8:global.White2}]}>
                    <Text style={this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {item.comments}
                    </Text>
                    <View style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                        <Image style={styles.StatusImg}
                               source={this.state.NightMode?require('.././images/LightComments.png'):require('.././images/DarkComments.png')}/>
                    </View>
                </View>:null
                }
                {item.views!=null?
                    <View style={[styles.Status,{borderColor:this.state.NightMode?global.Gray5:global.Gray6},]}>
                        <Text style={this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                            {item.views}
                        </Text>
                        <Image style={styles.StatusImg}
                               source={this.state.NightMode?require('.././images/LightView.png'):require('.././images/DarkView.png')}/>
                    </View>:null
                }
                <View {...this.RateResponder.panHandlers} style={[styles.Status,{backgroundColor:this.state.NightMode?global.Gray8:global.White2}]}>
                    {
                        this.state.score==0?
                            <TouchableOpacity  >
                                <Image style={styles.StatusImg}
                                       source={this.state.NightMode?require('.././images/LightClick.png'):require('.././images/DarkClick.png')}/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={()=>this.Like(this.props.navigation.state.params.item.id)} style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                                <Image style={styles.StatusImg}
                                       source={this.state.EmojiIcon}/>
                            </TouchableOpacity>
                    }

                </View>
                <View {...this.MenuResponder.panHandlers} style={[styles.Status,{backgroundColor:this.state.NightMode?global.Gray8:global.White2}]}>
                    <TouchableOpacity>
                        <Image style={styles.StatusImg}
                               source={this.state.NightMode?require('.././images/LightMenu.png'):require('.././images/DarkMenu.png')}/>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
    ShowTabs(){
        if(this.state.InitTab=='RelatedNews')
        {
            return(
                <View style={{width:'100%',flexDirection:'column'}}>
                    <View style={styles.TabContainer}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>this.setState({InitTab:'Comments'})} style={styles.TabBtn}>
                            <Text style={styles.TabText}>نظــرات</Text>
                        </TouchableOpacity>
                        <View style={[styles.TabBtn,{borderBottomWidth:4}]}>
                            <Text style={styles.TabText}>اخبار مشابه</Text>
                        </View>
                    </View>
                    {this.showSimilarNews()}
                </View>
            )
        }
        return(
            <View style={{width:'100%',flexDirection:'column'}}>
                <View style={styles.TabContainer}>
                    <View style={[styles.TabBtn,{borderBottomWidth:4}]}>
                        <Text style={styles.TabText}>نظــرات</Text>
                    </View>
                    <TouchableOpacity activeOpacity={.5} onPress={()=>this.setState({InitTab:'RelatedNews'})} style={styles.TabBtn}>
                        <Text style={styles.TabText}>اخبار مشابه</Text>
                    </TouchableOpacity>

                </View>
                {this.ShowComments()}
            </View>

        )
    }
    showSimilarNews() {
        return (
            <FlatList ref="FlatList"
                      data={this.state.SimilarNews}
                      scrollEventThrottle={16}
                      ListHeaderComponent={() => {
                          return (
                              <View style={styles.SimilarNews}>
                                  <Text style={styles.SimilarNewsTitle}>اخبار مشابه</Text>
                              </View>
                          )
                      }}
                      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                      renderItem={({item, index}) => {
                          return (
                              <NewsItem token={this.props.navigation.state.params.token} ShowRating={this.ShowRating} RouteName={this.props.navigation.state.params.RouteName} index={index} Open={this.state.open} ShowMenu={this.ShowMenu}
                                        navigation={this.props.navigation} NightMode={this.state.NightMode}
                                        item={item}/>
                          )
                      }}

            />

            //  <News data={item}/>
        );
    } // end show data
    ShowComments() {
        return (
            <FlatList style={{paddingBottom:60,marginBottom: 20}}
                      data={this.state.Comments}
                      scrollEventThrottle={16}
                      ListHeaderComponent={() => {
                          return (
                              <View style={styles.SimilarNews}>
                                  <Text style={styles.SimilarNewsTitle}>نظرات کاربران</Text>
                              </View>:null
                          )
                      }}
                      ListEmptyComponent={()=>{
                          return(
                              <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                                  <Text style={[styles.EmptyCommentTitle,{color:this.state.NightMode?'#F5F5F5':'#212121'}]}>نظرتان را بگویید</Text>
                              </View>
                          )
                      }}
                      renderItem={({item}) => {
                          return (
                              <View style={[styles.CommentBox,{backgroundColor:this.state.NightMode?global.Gray2:'#F5F5F5'}]}>
                                  <Text
                                      style={[styles.CommentTitle, {color: this.state.NightMode ? '#F5F5F5' : '#212121'}]}>{item.name}</Text>

                                  <Text style={styles.Seprator}> </Text>
                                  <Text
                                      style={[styles.CommentTitle, {color: this.state.NightMode ? '#F5F5F5' : '#212121'}]}>{item.text}</Text>
                                  <Text style={styles.Seprator}> </Text>
                                  <Text
                                      style={[styles.CommentTitle, {color: this.state.NightMode ? '#F5F5F5' : '#212121'}]}>{item.publish_time_string}</Text>
                              </View>

                          )
                      }
                      }
            />
            //  <News data={item}/>
        );
    } // end show data
    GetNightMode() {
        AsyncStorage.getItem('NightMode', (err, result) => {

            if (result !== null) {

                if (result === 'true')
                    this.setState({NightMode: true})
                else this.setState({NightMode: false})
            }
            else this.setState({NightMode: false});

        });

    }
    render() {
        const {item} = this.props.navigation.state.params;
        if (item.style === 4) {
            var images = []
            for (let i = 0; i < item.image_gallery.length - 1; i++) {
                let image = {'imagePath': item.image_gallery[i]}
                images.push(image)
            }
            return (
                <View style={{height: '100%', width: '100%'}}>
                    {this.renderHeader()}
                    <ScrollView onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                                ref="ScrollView"
                                style={{flex: 1, backgroundColor: this.state.NightMode ? '#212121' : '#E0E0E0'}}

                    >
                        <SwipeableParallaxCarousel
                            data={images}
                            navigationType={'dots'}
                            navigationColor='#FFFFFF'
                            navigation='true'
                            height={250}
                        />
                        <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer]}>

                            <Text style={this.state.NightMode ? styles.DarkTitle : styles.LightTitle}>
                                {item.title}
                            </Text>
                            <Text style={this.state.NightMode ? styles.DarkAgency : styles.LightAgency}>
                                {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                            </Text>
                            <Text style={this.state.NightMode ? styles.DarkSummary : styles.LightSummary}>
                                {item.body}
                            </Text>
                            {this.renderFooter()}

                        </View>
                        {this.ShowTabs()}
                    </ScrollView>

                    <TouchableOpacity  activeOpacity={.8} style={styles.CommentBtn}
                                       onPress={() => this.props.navigation.push('SendComment',{token:this.props.navigation.state.params.token,
                                           item:this.props.navigation.state.params.item})}>
                        <Image style={styles.CommentIcon} source={require('.././images/CommentBtn.png')}/>
                    </TouchableOpacity>
                    {
                        this.state.open ?
                            <TouchableOpacity onPress={() => this.setState({open: false})} style={styles.CloseMenu}>
                                <ContextMenu  item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY}
                                              ShowRating={this.ShowRating} CloseMenu={this.CloseMenu}
                                              NightMode={this.state.NightMode}/>
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.Rating?
                            <TouchableOpacity onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                                <Rating token={this.props.navigation.state.params.token} score={this.state.score} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                            </TouchableOpacity>:null
                    }
                </View>
            )
        }
        if (item.style === 5) {
            return (
                <View style={{height: '100%', width: '100%'}}>
                    {this.renderHeader()}
                    <ScrollView onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                                ref="ScrollView"
                                style={{flex: 1, backgroundColor: this.state.NightMode ? '#212121' : '#E0E0E0'}}
                    >
                        <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer]}>
                            <View style={{width: '100%', minHeight: 200}}>
                                <VideoPlayer ref={(ref) => {
                                    this.player = ref
                                }} resizeMode={'stretch'}
                                             source={{uri: item.video_url}} style={styles.Video}
                                />
                            </View>

                            <Text style={this.state.NightMode ? styles.DarkTitle : styles.LightTitle}>
                                {item.title}
                            </Text>
                            <Text style={this.state.NightMode ? styles.DarkAgency : styles.LightAgency}>
                                {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                            </Text>
                            <Text style={this.state.NightMode ? styles.DarkSummary : styles.LightSummary}>
                                {item.body}
                            </Text>
                            {this.renderFooter()}
                        </View>
                        {this.ShowTabs()}
                    </ScrollView>

                    <TouchableOpacity activeOpacity={.8} style={styles.CommentBtn}
                                      onPress={() => this.props.navigation.navigate('SendComment',{token:this.props.navigation.state.params.token,
                                          item:this.props.navigation.state.params.item })}>
                        <Image style={styles.CommentIcon} source={require('.././images/CommentBtn.png')}/>
                    </TouchableOpacity>
                    {
                        this.state.open ?
                            <TouchableOpacity onPress={() => this.setState({open: false})} style={styles.CloseMenu}>
                                <ContextMenu item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY}
                                             ShowRating={this.ShowRating} style={{zIndex: 999}} CloseMenu={this.CloseMenu}
                                             NightMode={this.state.NightMode}/>
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.Rating?
                            <TouchableOpacity onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                                <Rating token={this.props.navigation.state.params.token} score={this.state.score} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                            </TouchableOpacity>:null
                    }
                </View>

            )
        }
        if(item.style==6){

            return (
                <View style={{height: '100%', width: '100%'}}>
                    {this.renderHeader()}
                    <ScrollView onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                                ref="ScrollView"
                                style={{flex: 1, backgroundColor: this.state.NightMode ? '#212121' : '#E0E0E0'}}
                    >
                        <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer,{paddingTop:60}]}>
                            <Text style={this.state.NightMode ? styles.DarkTitle : styles.LightTitle}>
                                {item.title}
                            </Text>
                            <Text style={this.state.NightMode ? styles.DarkAgency : styles.LightAgency}>
                                {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                            </Text>
                            <Text style={this.state.NightMode ? styles.DarkSummary : styles.LightSummary}>
                                {item.body}
                            </Text>
                            {this.renderFooter()}
                        </View>
                        {this.ShowTabs()}
                    </ScrollView>

                    <TouchableOpacity activeOpacity={.8} style={styles.CommentBtn}
                                      onPress={() => this.props.navigation.navigate('SendComment',{item:this.props.navigation.state.params.item,token:this.props.navigation.state.params.token
                                           })}>
                        <Image style={styles.CommentIcon} source={require('.././images/CommentBtn.png')}/>
                    </TouchableOpacity>
                    {
                        this.state.open ?
                            <TouchableOpacity onPress={() => this.setState({open: false})} style={styles.CloseMenu}>
                                <ContextMenu item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY}
                                             ShowRating={this.ShowRating} style={{zIndex: 999}} CloseMenu={this.CloseMenu}
                                             NightMode={this.state.NightMode}/>
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.Rating?
                            <TouchableOpacity onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                                <Rating token={this.props.navigation.state.params.token} score={this.state.score} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                            </TouchableOpacity>:null
                    }
                </View>
            )
        }
        return (
            <View
                style={{height: '100%', width: '100%', backgroundColor: this.state.NightMode ? '#E0E0E0' : '#212121'}}>
                {this.renderHeader()}
                <ScrollView onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                            ref="ScrollView"
                            style={{flex: 1, backgroundColor: this.state.NightMode ? '#212121' : '#E0E0E0'}}
                >

                    <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer]}>

                        {
                            item.image_url!==null?
                                <Image
                                    source={{uri:item.image_url}}
                                    style={styles.Style2Pic}
                                    resizeMode={item.image_url !== null ? 'stretch' : 'contain'} /*source={{uri: item.image_url}}*/
                                />:null
                        }
                        <Text style={this.state.NightMode ? styles.DarkTitle : styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={this.state.NightMode ? styles.DarkAgency : styles.LightAgency}>
                            {item.agency==null?null:item.agency.name}{item.publish_time_string!=null && item.agency!=null?'-':''}{item.publish_time_string}{item.category!=null &&(item.publish_time_string!=null || item.item.agency!=null)?'-':''}{item.category}
                        </Text>
                        <Text style={this.state.NightMode ? styles.DarkSummary : styles.LightSummary}>
                            {item.body}
                        </Text>
                        {this.renderFooter()}
                    </View>
                    {this.ShowTabs()}
                </ScrollView>

                <TouchableOpacity activeOpacity={.8} style={styles.CommentBtn}
                                  onPress={() => this.props.navigation.navigate('SendComment',{token:this.props.navigation.state.params.token,
                                      item:this.props.navigation.state.params.item })}>
                    <Image style={styles.CommentIcon} source={require('.././images/CommentBtn.png')}/>
                </TouchableOpacity>
                {
                    this.state.open ?
                        <TouchableOpacity style={styles.CloseMenu} onPress={() => this.setState({open: false})}>
                            <ContextMenu item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY}
                                         ShowRating={this.ShowRating} style={{zIndex: 999}} CloseMenu={this.CloseMenu}
                                         NightMode={this.state.NightMode}/>
                        </TouchableOpacity> : null
                }
                {
                    this.state.Rating?
                        <TouchableOpacity onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                            <Rating token={this.props.navigation.state.params.token} score={this.state.score} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                        </TouchableOpacity>:null
                }
            </View>
        )
    }
}
const styles=StyleSheet.create(
    {
        DarkContainer:{
            alignSelf:'center',
            width:'98%',
            backgroundColor:'#414141',
        },
        LightContainer:{
            alignSelf:'center',
            width:'98%',
            backgroundColor:'#F4F4F4',
        },
        TabContainer:{
            marginTop:5,
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            width:'100%',
            height:40,
            backgroundColor:global.HeaderColor,
        },
        TabBtn:{
            flex:.5,
            alignItems:'center',
            justifyContent:'center',
            borderColor:global.White1
        },
        TabText:{
            fontFamily:'IRANSansMobile',
            fontSize:global.fontSize11,
            color:global.White1
        },
        CommentBox:{
            borderRadius:3,
            margin:5,
            alignSelf:'center',
            width:'90%',
            elevation:5
        },
        Seprator:{
            backgroundColor:'rgba(200, 200, 200,.7)',
            alignSelf:'center',
            height:1,
            width:'98%',
        },
        EmptyCommentTitle:{
            fontFamily:'IRANSansMobile',
            fontSize:global.fontSize12,
        },
        CommentTitle:{
            padding:6,
            fontFamily:'IRANSansMobile',
            fontSize:global.fontSize12,
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
            fontSize:global.fontSize14,
            color:'#F5F5F5',
            textAlignVertical:'center'
        },
        LightTitle1:{
            width:'40%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize14,
            color:global.Gray2,
            textAlignVertical:'center'
        },
        DarkTitle:{
            flexWrap:'wrap',
            marginRight:'5%',
            marginLeft:'5%',
            paddingTop:10,
            fontFamily:global.fontFamily,
            fontSize:global.fontSize16,
            color:global.White2,
            textAlignVertical:'center'
        },
        LightTitle:{
            paddingTop:10,
            marginRight:'5%',
            marginLeft:'5%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize16,
            color:global.Red1,
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
            color:global.Gray1,
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
            color:global.Red1,
        },
        LightAgency:{
            paddingTop:10,
            marginRight:'5%',
            marginLeft:'5%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize13,
            color:global.Gray5,
        },
        Title3:{
            left:I18nManager.isRTL?5:null,
            right:I18nManager.isRTL?null:5,
            backgroundColor:'rgba(66, 66, 66,1)',
            opacity:.7,
            top:40,
            position:'absolute',
            flexWrap:'wrap',
            paddingRight:'5%',paddingLeft:'5%',
            //marginRight:'5%',
            //marginLeft:'5%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize14,
            color:'#FFFFFF',
            textAlignVertical:'center'
        },
        Summary3:{
            left:I18nManager.isRTL?5:null,
            right:I18nManager.isRTL?null:5,
            backgroundColor:'rgba(66, 66, 66,1)',
            opacity:.7,
            bottom:50,
            marginRight:'5%',
            marginLeft:'5%',
            position:'absolute',
            marginTop:5,
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#FFFFFF',
        },
        DarkCategory:{
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
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
            alignSelf:'center',
            resizeMode:'stretch',
            minHeight:200,
            width:'100%',
        },
        Style3Pic:{
            alignSelf:'center',
            resizeMode:'stretch',
            minHeight:200,
            width:'100%',
        },
        Video:{
            alignSelf:'center',
            minHeight:200,
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
            height:25,
            width:25,
            resizeMode:'stretch'
        },
        DarkNewsBox:{
            borderRadius:6,
            minHeight:180,
            padding:5,
            alignSelf:'center',
            marginTop:5,
            width:'96%',
            elevation:1,
            backgroundColor:global.Gray2,
            flexDirection:I18nManager.isRTL?'row-reverse':'row'
        },
        LightNewsBox:{
            borderRadius:6,
            minHeight:180,
            padding:5,
            alignSelf:'center',
            marginTop:5,
            width:'96%',
            elevation:1,
            backgroundColor:'#F4F4F4',
            flexDirection:I18nManager.isRTL?'row-reverse':'row'
        },
        SimImage:{
            borderRadius:5,
            resizeMode:'stretch',
            height:150,
            width:150,
            margin:10,
        },
        SimilarNews:{
            margin:5,
            backgroundColor:'#d94301',
            alignItems:'center',
            justifyContent:'center',
            width:100,
            padding:5,
            elevation:10,
            borderRadius:3,
            alignSelf:I18nManager.isRTL?'flex-start':'flex-end'
        },
        SimilarNewsTitle:{
            fontSize:global.fontSize12,
            fontFamily:global.fontFamily,
            color:'#F5F5F5'

        },
        CloseMenu:{
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'transparent',
            width:'100%',
            height:'100%',
            position:'absolute'},
        CommentBtn:{
            alignItems:'center',
            justifyContent:'center',
            bottom:25,
            right:I18nManager.isRTL?null:25,
            left:I18nManager.isRTL?25:null,
            position:'absolute',
            width:50,height:50,
            borderWidth:2,
            borderColor:'#F5F5F5',
            borderRadius:50,
            backgroundColor:'#ce2222',//'#FF001C'
            elevation:10
        },
        CommentIcon:{
            marginRight:5,
            height:35,
            width:35,
            resizeMode:'stretch'
        },
        Header:{
            top:0,
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
            marginLeft:5,marginRight:5,
            height:20,
            width:20,
            resizeMode:'stretch'
        },
        CloseMenu:{
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'transparent',
            width:'100%',
            height:'100%',
            position:'absolute'}
    },

);
