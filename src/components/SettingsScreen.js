import React from 'react';
import {View,Image, TouchableOpacity,Text, Switch, StyleSheet, AsyncStorage, StatusBar, I18nManager} from 'react-native';
import './global';
export default class SettingsScreen extends React.Component{

    constructor(props){
        super(props)
        this.state={
            NightMode:false

        }
        this.ChangeMode=this.ChangeMode.bind(this)
    }
    ChangeMode(){
        if(this.state.NightMode===true) {
            this.setState({NightMode: false})
            AsyncStorage.setItem('NightMode','false')
        }

        else {
            this.setState({NightMode:true})
            AsyncStorage.setItem('NightMode','true')
        }


    }
    Header(){
        if(I18nManager.isRTL){
            return(
                <Header style={{backgroundColor:'rgba(255, 199, 10, .7)',height:40}}>
                    <Left>
                        <Button transparent onPress={()=>Actions.drawerOpen()}>
                            <Icon name='menu'  />
                        </Button>

                    </Left>
                    <Body>
                    <Title>تنظیمات</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={()=>Actions.pop()}>
                            <Icon name='arrow-back'  />
                        </Button>
                    </Right>
                </Header>
            )
        }
        return(
            <Header style={{backgroundColor:'rgba(255, 199, 10, .7)',height:40}}>
                <Left>
                    <Button transparent onPress={()=>Actions.pop()}>
                        <Icon name='arrow-back'  />
                    </Button>
                </Left>
                <Body>
                <Title>تنظیمات</Title>
                </Body>
                <Right>
                    <Button transparent onPress={()=>Actions.drawerOpen()}>
                        <Icon name='menu'  />
                    </Button>
                </Right>
            </Header>
        )
    }
    componentDidMount(){
        this.GetNightMode()
    }
    GetNightMode(){
         AsyncStorage.getItem('NightMode', (err, result) => {
            result=result==='true'?true:false
            if(result!=this.state.NightMode){
                this.setState({NightMode: result})
            }
        });
    }

    render(){
        return(
            <View style={this.state.NightMode?styles.DarkFirstContainer:styles.LightFirstContainer}>
                <StatusBar hidden />
                <View style={styles.Header}>
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

                </View>
                <View style={this.state.NightMode?styles.DarkSettingContainer:styles.LightSettingContainer}>
                    <Text style={this.state.NightMode?styles.DarkHeader:styles.LightHeader}> پوسته برنامه</Text>
                    <View style={{flexDirection:I18nManager.isRTL?'row':'row-reverse'}}>
                        <Text style={this.state.NightMode?styles.DarkText:styles.LightText}>نمای شب</Text>
                        <Switch value={this.state.NightMode} onValueChange={this.ChangeMode} />
                    </View>
                    <Text style={this.state.NightMode?styles.DarkNote:styles.LightNote}>مناسب برای مطالعه در فضای نور کم</Text>
                </View>
            </View>
        );

    }

} // end class

const styles=StyleSheet.create({
    DarkFirstContainer:
        {
            backgroundColor:'#313131',
            flex:1,
            alignItems:'center',
            // justifyContent:'center'
        },
    LightFirstContainer:
        {
            flex:1,
            alignItems:'center',
            // justifyContent:'center'
        },
    LightSettingContainer:
        {
            borderRadius:5,
            margin:5,
            padding:5,
            alignSelf:'center',
            backgroundColor:'#F5F5F5',
            elevation:5,
            width:'95%',

        },
    DarkSettingContainer:
        { borderRadius:5,
            margin:5,
            padding:5,
            alignSelf:'center',
            backgroundColor:'#414141',
            elevation:5,
            width:'95%',
        },
    LightHeader:{
        padding:3,
        fontSize:global.fontSize16,
        fontFamily:global.fontFamily,
        color:'#414141',
    },
    DarkHeader:{
        padding:3,
        fontSize:global.fontSize16,
        fontFamily:global.fontFamily,
        color:'#F5F5F5',
    },
    LightText:{
        flex:.9,
        padding:3,
        fontSize:global.fontSize14,
        fontFamily:global.fontFamily,
        color:'#414141',
    },
    DarkText:{
        flex:.9,
        padding:3,
        fontSize:global.fontSize14,
        fontFamily:global.fontFamily,
        color:'#F5F5F5',
    },
    LightNote:{
        padding:3,
        fontSize:12,
        fontFamily:global.fontFamily,
        color:'#818181',
    },
    DarkNote:{
        padding:3,
        fontSize:12,
        fontFamily:global.fontFamily,
        color:'#F1F1F1',
    },
    Header:{
        backgroundColor:global.HeaderColor,
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
        alignItems:'center',

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

});