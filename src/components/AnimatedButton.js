import React from 'react';
import {View, Image, Text, Animated,TouchableOpacity, Easing, StyleSheet, I18nManager} from 'react-native';
import './global';
export default class AnimatedButton extends React.Component{

    constructor(props){
        super(props)
        this.pressInHandler=this.pressInHandler.bind(this);
        this.pressOutHandler=this.pressOutHandler.bind(this);
        this.AnimatedValue=new Animated.Value(1);
        this.animatedStyle={transform:[{scale:this.AnimatedValue}]}
    }

    pressInHandler(){
        Animated.spring(this.AnimatedValue,{
            toValue:.9,
        }).start();

    }
    pressOutHandler() {
        Animated.parallel([
            Animated.spring(this.AnimatedValue, {
                toValue: 1,
                friction: 2,
                tension: 300,
            }),
            Animated.timing(
                this.RedBackColorValue,{toValue:this.Value,duration:350}
            )

        ]).start()
    }
    renderImage(){
    //    if(this.props.name=='like')


            return  (
            <Image style={styles.StatusImg} source={require('.././images/DarkLike.png')}/>
        )
      //  }
    }
    render(){

        return(<View style={styles.Status}>
                <TouchableOpacity style={{alignItems:'center'}}>

                    {this.renderImage.bind(this)}
                    <Text style={this.props.this.state.NightMode?styles.DarkStatusText:styles.LightStatusText}>
                        {this.props.text}
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }

}//endclass

const styles=StyleSheet.create({
    Status:{
        borderLeftWidth:I18nManager.isRTL?0:1,
        flexDirection:I18nManager.isRTL?'row-reverse':'row',
        alignItems:'center'
    },
    StatusImg:{
        marginLeft:5,marginRight:5,
        height:20,
        width:20
    },
    DarkStatusText:{
        marginRight:5,
        textAlign:'center',
        fontFamily:global.fontFamily,
        color:'#F5F5F5',
        fontSize:global.fontSize12
    },
    LightStatusText:{
        marginLeft:5,marginRight:5,
        textAlignVertical:'center',
        fontFamily:global.fontFamily,
        color:'#F5F5F5',
        fontSize:global.fontSize12
    },
})