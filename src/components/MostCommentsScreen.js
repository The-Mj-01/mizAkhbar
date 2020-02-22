import React from 'react';
import {View,Text,Platform,AsyncStorage,NetInfo,Animated,FlatList,TouchableOpacity,I18nManager,StyleSheet,Image} from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import NewsItem from './NewsItem'
import './global';
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default class MostCommentsScreen extends React.Component{
    constructor(props){
        super(props)
        this.state={
            scrollY: new Animated.Value(0),
            NightMode:true,NetworkErr:false,
            News:[]
        }
    }
    GetDataFromServer(){
        NetInfo.getConnectionInfo().then((connectionInfo) => {

            if(connectionInfo.type=='none')
            {
                this.setState({NetworkErr:true});
            }
            else{

                this.setState({NetworkErr:false})
                fetch('http://roocket.org/api/products?page=1')
                    .then(response=>response.json())
                    .then((responseJson)=>{
                        /*     let arr=[]
                             for(let i=0;i<responseJson.data.data.length;i++)
                             {
                                 let bookmark='ios-bookmark-outline';
                                 let index=this.state.NextNews.findIndex(el=>el.item.id===responseJson.data.data[i].id)
                                 if(index!==-1)
                                 {
                                     bookmark='ios-bookmark';
                                 }
                                 let item=
                                     {
                                         ...responseJson.data.data[i],
                                         'bookmark':bookmark
                                     }
                                 this.state.images.push(responseJson.data.data[i].image)
                                 arr.push(item);
                             }
                             this.setState({dataSource:page==1?arr:[...this.state.dataSource,...arr]});*/
                        this.setState({News:responseJson.data.data})

                    }).catch((error)=>{

                    this.setState({NetworkErr:true});
                });
            }
        });
    }
    GetNightMode(){
        AsyncStorage.getItem('NightMode', (err, result) => {

            if(result!==null ) {
                this.setState({NightMode: true})
            }
            else this.setState({NightMode: false});

        });
    }
    componentDidMount(){
        this.GetDataFromServer()
        this.GetNightMode()
        // this.CloseDrawer.bind(this)
    }
    render(){
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const MarginTop=this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [120, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const HeadVisible=this.state.scrollY.interpolate({
            inputRange: [0,HEADER_SCROLL_DISTANCE/3],
            outputRange: ['transparent',global.HeaderColor],
            extrapolate: 'clamp',
        })

        if(this.state.NetworkErr){
            return    (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >خطا در اتصال،</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >اینترنت دستگاه خود را</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >بررسی نمــایید</Text>
                    <TouchableOpacity onPress={()=>this.GetDataFromServer()}
                                      activeOpacity={.7} style={styles.ErrButton} >
                        <Text style={styles.DarkErrText}> تلاش مجدد</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return(
            <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>

                <CustomTabBar Title={'سیاسی'} HeadVisible={HeadVisible} navigation={this.props.navigation} />
                <Animated.View style={[styles.TabContainer,{backgroundColor:HeadVisible}]}>
                    <TouchableOpacity activeOpacity={.7}  style={styles.TabButton}
                                      onPress={()=>this.props.navigation.navigate('News')}>
                        <Text style={styles.TabText}>تازه ترین</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} style={styles.TabButton}
                                      onPress={()=>this.props.navigation.navigate('FavoritesScreen')}>
                        <Text style={styles.TabText}>پربازدیدترین</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} style={styles.TabButton}
                                      onPress={()=>this.props.navigation.navigate('MostCommentsScreen')}>
                        <Text style={styles.TabText}>پربحث ترین</Text>
                    </TouchableOpacity>
                </Animated.View>
                <FlatList
                    data={this.state.News}
                    ListHeaderComponent={<Animated.Image style={{resizeMode:'stretch',height:headerHeight}} source={require('.././images/DrawerImage.jpg')} />}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]

                    )}
                    renderItem={({item,index})=>{
                        return(
                            <NewsItem NightMode={this.state.NightMode} TopMargin={HEADER_MAX_HEIGHT} item={item}/>
                        )
                    }}
                />



            </View>
        )
    }

}//end class

const styles=StyleSheet.create({
    DarkContainer:{
        flex:1,
        backgroundColor:"#414141",
    },
    LightContainer:{
        flex:1,
        backgroundColor:global.DarkContainer,
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
        marginTop:5,
        backgroundColor:'#CC1111',
        padding:5,
        borderRadius:3,
        justifyContent:'center'
    },
    TabContainer:{
        marginTop:40,
        position:'absolute',
        width:'100%',
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:1000
    },
    TabButton:{
        flex:.5,
        height:'100%',
        justifyContent:'center',

    },
    TabText:{
        ...Platform.select({
            android:{
                fontFamily:'IRANSansMobile_Bold',
            },
            ios:{
                fotFamily:global.fontFamily,
                fontWeight:'bold'
            }, }),
        fontSize:global.fontSize14,
        textAlign:'center',
        color:'#F5F5F5',
        textAlignVertical:'center'
    }
})