import React from 'react';
import {
    View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Image, FlatList, ListView, AsyncStorage, NetInfo,
    I18nManager} from 'react-native';
import SlideShow from "react-native-slideshow";
import VideoPlayer from 'react-native-video-controls';
import './global';
let Address=global.ApiAddress+'/news';
export default class NewsDetailItem extends React.Component {
    constructor(props){
        super(props)
        this.state={
            NightMode:false,NetworkErr:false,scrollY: new Animated.Value(0),
            SimilarNews:[]
        }
        this.ShowMenu=this.ShowMenu.bind(this)
        this.CloseMenu=this.CloseMenu.bind(this)
    }
    componentWillReceiveProps(){
        this.GetDataFromServer()
        this.refs.FlatList.scrollToOffset(true,0)
        this.refs.ScrollView.scrollTo({x: 0, y: 0, animated: true})
    }
    componentWillMount(){
        this.panResponder = PanResponder.create(
            {
                onStartShouldSetPanResponder: (event, gestureState) => true,

                onStartShouldSetPanResponderCapture: (event, gestureState) => true,

                onMoveShouldSetPanResponder: (event, gestureState) => false,

                onMoveShouldSetPanResponderCapture: (event, gestureState) => false,

                onPanResponderGrant: (event, gestureState) => false,

                onPanResponderMove: (event, gestureState) => false,

                onPanResponderRelease: (event, gestureState) =>
                {
                    const item=this.props.item
                    const X=event.nativeEvent.pageX
                    const Y=event.nativeEvent.pageY
                    const data={
                        item,
                        X,
                        Y
                    }
                    this.ShowMenu(data)
                }
            });
    }
    componentDidMount(){
        this.GetDataFromServer()
        this.GetNightMode()
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
    renderHeader(){
        const HeadVisible=this.state.scrollY.interpolate({
            inputRange: [0,global.HEADER_SCROLL_DISTANCE],
            outputRange: ['transparent',global.HeaderColor],
            extrapolate: 'clamp',
        })
        return(
            <Animated.View style={[styles.Header,{backgroundColor:HeadVisible}]}>
                <View style={styles.RightContainer}>
                    <TouchableOpacity activeOpacity={.6} onPress={()=>this.props.navigation.openDrawer()}>
                        <Image  style={styles.DrawerIcon} source={require('.././images/DrawerIcon.png')}/>
                    </TouchableOpacity>

                </View>
                <View style={styles.LeftContainer}>

                    <TouchableOpacity onPress={()=>this.props.navigation.goBack()} activeOpacity={.6}>
                        <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                    </TouchableOpacity>

                </View>

            </Animated.View>
        )
    }
    renderFooter(){
        const {item}=this.props.navigation.state.params;
        return(
            <View style={this.state.NightMode ? styles.DarkFooter : styles.LightFooter}>

                <View style={[styles.Status,{borderColor:this.state.NightMode?'#313131':'#D8D8D8'}]}>
                    <TouchableOpacity style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                        <Image style={styles.StatusImg} source={require('.././images/Like.png')}/>
                    </TouchableOpacity>
                    <Text style={this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {item.likes==null?0:item.likes}
                    </Text>
                </View>

                <View style={[styles.Status,{borderColor:this.state.NightMode?'#313131':'#D8D8D8'}]}>
                    <TouchableOpacity style={{flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
                        <Image style={styles.StatusImg}
                               source={this.state.NightMode?require('.././images/DarkComments.png'):require('.././images/LightComments.png')}/>
                    </TouchableOpacity>
                    <Text style={this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {item.comments==null?0:item.comments}
                    </Text>
                </View>
                <View style={[styles.Status,{borderColor:this.state.NightMode?'#313131':'#D8D8D8'},]}>
                    <Image style={styles.StatusImg}
                           source={this.state.NightMode?require('.././images/LightClick.png'):require('.././images/DarkClick.png')}/>
                    <Text style={this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {item.views==null?0:item.views}
                    </Text>
                </View>
                <View {...this.panResponder.panHandlers} style={[styles.Status,{borderColor:this.state.NightMode?'#313131':'#D8D8D8'},]}>
                    <TouchableOpacity >
                        <Image style={styles.StatusImg}
                               source={this.state.NightMode?require('.././images/LightMenu.png'):require('.././images/DarkMenu.png')}/>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
    async GetDataFromServer(){
        let Address=global.ApiAddress+'/news';
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type=='none')
            {
                this.setState({NetworkErr:true});
            }
            else{

                this.setState({NetworkErr:false})
                fetch(Address)
                    .then(response=>response.json())
                    .then((responseJson)=>{
                        this.setState({SimilarNews:responseJson.data})

                    }).catch((error)=>{

                    this.setState({NetworkErr:true});
                });
            }
        });
    }
    showSimilarNews(){
        return(
            <FlatList ref="FlatList" style={{marginBottom:20}}
                      data={this.state.SimilarNews}
                      scrollEventThrottle={16}
                      ListHeaderComponent={()=>{
                          return(
                              <View style={styles.SimilarNews}>
                                  <Text style={styles.SimilarNewsTitle}>اخبار مشابه</Text>
                              </View>
                          )
                      }}
                      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                      renderItem={({item,index})=>{
                          return(
                              <View style={this.state.NightMode?styles.DarkNewsBox:styles.LightNewsBox}>
                                  <TouchableOpacity activeOpacity={.8} key={item.id}
                                                    style={{flex:1,flexDirection:I18nManager.isRTL?'row':'row-reverse',paddingBottom:10}}
                                                    onPress={()=>this.props.navigation.navigate('NewsDetail',{item:item})}>
                                      <Text key={item.id} numberOfLines={3}
                                            style={this.state.NightMode?styles.DarkSimTitle:styles.LightSimTitle} >{item.title}</Text>
                                      <Image
                                          source={item.image_url!==null?{uri:item.image_url}:require('.././images/MizAkhbar.png' )}
                                          style={styles.SimImage}
                                      />
                                  </TouchableOpacity>

                              </View>
                          )
                      }}
            />

            //  <News data={item}/>
        );
    } // end show data

    GetNightMode(){
        AsyncStorage.getItem('NightMode', (err, result) => {

            if(result!==null ) {

                if(result==='true')
                    this.setState({NightMode: true})
                else this.setState({NightMode: false})
            }
            else this.setState({NightMode: false});

        });

    }

    render(){
        const {item}=this.props.navigation.state.params;
        const {NightMode,Open,ShowMenu} = this.props;
        if(item.style===4)
        {
            var images=[]
            for(let i=0;i<item.image_gallery.length-1;i++){
                let image={url:item.image_gallery[i]}
                images.push(image)
            }
            return (
                <View style={{height:'100%',width:'100%'}}>
                    {this.renderHeader()}
                    <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer]}>

                        <SlideShow  dataSource={images}/>
                        <Text style={this.state.NightMode?styles.DarkTitle:styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={this.state.NightMode?styles.DarkSummary:styles.LightSummary}>
                            {item.summary}
                        </Text>
                        {this.renderFooter()}

                    </View>
                    {this.showSimilarNews()}

                </View>
            )
        }
        if(item.style===5)
        {
            return (
                <View style={{height:'100%',width:'100%'}}>
                    {this.renderHeader()}
                        <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer]}>
                            <View style={{width:'100%',height:200}}>
                                <VideoPlayer ref={(ref) => {this.player = ref }} resizeMode={'stretch'}
                                             source={{uri:item.video_url}}  style={styles.Video}
                                />

                            </View>

                            <Text style={this.state.NightMode?styles.DarkTitle:styles.LightTitle}>
                                {item.title}
                            </Text>
                            <Text style={this.state.NightMode?styles.DarkSummary:styles.LightSummary}>
                                {item.summary}
                            </Text>
                            {this.renderFooter()}

                        </View>
                        {this.showSimilarNews()}

                </View>

            )
        }
        return (
            <View style={{height:'100%',width:'100%',backgroundColor:this.state.NightMode?'#E0E0E0':'#212121'}}>
                {this.renderHeader()}
                                    <View style={[this.state.NightMode ? styles.DarkContainer : styles.LightContainer]}>

                        <Image source={item.image_url!==null?{uri:item.image_url}:require('.././images/MizAkhbar.png' )}
                               style={styles.Style2Pic} resizeMode={item.image_url!==null?'stretch':'contain'} /*source={{uri: item.image_url}}*/
                        />

                        <Text style={this.state.NightMode?styles.DarkTitle:styles.LightTitle}>
                            {item.title}
                        </Text>
                        <Text style={this.state.NightMode?styles.DarkAgency:styles.LightAgency}>
                            {item.agency.name}
                        </Text>
                        <Text style={this.state.NightMode?styles.DarkSummary:styles.LightSummary}>
                            {item.summary}
                        </Text>

                        {this.renderFooter()}

                    </View>
                    {this.showSimilarNews()}
            </View>

        )


    }

}

const styles=StyleSheet.create(

    {  DarkContainer:{
            alignSelf:'center',
            width:'98%',
            backgroundColor:'#414141',
        },
        LightContainer:{
            alignSelf:'center',
            width:'98%',
            backgroundColor:'#F4F4F4',
        },
        DarkFooter:{
            borderTopWidth:1,
            borderTopColor:'#313131',
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            justifyContent:I18nManager.isRTL?'flex-end':'flex-end',
            width:'100%',
            height:40,
            // justifyContent:'center'
        },
        LightFooter:{
            borderTopWidth:1,
            borderTopColor:'#AAA',
            backgroundColor:'#F0F0F0',
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
            justifyContent:I18nManager.isRTL?'flex-end':'flex-end',
            width:'100%',
            height:40,
            //   justifyContent:'center'
        },
        DarkTitle1:{
            width:'50%' ,
            flexWrap:'wrap',
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
            textAlignVertical:'center'
        },
        LightTitle1:{
            width:'50%',
            marginRight:I18nManager.isRTL?'2%':0,
            marginLeft:I18nManager.isRTL?0:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:global.Gray2,
            textAlignVertical:'center'
        },
        DarkSimTitle:{
            width:'50%' ,
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
            textAlignVertical:'center'
        },
        LightSimTitle:{
            width:'50%',
            marginRight:I18nManager.isRTL?'2%':0,
            marginLeft:I18nManager.isRTL?0:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:global.Gray2,
            textAlignVertical:'center'
        },
        DarkTitle:{
            flexWrap:'wrap',
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
            textAlignVertical:'center'
        },
        LightTitle:{
            //width:'26%',
            // marginRight:I18nManager.isRTL?'2%':0,
            // marginLeft:I18nManager.isRTL?0:'2%',
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:global.Gray2,
            textAlignVertical:'center'
        },
        Status:{
            borderLeftWidth:I18nManager.isRTL?0:1,
            borderRightWidth:I18nManager.isRTL?1:0,
            flexDirection:I18nManager.isRTL?'row-reverse':'row',
            alignItems:'center'
        },
        StatusImg:{
            marginLeft:5,marginRight:5,
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
            fontSize:global.fontSize14,
            fontFamily:global.fontFamily
        },
        DarkStatusText:{
            marginRight:5,marginLeft:5,
            textAlign:'center',
            fontFamily:global.fontFamily,
            color:'#F5F5F5',
            fontSize:global.fontSize12
        },
        LightStatusText:{
            marginLeft:5,marginRight:5,
            textAlign:'center',
            fontFamily:global.fontFamily,
            color:global.Gray2,
            fontSize:global.fontSize12
        },
        DarkSummary:{
            marginRight:'2%',
            marginLeft:'2%',
            marginTop:5,
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
        },
        LightSummary:{
            marginRight:'2%',
            marginLeft:'2%',
            marginTop:5,
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:global.Gray2,
        },
        DarkAgency:{
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
        },
        LightAgency:{
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:global.Gray2,
        },
        Title3:{
            left:I18nManager.isRTL?5:null,
            right:I18nManager.isRTL?null:5,
            backgroundColor:'#414141',
            opacity:.7,
            top:10,
            position:'absolute',
            flexWrap:'wrap',
            marginRight:'2%',
            marginLeft:'2%',
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
            //textAlignVertical:'center'
        },
        Summary3:{
            left:I18nManager.isRTL?5:null,
            right:I18nManager.isRTL?null:5,
            backgroundColor:'#414141',
            opacity:.7,
            top:120,
            marginRight:'2%',
            marginLeft:'2%',
            position:'absolute',
            marginTop:5,
            fontFamily:global.fontFamily,
            fontSize:global.fontSize12,
            color:'#F5F5F5',
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
            resizeMode:'stretch',
            height:150,
            margin:5,
            width:'50%',
            borderRadius:3
        },
        Style2Pic:{
            height:200,
            width:'100%',
        },
        Style3Pic:{
            // position:'absolute',
            //top:0,left:0,
            height:250,
            width:'100%',
        },
        Video:{

            height:300,
            width:'100%'
        },
        Header:{
            position:'absolute',
            zIndex:999,
            width:'100%',
            height:40,
            alignItems:'center',
            flexDirection:I18nManager.isRTL?'row':'row-reverse',
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
            margin:5,
            height:22,
            width:22,
            resizeMode:'stretch'
        },
        DrawerIcon:{
            marginRight:5,
            height:28,
            width:28,
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
            borderRadius:10,
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
            height:40,
            elevation:10,
            borderRadius:5,
            alignSelf:I18nManager.isRTL?'flex-start':'flex-end'
        },
        SimilarNewsTitle:{
            fontSize:global.fontSize12,
            fontFamily:global.fontFamily,
            color:'#F5F5F5'

        }
    },
);
