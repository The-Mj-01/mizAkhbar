import React , { Component } from 'react';
import {Animated,View,Text,StyleSheet,TouchableOpacity,I18nManager,Image} from 'react-native';
export default class CustomTabBar extends React.Component {

    render(){
        const {HeadVisible}=this.props

        return(
            <Animated.View style={[styles.Container,{backgroundColor:HeadVisible}]}>

                <TouchableOpacity activeOpacity={.7} onPress={()=>this.props.navigation.openDrawer()}>
                    <Image style={styles.DrawerIcon}
                           source={require('.././images/DrawerIcon.png')}
                    />
                </TouchableOpacity>
                <Text style={styles.Subject}>سیاسی</Text>
                <View style={styles.SecondContainer}>
                    <TouchableOpacity activeOpacity={.7} onPress={()=>this.props.navigation.goBack()} >
                        <Image style={styles.Icon}
                               source={require('.././images/Back.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} >
                        <Image style={styles.Icon}
                               source={require('.././images/Refresh.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} >
                        <Image style={styles.Icon}
                               source={require('.././images/LightSearch.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} >
                        <Image style={styles.Icon}
                               source={require('.././images/LightBookmark.png')}
                        />
                    </TouchableOpacity>



                </View>

            </Animated.View>
        )
    }
} //end class

const styles=StyleSheet.create({
    Container:{
        position:'absolute',
        width:'100%',
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:1000,
    },
    SecondContainer:{
        flex:.7,
        flexDirection:I18nManager.isRTL?'row-reverse':'row',
        justifyContent:'center',
    },
    Icon:{
        marginRight:I18nManager.isRTL?0:15,
        marginLeft:I18nManager.isRTL?15:0,
        height:20,
        width:20
    },
    DrawerIcon:{
        marginRight:5,
        height:26,
        width:26
    },
    Subject:{
        margin:5,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12,
        color:'#F5F5F5',
        flex:.9,
        textAlign:I18nManager.isRTL?'left':'right',

    }
})
