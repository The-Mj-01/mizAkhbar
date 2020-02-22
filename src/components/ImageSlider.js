import React,{Component} from 'react';
import {View,Image,Animated,Easing} from 'react-native';

export default class ImageSlider extends Component{

    constructor(props){
        super(props)
        this.state = {
            dataSource:[],position:0,
        },this.interval=null
        this.OpacityAnimate=new Animated.Value(0)
        this.ChangeSlide=this.ChangeSlide.bind(this)
        this.Hide=this.Hide.bind(this),this.Show=this.Show.bind(this)
        this.Wait=this.Wait.bind(this)
    }
    componentWillMount(){
       this.Show()
       
    }

    AnimateImages(targetValue,cb){
        Animated.timing(this.OpacityAnimate,{
            toValue:targetValue,
            easing:Easing.circle,
            duration:2000,
            useNativeDriver: true,
        }).start(()=>this.Wait(cb));
    }
    Wait(cb){
        Animated.delay(10).start(cb)
    }
    Show(){
        this.AnimateImages(1,this.Hide)
    }
    Hide(){
        this.AnimateImages(0,this.ChangeSlide)
    }
    ChangeSlide(){
        let index = this.state.position + 1;
        index = index < this.props.images.length ? index : 0;
        this.setState({position: index})
        this.Wait(this.Show)
    }
    render(){
        const {images}=this.props
        const OpacityConfig=this.OpacityAnimate.interpolate({
            inputRange:[0,1],
            outputRange:[.05,.9]
        })
        return(
            <Animated.View style={[styles.Container,{opacity:OpacityConfig}]}>
                <Image style={styles.Img}
                       source={{uri:images[this.state.position].url}}/>
            </Animated.View>

        )
    }//end render
}//end class

const styels=StyleSheet.create({
    Container:{
        width:'100%',
        height:200,
    },
    Img:{
        height:200,
        width:'100%'
    },

})