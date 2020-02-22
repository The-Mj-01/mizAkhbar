import React from 'react';
import {
    ActivityIndicator,
    Animated,
    AsyncStorage,
    FlatList,
    I18nManager,
    Image,
    NetInfo,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import NewsItem from './NewsItem';
import ContextMenu from "./ContextMenu";
import Toast from './SimpleToast';
import Rating from './Rating';
import './global';

export default class SearchScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            scrollY: new Animated.Value(0),
            NightMode:false,NetworkErr:false,News:[],NotFound:false,open:false,LocX:null,LocY:null,item:null,Rating:false,Text:'',
            loading:false,token:''
        }
        this.Search=this.Search.bind(this)
        this.ShowMenu=this.ShowMenu.bind(this)
        this.CloseMenu=this.CloseMenu.bind(this)
        this.ShowRating=this.ShowRating.bind(this)
        this.CloseRating=this.CloseRating.bind(this)
    }
    componentDidMount(){
        this.GetToken()
        this.GetNightMode()
        this.props.navigation.addListener('willFocus', ()=>{
            this.GetNightMode()
        })
        // this.CloseDrawer.bind(this)
    }
    GetToken(){
        AsyncStorage.getItem('token', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({token: result})
            }
        });
    }
    ShowMenu(data){
        this.setState({item:data.item})
        this.setState({LocX:data.X})
        this.setState({LocY:data.Y})
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
    ChangeText(text){
        this.setState({Text:text.trim()})
    }
    Search(){
        let Address=global.ApiAddress+'/news?q='+this.state.Text;

        if(this.state.Text==''){
            Toast.showWithGravity('متن جستجو را وارد کنید',Toast.LONG,Toast.CENTER)
        }
        else{
            this.setState({NotFound:false})
            this.setState({loading:true});
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if(connectionInfo.type=='none')
                {
                    Toast.showWithGravity('اینترنت گوشی خود را بررسی کنید',Toast.SHORT,Toast.CENTER)
                }
                else{
                    fetch(Address, {
                        method: 'GET',
                        headers: {'x-token': this.state.token},
                    })
                        .then(response=>response.json())
                        .then((responseJson)=>{
                            if(responseJson!=null)
                            if(responseJson.data!=undefined) {
                                if (responseJson.data.status == 'fail' && responseJson.data.message == 'Unauthorized') {
                                    this.setState({loading: false})
                                    Toast.showWithGravity('برای مشاهده مطالب باید عضو شوید با وارد حساب کاربری خود شوید', Toast.SHORT, Toast.CENTER)
                                }
                                else {
                                    if(responseJson.length!=0)
                                    {
                                        this.setState({News:responseJson.data})
                                        this.setState({loading:false})
                                        this.setState({NotFound:false})
                                    }
                                    else{
                                        this.setState({loading:false})
                                        this.setState({NotFound:true})
                                    }
                                }
                            }
                            else if(responseJson.length!=0)
                            {
                                this.setState({News:responseJson.data})
                                this.setState({loading:false})
                                this.setState({NotFound:false})
                            }
                            else{
                                this.setState({loading:false})
                                this.setState({NotFound:true})
                            }
                        }).catch((error)=>{
                        //   if(error.toString()!='TypeError: Cannot read property \'data\' of undefined')
                        this.setState({loading:false})
                        Toast.showWithGravity('اشکال در برقراری ارتباط',Toast.SHORT,Toast.CENTER)
                    });
                }
            });
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
    render(){
        const HeadVisible=this.state.scrollY.interpolate({
            inputRange: [0,global.HEADER_SCROLL_DISTANCE],
            outputRange: ['rgba(0,0,0,.1)',global.HeaderColor],
            extrapolate: 'clamp',
        })

        return(
            <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                <StatusBar hidden />
                <Animated.View style={[styles.Header,{backgroundColor:HeadVisible}]}>
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
                </Animated.View>
                <View style={this.state.NightMode?styles.DarkSearchContainer:styles.LightSearchContainer}>
                    <TextInput onChangeText={this.ChangeText.bind(this)} style={this.state.NightMode?styles.DarkTextInput:styles.LightTextInput} underlineColorAndroid={'transparent'}
                               placeholder={'متن جستجو را وارد کن...'} placeholderTextColor={global.Gray2}
                    />
                    <TouchableOpacity onPress={()=>this.Search()} activeOpacity={.7}>
                        <Image style={styles.MenuIcon}
                               source={this.state.NightMode?require('.././images/LightSearch.png'):require('.././images/DarkSearch.png')}
                        />
                    </TouchableOpacity>
                </View>
                {
                    this.state.loading?
                        <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                            <ActivityIndicator size={'large'} color='#5544FF' />
                        </View>
                        :(this.state.NotFound?
                        <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                            <Text style={this.state.NightMode?styles.DarkText:styles.LightText}>مطلبی یافت نشد</Text>
                        </View>
                        :<FlatList style={{marginBottom:20}}
                                   data={this.state.News}
                                   scrollEventThrottle={16}
                                   onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                                   renderItem={({item,index})=>{
                                       return(
                                           <NewsItem RouteName={this.props.navigation.state.routeName} token={this.props.navigation.state.params.token} ShowRating={this.ShowRating} Open={this.state.open} ShowMenu={this.ShowMenu} navigation={this.props.navigation} NightMode={this.state.NightMode} item={item}/>
                                       )
                                   }}
                        />)
                }
                {
                    this.state.open?
                        <TouchableOpacity style={styles.CloseMenu} onPress={()=>this.setState({open:false})} >
                            <ContextMenu ShowRating={this.ShowRating} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseMenu} NightMode={this.state.NightMode} />
                        </TouchableOpacity>:null
                }
                {
                    this.state.Rating?
                        <TouchableOpacity onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                            <Rating token={this.props.navigation.state.params.token} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:1000}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                        </TouchableOpacity>:null
                }

            </View>
        );

    }

}//end class

const styles=StyleSheet.create({
    DarkContainer:
        {
            backgroundColor:global.DarkContainer,
            flex:1,
            // alignItems:'center',
            // justifyContent:'center'
        },
    LightContainer:
        {
            backgroundColor:global.LightContainer,
            flex:1,
            //  alignItems:'center',
            // justifyContent:'center'
        },
    LightSearchContainer:
        {
            alignItems:'center',
            padding:7,
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            borderRadius:3,
            marginTop:50,marginBottom:5,marginRight:5,marginLeft:5,
            alignSelf:'center',
            backgroundColor:global.White2,
            elevation:5,
            width:'95%',

        },
    DarkSearchContainer:
        {
            alignItems:'center',
            padding:7,
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            borderRadius:3,
            marginTop:50,marginBottom:5,marginRight:5,marginLeft:5,
            alignSelf:'center',
            backgroundColor:global.Gray8,
            elevation:5,
            width:'95%',
        },
    DarkTextInput:{
        fontSize:global.fontSize13,
        fontFamily:global.fontFamily,
        height:40,
        textAlign:'right',
        flex:1,
        backgroundColor:global.White2,
        color:global.Gray2
    },
    LightTextInput:{
        fontSize:global.fontSize13,
        fontFamily:global.fontFamily,
        height:40,
        textAlign:'right',
        flex:1,
        backgroundColor:global.Gray4,
        color:global.Gray2
    },
    LightHeader:{
        padding:3,
        fontSize:global.fontSize16,
        fontFamily:global.fontFamily,
        color:global.Gray8,
    },
    DarkHeader:{
        padding:3,
        fontSize:global.fontSize16,
        fontFamily:global.fontFamily,
        color:global.White2,
    },
    LightText:{
        flex:.9,
        padding:3,
        fontSize:global.fontSize14,
        fontFamily:global.fontFamily,
        color:global.Gray8,
    },
    DarkText:{
        flex:.9,
        padding:3,
        fontSize:global.fontSize14,
        fontFamily:global.fontFamily,
        color:global.White2,
    },
    LightNote:{
        padding:3,
        fontSize:12,
        fontFamily:global.fontFamily,
        color:global.Gray9,
    },
    DarkNote:{
        padding:3,
        fontSize:12,
        fontFamily:global.fontFamily,
        color:global.White2,
    },
    Header:{
        top:0,
        position:'absolute',
        width:'100%',
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:999,

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
    DarkErrText:{
        fontFamily:global.fontFamily,
        color:global.White2,
        fontSize:global.fontSize15,
    },
    LightErrText:{
        fontFamily:global.fontFamily,
        color:global.DarkContainer,
        fontSize:global.fontSize15,
    },
    ErrButton:{
        width:150,
        marginTop:5,
        backgroundColor:global.Red2,
        padding:5,
        borderRadius:3,
        justifyContent:'center'
    },
    CloseMenu:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',
        width:'100%',
        height:'100%',
        position:'absolute'}


});