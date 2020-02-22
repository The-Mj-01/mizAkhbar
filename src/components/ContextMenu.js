import React from 'react';
import { View,Text,Share,AsyncStorage,I18nManager,TouchableOpacity,Image,StyleSheet} from 'react-native';
import './global';

export default class ContextMenu extends React.PureComponent
{
//,{top:this.props.LOCX==null?null:this.props.LOCX*10,right:this.props.LOCY==null?null:this.props.LOCY}]
    constructor(props){
        super(props)
        this.state={
            BookmarkedNews:[],BookmarkIcon:props.NightMode?require('.././images/LightBookmark.png'):require('.././images/DarkBookmark.png')
        }
    }
    componentWillReceiveProps(NextProps){
        this.GetBookmarkedNews()
    }
    componentWillMount(){
        this.GetBookmarkedNews()
    } //end componentWillMount

    ChangeBookmark(item){
        if(this.state.BookmarkedNews!==null ) {
            //check if Bookmarked is not null and current item is in it
            let index = this.state.BookmarkedNews.findIndex(el => el.id === item.id);
            if (index!==-1) {
                this.state.BookmarkedNews.splice(index, 1);
                AsyncStorage.setItem('BookmarkedNews',JSON.stringify(this.state.BookmarkedNews));
            }
            else { //if item isnt in Bookmarked then add it
                this.state.BookmarkedNews.push(item);
                AsyncStorage.setItem('BookmarkedNews',JSON.stringify(this.state.BookmarkedNews));
            }
        } //end outer if
        else{ // if Bookmarked is null
            this.state.BookmarkedNews.push(item)
            AsyncStorage.setItem('BookmarkedNews',JSON.stringify(this.state.BookmarkedNews));
        }

        this.props.CloseMenu();
        if(this.props.GetBookmarkedNews!==undefined) this.props.GetBookmarkedNews();

    } //end ChangeBookmark

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

                this.setState({BookmarkIcon:this.props.NightMode?require('.././images/LightBookmarked.png'):require('.././images/DarkBookmarked.png')})

            }
            else
            {
                this.props.NightMode?this.setState({BookmarkIcon:require('.././images/LightBookmark.png')}):this.setState({BookmarkIcon:require('.././images/DarkBookmark.png')});
            }
            //    }
        }
        catch (error){

        }


    }
    ShareNews(){
        Share.share({
            title:'به اشتراک گذاری',
            message:this.props.item.title+'\n'+'\nدر لینک زیر دنبال کنید\n'+this.props.item.news_url
        },{
            dialogTitle:'به اشتراک گذاری',
            excludeActivityTypes:['com.apple.UIKit.activity.PostToTwitter']
        })
        this.props.CloseMenu();
    }

    render(){
        const {Open,NightMode,CloseMenu} =this.props;
        return(

            <View  style={[NightMode?styles.DarkContainer:styles.LightContainer,{top:this.props.LOCY-60>40?this.props.LOCY-60:40,
                right:I18nManager.isRTL?this.props.LOCX:null,
                left:I18nManager.isRTL?null:this.props.LOCX}]} >
                <TouchableOpacity onPress={(()=>this.ShareNews())} activeOpacity={.7} style={styles.Button}>
                    <Image style={{height:20,width:20}}
                           source={NightMode?require('.././images/LightShare.png'):require('.././images/DarkShare.png')}
                    />
                    <Text style={NightMode?styles.LightText:styles.DarkText}> اشتراک گذاری</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.ChangeBookmark(this.props.item)} activeOpacity={.7} style={styles.Button}>
                    <Image style={{height:20,width:20}}
                           source={this.state.BookmarkIcon}
                    />
                    <Text style={NightMode?styles.LightText:styles.DarkText}>بوک مارک</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    DarkContainer:{
        borderRadius:3,
        zIndex:999,
        position:'absolute',
        backgroundColor:'#414141',
        elevation:10,
        width:150,
    },
    LightContainer:{
        borderRadius:3,
        zIndex:999,
        position:'absolute',
        backgroundColor:'#E1E1E1',
        elevation:10,
        width:150,
    },
    DarkText:{
        paddingRight:15,paddingLeft:15,
        color:'#212121',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12
    },

    LightText:{
        paddingRight:15,paddingLeft:15,
        color:'#F5F5F5',
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12
    },
    Button:{
        padding:5,
        flexDirection:I18nManager.isRTL?'row':'row-reverse',

    }
})