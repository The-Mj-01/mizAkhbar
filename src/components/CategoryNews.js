import React,{Component} from 'react';
import {View, FlatList, StyleSheet,ActivityIndicator,TouchableOpacity, I18nManager,NetInfo, Text, Image, Animated, Dimensions, AsyncStorage} from 'react-native'
import './global'
import NewsItem from './NewsItem';
import ContextMenu from './ContextMenu';
import Rating from './Rating';
export default class CategoryNewsScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={NightMode:false,CategoryNews:[],loading:true,Network:false,Response:true,item:null,scrollY:new Animated.Value(0),
            open:false,Rating:false,LocX:null,LocY:null,index:null,token:'',Registered:true
        }
        this.isRefreshing=false
        this.Refresh=this.Refresh.bind(this)
        this.ShowMenu = this.ShowMenu.bind(this)
        this.CloseMenu = this.CloseMenu.bind(this)
        this.ShowRating=this.ShowRating.bind(this)
        this.CloseRating=this.CloseRating.bind(this)
    }

    componentDidMount(){

        this.GetToken()
        setTimeout(()=>this.GetDataFromServer(),1500)
        this.GetNightMode()
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode();
            })
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
                    <Text style={styles.DarkErrText}>{this.props.navigation.state.params.item.name}</Text>
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
    async GetDataFromServer() {
        try{

            if(this.state.CategoryNews.length==0) {
                this.setState({loading: true})
                this.setState({NetworkErr: false});
                this.setState({Response: true})
                this.setState({Registered: true})

            }

            let Address = global.ApiAddress + '/news?category_id='+this.props.navigation.state.params.item.id;
            var NetWorkResponse = true
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type == 'none') {

                    this.setState({loading: false})
                    if(this.state.CategoryNews.length==0) {
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
                    headers: {'x-token':this.props.navigation.state.params.token},
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
                        else  this.setState({CategoryNews:Data.data})
                    this.setState({loading:false})
                    this.setState({Response:true})
                    this.setState({NetworkErr:false})

                }
                /* else  if(Data.data.status=='fail' && Data.data.message=='Unauthorized'){
                     this.setState({loading:false})
                     this.setState({NetworkErr:false})
                     this.setState({Response:true})
                     this.setState({Registered:false})
                 }*/
                else{

                    this.setState({loading:false})
                    this.setState({NetworkErr:false})
                    if(this.state.CategoryNews.length==0){
                        this.setState({Response:false})
                    }
                }
            } // if networkresponse true
            else
            {
                this.setState({NetworkErr:false})
                this.setState({loading:false})
                if(this.state.CategoryNews.length==0){
                    this.setState({Response:false})
                }
            }
        } //end try
        catch(error){

            if(error.toString()!='TypeError: Object is null or undefined' && error.toString()!='TypeError: Cannot read property \'data\' of undefined'
                && error.toString()!='TypeError: Cannot convert undefined or null to object'){
                this.setState({NetworkErr: false})
                this.setState({loading: false})
                if(this.state.CategoryNews.length==0) {
                    this.setState({Response: false})
                }
            }
        }

    }
    GetNightMode(){
        AsyncStorage.getItem('NightMode', (err, result) => {
            result=result==='true'?true:false
            if(result!=this.state.NightMode){
                this.setState({NightMode: result})
            }
        });
    }
    Refresh(){
        this.GetDataFromServer()
    }
    GetToken(){
        AsyncStorage.getItem('token', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({token: result})
            }
        });
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
    render(){
        if(this.state.NetworkErr){
            return    (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                    {this.renderHeader()}
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >خطا در اتصال،</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >اینترنت دستگاه خود را</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >بررسی نمــایید</Text>
                    <TouchableOpacity onPress={()=>this.GetDataFromServer()}
                                      activeOpacity={.7} style={styles.ErrButton} >
                        <Text style={[styles.DarkErrText,{textAlign:'center'}]}> تلاش مجدد</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if(!this.state.Response){
            return   (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                    {this.renderHeader()}
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >برقراری ارتباط </Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >با سرور ممکن نیست</Text>
                    <TouchableOpacity onPress={()=>this.GetDataFromServer()}
                                      activeOpacity={.7} style={styles.ErrButton} >
                        <Text style={[styles.DarkErrText,{textAlign:'center'}]}> تلاش مجدد</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if(this.state.Registered!=true){
            return   (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                    {this.renderHeader()}
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >برای مشاهده مطالب باید عضو شوید </Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >یا وارد حساب کاربری خود شوید</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} ></Text>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Profile', {RouteName: this.props.navigation.state.routeName})}
                                      activeOpacity={.7} style={styles.ErrButton} >
                        <Text style={[styles.DarkErrText,{textAlign:'center'}]}> ورود</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if(this.state.CategoryNews.length==0 && !this.state.loading){
            return    (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                    {this.renderHeader()}
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >هیچ موردی برای</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >نمایش وجود ندارد</Text>

                </View>
            );
        }

        return(

            this.state.loading?
                <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                    {this.renderHeader()}
                    <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:this.state.NightMode?global.DarkContainer:global.LightContainer}}><ActivityIndicator size="large" color="#5500ff" /></View>
                </View>
                :
                <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                    {this.renderHeader()}
                    <FlatList
                        // refreshing={this.isRefreshing}
                        //onRefresh={this.Refresh}
                        onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                        data={this.state.CategoryNews}
                        renderItem={(item)=>this.RenderItem(item)}
                        keyExtractor={(item , index) =>index}
                    />
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
                                <Rating token={this.state.token} score={this.state.score} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
                            </TouchableOpacity>:null
                    }
                </View>
        )
    }
}

const styles=StyleSheet.create({
    DarkContainer:{
        flex:1,
        backgroundColor:global.DarkContainer,
    },
    LightContainer:{
        flex:1,
        backgroundColor:global.LightContainer,
    },
    Button:{
        height:'100%',
        width:'100%',
        flexDirection:'column',
        alignItems:'center',

    },
    CategoryItem:{
        height:150,
        margin:5,
        flex:.5,
        alignItems:'center',
    },
    CategoryImage:{
        height:'100%',
        width:'100%',
        borderRadius:8,
        resizeMode:'stretch',
    },
    CategoryText:{
        fontFamily:global.fontFamily,
        fontSize:global.fontSize15,
        marginTop:-50,
        color:global.White1,
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

})

