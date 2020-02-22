import React from 'react';
import {
    View, Animated, Text, NetInfo, TouchableOpacity,findNodeHandle, StyleSheet, FlatList, I18nManager,
    Image, AsyncStorage, Platform,ActivityIndicator,Dimensions
} from 'react-native';
import NewsItem from "./NewsItem";
import './global';
import Toast from './SimpleToast';
import ContextMenu from "./ContextMenu";
import Rating from "./Rating";
import EventListener, {EventRegister} from 'react-native-event-listeners'
export default class HomeScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            scrollY: new Animated.Value(0),open:false,Rating:false,page:1,GetData:false,
            NightMode:false,NetworkErr:false,Response:true,Registered:true,LocX:null,LocY:null,Item_Lenght:9,
            News:[],item:null,token:'',loading:true,FooterLoading:false
        }
        this.isRefreshing=false
        this.Logout=this.Logout.bind(this)
        this.ShowMenu=this.ShowMenu.bind(this)
        this.CloseMenu=this.CloseMenu.bind(this)
        this.ShowRating=this.ShowRating.bind(this)
        this.CloseRating=this.CloseRating.bind(this)
        this.handleLoadMore=this.handleLoadMore.bind(this)
        this.Refresh=this.Refresh.bind(this)

    }
    componentWillMount(){

    }
    componentDidMount(){
        this.GetNightMode()
        this.GetToken()
        setTimeout(()=>this.GetDataFromServer(),1500)
        EventRegister.addEventListener('GetData',()=>{

            this.GetToken()
            setTimeout(()=>this.GetDataFromServer(),1500)
        })
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode();
                this.GetToken();
            })
    }
    Logout(){
        let LogoutAddress=global.ApiAddress+'/user/logout';

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type == 'none') {
                Toast.showWithGravity('برقراری ارتباط با سرور ممکن نیست\n اینترنت تلفن همراه خود را بررسی نمایید', Toast.LONG, Toast.CENTER)
            }
            else {

                fetch(LogoutAddress, {
                    method: 'POST',
                    headers: {'x-token': this.state.token},
                }).then(response => response.json()).then(Data => {

                    if (Data.data.status == 'success') {
                        AsyncStorage.removeItem('token')
                        AsyncStorage.removeItem('UserName')
                        this.setState({token: ''})
                        Toast.showWithGravity('شما با موفقیت از سیستم خارج شدید',Toast.SHORT,Toast.CENTER)
                    }

                    if(Data.data.message=='Unauthorized or no token found'){
                        AsyncStorage.removeItem('token')
                        AsyncStorage.removeItem('UserName')
                        this.setState({token: ''})
                    }
                }).catch((error) => {
                    Toast.showWithGravity('برقراری ارتباط با سرور ممکن نیست\n اینترنت تلفن همراه خود را بررسی نمایید', Toast.LONG, Toast.CENTER)

                })

            }

        })
    }
    async GetDataFromServer() {

        try{
            this.setState({Registered: true})
            if(this.state.News.length==0) {
                this.setState({loading: true})
                this.setState({NetworkErr: false});
                this.setState({Response: true})


            }

            let Address = global.ApiAddress + '/news?page='+this.state.page;
            var NetWorkResponse = true
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type == 'none') {
                    this.setState({loading: false})
                    if(this.state.News.length==0) {
                        this.setState({NetworkErr: true});
                    }
                    NetWorkResponse = false
                }
                else {
                    NetWorkResponse = true
                }
            });

            if(NetWorkResponse==true){
                let response=await fetch(Address,{
                    method: 'GET',
                    headers: {'x-token':this.state.token},
                });
                let Data=response.status==200?await response.json():null

                if(Data!=null)
                {
                    if(Data.data!=undefined)
                        if(Data.data.status=='fail' && Data.data.message=='Unauthorized')
                        {
                            this.setState({loading:false})
                            this.setState({NetworkErr:false})
                            this.setState({Response:true})
                            this.setState({Registered:false})
                        }
                        else   this.setState({News:this.state.page==1?Data.data:[...this.state.News,...Data.data]})
                    this.setState({loading:false})
                    this.setState({Response:true})
                    this.setState({NetworkErr:false})

                }
                /*  if(Data.data.status=='fail' && Data.data.message=='Unauthorized'){
                      this.setState({loading:false})
                      this.setState({NetworkErr:false})
                      this.setState({Response:true})
                      this.setState({Registered:false})
                  }*/
                else{
                    this.setState({loading:false})
                    this.setState({NetworkErr:false})
                    this.setState({loading:false})
                    this.setState({NetworkErr:false})
                }
            } // if networkresponse true
            else
            {
                this.setState({NetworkErr:false})
                this.setState({loading:false})
                if(this.state.News.length==0 ){
                    this.setState({Response:false})
                }
            }
        } //end try
        catch(error){
            if(error.toString()!='TypeError: Object is null or undefined' && error.toString()!='TypeError: Cannot read property \'data\' of undefined'
                && error.toString()!='TypeError: Cannot convert undefined or null to object'){
                this.setState({NetworkErr: false})
                this.setState({loading: false})
                if(this.state.News.length==0) {
                    this.setState({Response: false})
                }
            }
        }

    }
    GetGuestToken(){
        let LogoutAddress=global.ApiAddress+'/user/logout';
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if (connectionInfo.type == 'none') {
                Toast.showWithGravity('برقراری ارتباط با سرور ممکن نیست\n اینترنت تلفن همراه خود را بررسی نمایید', Toast.LONG, Toast.CENTER)
            }
            else {
                fetch(LogoutAddress, {
                    method: 'POST',
                    headers: {},
                }).then(response => response.json()).then(Data => {
                    if (Data.data.status == 'success') {
                        AsyncStorage.setItem('token',Data.data.token)
                        this.setState({token: Data.data.token})
                    }
                }).catch((error) => {
                    Toast.showWithGravity('برقراری ارتباط با سرور ممکن نیست\n اینترنت تلفن همراه خود را بررسی نمایید', Toast.LONG, Toast.CENTER)

                })
            }
        })
    }
    GetNightMode(){
        AsyncStorage.getItem('NightMode', (err, result) => {
            result=result==='true'?true:false
            if(result!=this.state.NightMode){
                this.setState({NightMode: result})
            }
        });
    }
    GetToken(){
        AsyncStorage.getItem('token', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({token: result})
            }
        });
    }
    handleLoadMore(){
        this.setState({page:this.state.page+1},()=>{
            this.GetDataFromServer()
        })
    }
    Refresh(){
        this.setState({page:1},()=>{this.GetDataFromServer()})
        //  this.GetNightMode();
    }
    RenderItem({item}){
        return (
            <NewsItem token={this.state.token} RouteName={this.props.navigation.state.routeName} Open={this.state.open} ShowMenu={this.ShowMenu} ShowRating={this.ShowRating}
                      navigation={this.props.navigation} NightMode={this.state.NightMode} item={item}/>
        )
    }
    ShowMenu(data){
        this.setState({item:data.item})
        this.setState({LocX:data.X})
        this.setState({LocY:data.Y})
        this.setState({index:data.index})
        this.setState({open:true})

    }
    CloseMenu(){
        this.setState({open:false})
    }
    ShowRating(data){
        this.setState({item:data.item})
        this.setState({LocX:data.X})
        this.setState({LocY:data.Y})
        this.setState({Rating:true})
    }
    CloseRating(){
        this.setState({Rating:false})
    }
    renderHeader(){
        const HeadVisible=this.state.scrollY.interpolate({
            inputRange: [0,global.HEADER_SCROLL_DISTANCE/2],
            outputRange: ['rgba(40,53,147 ,.2)',global.HeaderColor],
            extrapolate: 'clamp',
        })
        return(
            <Animated.View style={[styles.Header,{backgroundColor:HeadVisible}]}>
                <View style={styles.RightContainer}>
                    <TouchableOpacity activeOpacity={.6} onPress={()=>this.props.navigation.openDrawer()}>
                        <Image style={styles.DrawerIcon} source={require('.././images/DrawerIcon.png')}/>
                    </TouchableOpacity>

                </View>
                <View style={styles.LeftContainer}>
                    {this.state.token==''?
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Profile', {RouteName: this.props.navigation.state.routeName})}
                            activeOpacity={.6}>
                            <Image style={styles.MenuIcon} source={require('.././images//LightUser.png')}/>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            onPress={() =>this.Logout()}
                            activeOpacity={.6}>
                            <Image style={styles.LogoutIcon} source={require('.././images//Logout.png')}/>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity activeOpacity={.6} onPress={()=>this.props.navigation.navigate('Search',{token:this.state.token})}>
                        <Image style={styles.MenuIcon} source={require('.././images/LightSearch.png')}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('BookmarkedNews',{token:this.state.token})} activeOpacity={.6}>
                        <Image style={styles.MenuIcon} source={require('.././images/LightBookmarked.png')}/>
                    </TouchableOpacity>

                </View>

            </Animated.View>
        )
    }
    render(){
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, global.HEADER_SCROLL_DISTANCE],
            outputRange: [global.HEADER_MAX_HEIGHT, global.HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const MarginTop=this.state.scrollY.interpolate({
            inputRange: [0, global.HEADER_SCROLL_DISTANCE],
            outputRange: [120, global.HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });

        if(this.state.NetworkErr){
            return(
                <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                    {this.renderHeader()}
                    <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >خطا در اتصال،</Text>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >اینترنت دستگاه خود را</Text>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >بررسی نمــایید</Text>
                        <TouchableOpacity onPress={()=>this.GetDataFromServer()}
                                          activeOpacity={.7} style={styles.ErrButton} >
                            <Text style={[styles.DarkErrText,{textAlign:'center'}]}> تلاش مجدد</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        if(!this.state.Response){
            return   (
                <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                    {this.renderHeader()}
                    <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >برقراری ارتباط </Text>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >با سرور ممکن نیست</Text>
                        <TouchableOpacity onPress={()=>this.GetDataFromServer()}
                                          activeOpacity={.7} style={styles.ErrButton} >
                            <Text style={[styles.DarkErrText,{textAlign:'center'}]}> تلاش مجدد</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        if(this.state.Registered!=true){
            //this.props.navigation.navigate('Profile', {RouteName: this.props.navigation.state.routeName})
            return   (
                <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                    {this.renderHeader()}
                    <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >برای مشاهده مطالب باید عضو شوید </Text>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >یا وارد حساب کاربری خود شوید</Text>
                        <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} ></Text>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Profile', {RouteName: this.props.navigation.state.routeName})}
                                          activeOpacity={.7} style={styles.ErrButton} >
                            <Text style={[styles.DarkErrText,{textAlign:'center'}]}> ورود</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            );
        }
        return(
            <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                {this.renderHeader()}
                {
                    this.state.loading?<View style={{alignItems:'center',justifyContent:'center',flex:1}}><ActivityIndicator size="large" color="#5500ff" /></View>
                        :
                        <FlatList
                            refreshing={this.isRefreshing}
                            onRefresh={this.Refresh}
                            data={this.state.News}
                            renderItem={(item)=>this.RenderItem(item)}
                            keyExtractor={(item , index) =>index}
                            onScroll={(Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]))}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={9}
                            scrollEventThrottle={9}
                            onEndReached={()=>this.handleLoadMore()}
                            onEndReachedTreshold={.1}
                        />
                }
                {
                    this.state.open?
                        <TouchableOpacity activeOpacity={.98} onPress={()=>this.setState({open:false})} style={styles.CloseMenu}>
                            <ContextMenu ShowRating={this.ShowRating} item={this.state.item} index={this.state.index} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseMenu} NightMode={this.state.NightMode} />
                        </TouchableOpacity>:null
                }
                {
                    this.state.Rating?
                        <TouchableOpacity activeOpacity={.98} onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                            <Rating token={this.state.token} LOCX={this.state.LocX} item={this.state.item} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                        </TouchableOpacity>:null
                }
            </View>
        )
    }
}//end class

const styles=StyleSheet.create({
    DarkContainer:{
        flex:1,
        backgroundColor:global.DarkContainer,
    },
    LightContainer:{
        flex:1,
        backgroundColor:global.LightContainer,
    },
    DarkErrText:{
        fontFamily:global.fontFamily,
        color:'#F5F5F5',
        fontSize:global.fontSize15,
    },
    LightErrText:{
        fontFamily:global.fontFamily,
        color:'#212121',
        fontSize:global.fontSize15,
    },
    ErrButton:{
        width:150,
        marginTop:5,
        backgroundColor:'#CC1111',
        padding:5,
        borderRadius:3,
        justifyContent:'center'
    },
    Header:{
        position:'absolute',
        width:'100%',
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:997
    },
    RightContainer:{
        flexDirection:'row',
        flex:.7,
        justifyContent:I18nManager.isRTL?'flex-start':'flex-end',
        alignItems:'center'
    },
    LeftContainer:{
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        flex:.3,
        justifyContent:'space-around',
        alignItems:'center'
    },
    MenuIcon:{
        margin:10,
        height:15,
        width:16,
        resizeMode:'stretch'
    },
    LogoutIcon:{
        height:15,
        width:20,
        resizeMode:'stretch'
    },
    DrawerIcon:{
        marginLeft:5,marginRight:5,
        height:20,
        width:20,
        resizeMode:'stretch'
    },
    CloseMenu:{
        zIndex:998,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',
        width:'100%',
        height:'100%',
        position:'absolute'
    }

})
