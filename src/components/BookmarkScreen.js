import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Image, FlatList, ListView, AsyncStorage, NetInfo,I18nManager
} from 'react-native';
import NewsItem from './NewsItem';
import './global';
import ContextMenu from './ContextMenu';
import Rating from './Rating';

export default class BookmarkScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={
            scrollY: new Animated.Value(0),open:false,
            NightMode:false,LocX:null,LocY:null,BookmarkedNews:[],Rating:false,token:'',item:null
        }
        this.ShowMenu=this.ShowMenu.bind(this)
        this.CloseMenu=this.CloseMenu.bind(this)
        this.ShowRating=this.ShowRating.bind(this)
        this.CloseRating=this.CloseRating.bind(this)


    }
    componentWillReceiveProps(){

    }
    componentDidMount(){
        this.GetNightMode()
        this.GetBookmarkedNews()
        this.GetToken()

        this.props.navigation.addListener('willFocus',
            ()=>{
                this.GetNightMode()
                this.GetBookmarkedNews()
            })
        // this.CloseDrawer.bind(this)
    }
    async GetBookmarkedNews(){
        try{

            const data=await AsyncStorage.getItem('BookmarkedNews');
            const BookmarkedNews=JSON.parse(data)
            if(BookmarkedNews!==null)
            {
                this.setState({BookmarkedNews: BookmarkedNews});
            }
            //if(this.state.BookmarkedNews!==null){
            let index=this.state.BookmarkedNews.findIndex(el=>el.id==this.props.item.id)

            if(index!==-1){
                this.props.NightMode?this.setState({BookmarkIcon:require('.././images/LightBookmarked.png')}):this.setState({BookmarkIcon:require('.././images/DarkBookmarked.png')});
            }
            else
            {
                this.props.NightMode?this.setState({BookmarkIcon:require('.././images/LightBookmark.png')}):this.setState({BookmarkIcon:require('.././images/DarkBookmark.png')});
            }
            //    }

        }
        catch (error)
        {

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
    async GetToken(){
        await AsyncStorage.getItem('token', (err, result) => {
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

    render(){

        if(this.state.BookmarkedNews.length==0){
            return    (
                <View style={[this.state.NightMode?styles.DarkContainer:styles.LightContainer,{alignItems:'center',justifyContent:'center'}]}>
                    <Animated.View style={styles.Header}>
                        <View style={styles.RightContainer}>
                            <TouchableOpacity activeOpacity={.6} onPress={()=>this.props.navigation.openDrawer()}>
                                <Image style={styles.DrawerIcon} source={require('.././images/DrawerIcon.png')}/>
                            </TouchableOpacity>

                        </View>
                        <View style={styles.LeftContainer}>

                        </View>

                    </Animated.View>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >هیچ موردی برای</Text>
                    <Text style={this.state.NightMode?styles.DarkErrText:styles.LightErrText} >نمایش وجود ندارد</Text>

                </View>
            );
        }

        return(
            <View style={this.state.NightMode?styles.DarkContainer:styles.LightContainer}>
                <Animated.View style={styles.Header}>
                    <View style={styles.RightContainer}>
                        <TouchableOpacity activeOpacity={.6} onPress={()=>this.props.navigation.openDrawer()}>
                            <Image style={styles.DrawerIcon} source={require('.././images/DrawerIcon.png')}/>
                        </TouchableOpacity>

                    </View>
                    {/*<View style={styles.LeftContainer}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} activeOpacity={.6}>
                            <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                        </TouchableOpacity>
                    </View>*/}
                </Animated.View>
                <FlatList style={{marginTop:40,marginBottom:20}}
                          data={this.state.BookmarkedNews}
                         // ListHeaderComponent={<Animated.Image style={{resizeMode:'stretch',height:headerHeight}} source={require('.././images/DrawerImage.jpg')} />}
                          scrollEventThrottle={16}
                          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                          renderItem={({item,index})=>{
                              return(
                                  <NewsItem RouteName={this.props.navigation.state.routeName} token={this.state.token} ShowRating={this.ShowRating} Open={this.state.open} ShowMenu={this.ShowMenu} navigation={this.props.navigation} NightMode={this.state.NightMode} item={item}/>
                              )
                          }}
                />
                {
                    this.state.open?
                        <TouchableOpacity onPress={()=>this.setState({open:false})} style={styles.CloseMenu}>
                            <ContextMenu ShowRating={this.ShowRating} GetBookmarkedNews={()=>this.GetBookmarkedNews()} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseMenu} NightMode={this.state.NightMode} />
                        </TouchableOpacity>:null
                }
                {
                    this.state.Rating?
                        <TouchableOpacity onPress={()=>this.setState({Rating:false})} style={styles.CloseMenu}>
                            <Rating token={this.state.token} item={this.state.item} LOCX={this.state.LocX} LOCY={this.state.LocY} style={{zIndex:999}} CloseMenu={this.CloseRating} NightMode={this.state.NightMode} />
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
        backgroundColor:global.HeaderColor,
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
        marginRight:5,marginLeft:5,
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
        position:'absolute'
    }



})