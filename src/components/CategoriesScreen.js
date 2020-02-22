import React,{Component} from 'react';
import {View, FlatList, StyleSheet,ActivityIndicator,TouchableOpacity, I18nManager,NetInfo, Text, Image, Animated, Dimensions, AsyncStorage} from 'react-native'
import './global'
export default class CategoriesScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={NightMode:false,Categories:[],loading:true,Registered:true,Network:false,Response:true,token:''
        }
        this.isRefreshing=false
        this.Refresh=this.Refresh.bind(this)
    }

    componentDidMount(){
        const {height}=Dimensions.get('window')
        this.GetNightMode()
        this.GetToken()
        setTimeout(()=>this.GetDataFromServer(),1500)
        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode();
                this.GetToken()
            })
    }
    async GetDataFromServer() {
        try{
            if(this.state.Categories.length==0) {
                this.setState({loading: true})
                this.setState({NetworkErr: false});
                this.setState({Response: true})
                this.setState({Registered: true})
            }
            let Address = global.ApiAddress + '/category';
            var NetWorkResponse = true
            NetInfo.getConnectionInfo().then((connectionInfo) => {
                if (connectionInfo.type == 'none') {

                    this.setState({loading: false})
                    if(this.state.Categories.length==0) {
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
                    if(Data.data!=undefined) this.setState({Categories:Data.data})
                    this.setState({loading:false})
                    this.setState({Response:true})
                    this.setState({NetworkErr:false})

                }
                else if(Data.data.status=='fail' && Data.data.message=='Unauthorized'){
                    this.setState({loading:false})
                    this.setState({NetworkErr:false})
                    this.setState({Response:true})
                    this.setState({Registered:false})
                }
                else{
                    this.setState({loading:false})
                    this.setState({NetworkErr:false})
                    if(this.state.Categories.length==0){
                        this.setState({Response:false})

                    }
                }
            } // if networkresponse true
            else
            {
                this.setState({NetworkErr:false})
                this.setState({loading:false})
                if(this.state.Categories.length==0){
                    this.setState({Response:false})
                }
            }
        } //end try
        catch(error){

            if(error.toString()!='TypeError: Object is null or undefined' && error.toString()!='TypeError: Cannot read property \'data\' of undefined'
                && error.toString()!='TypeError: Cannot convert undefined or null to object'){
                this.setState({NetworkErr: false})
                this.setState({loading: false})
                if(this.state.Categories.length==0) {
                    this.setState({Response: false})
                }
            }
        }

    }
    GetToken(){
        AsyncStorage.getItem('token', (err, result) => {
            if(result!=null || result!=undefined){
                this.setState({token: result})
            }
        });
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
    RenderItem({item}){
        return (

            <View style={styles.CategoryItem}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('CategoryNews',{token:this.state.token,item:item,RouteName:this.props.navigation.state.routeName})} activeOpacity={.8} style={styles.Button}>
                    <Image style={styles.CategoryImage} source={{uri:item.image}}/>
                    <Text style={styles.CategoryText}>{item.name}</Text>
                </TouchableOpacity>
            </View>

        )
    }
    render(){
        if(this.state.NetworkErr){
            return    (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
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
        return(
            this.state.loading?
                <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:this.state.NightMode?global.DarkContainer:global.LightContainer}}><ActivityIndicator size="large" color="#5500ff" /></View>
                :<View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                    <FlatList
                        refreshing={this.isRefreshing}
                        onRefresh={this.Refresh}
                        data={this.state.Categories}
                        renderItem={(item)=>this.RenderItem(item)}
                        keyExtractor={(item , index) =>index}
                        numColumns={2}
                        columnWrapperStyle={{flexDirection:I18nManager.isRTL?'row':'row-reverse'}}
                    />
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

