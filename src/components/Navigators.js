import React from 'react';
import {I18nManager,Image} from 'react-native'
import { createDrawerNavigator,createBottomTabNavigator , createStackNavigator , createSwitchNavigator  } from 'react-navigation';
import './global';
import CustomTabBar from './CustomTabBar'
//components
import HomeScreen from "./HomeScreen";
import FeedbackScreen from "./FeedbackScreen";
import NewsDetailScreen from "./NewsDetailScreen";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import DrawerMenu from "./DrawerMenu";
import PrivacyScreen from "./PrivacyScreen";
import AboutScreen from "./AboutScreen";
import BookmarkScreen from './BookmarkScreen';
import CommentScreen from "./CommentScreen";
import RegisterScreen from "./RegisterScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import LoginScreen from "./LoginScreen";
import EditProfileScreen from "./EditProfileScreen";
import ForgetPassScreen from "./ForgetPassScreen";
import CheckTokenScreen from "./CheckTokenScreen";
import ResetPassScreen from "./ResetPassScreen";
import ChangePassScreen from './ChangePassScreen';
import CategoriesScreen from './CategoriesScreen';
import ProfileScreen from "./ProfileScreen";
import CategoryNewsScreen from "./CategoryNews";

export const Tabs=createBottomTabNavigator ({
        News: {
            screen: HomeScreen, navigationOptions: {
                tabBarLabel: 'اخبار',
                tabBarIcon: () => <Image source={require('../images/News.png')} style={{width: 25, height: 25}}/>
            }
        },
        BookmarkedNews: {
            screen: BookmarkScreen, navigationOptions: {
                tabBarLabel: 'موارد دلخواه',
                tabBarIcon: () => <Image source={require('../images/LightBookmarked.png')} style={{width: 25, height: 25}}/>
            }
        },
        Category: {
            screen: CategoriesScreen, navigationOptions: {
                tabBarLabel: 'دسته بندی',
                tabBarIcon: () => <Image source={require('../images/Category.png')} style={{width: 25, height: 25}}/>
            }
        },
        Profile: {
            screen: ProfileScreen, navigationOptions: {
                tabBarLabel: 'پروفایل',
                tabBarIcon: () => <Image source={require('../images/EditProfile.png')} style={{width: 25, height: 25}}/>
            }
        }
    },
    {
    //tabBarComponent:({navigation})=><CustomTabBar navigation={navigation} />,
    tabBarOptions:{
        style:{backgroundColor:global.HeaderColor},
        labelStyle:{fontSize:global.fontSize12,fontFamily:global.fontFamily},
        activeBackgroundColor:global.ActiveHeaderColor,
            activeTintColor:global.Gray4
    },
    navigationOptions: {

    },
    order:I18nManager.isRTL?['Profile','Category','BookmarkedNews','News']:['News','BookmarkedNews','Category','Profile'],
        animationEnabled:true,
    initialRouteName:'News'
})

export const Stack =createStackNavigator({
        //Home:{screen:HomeScreen},
        //BookmarkedNews:{screen:BookmarkScreen},
        Home:Tabs,
        NewsDetail:{screen:NewsDetailScreen},
        CategoryNews:{screen:CategoryNewsScreen},
        Search:{screen:SearchScreen},
        Settings:{screen:SettingsScreen},
        Aboutus:{screen:AboutScreen},
        Feedback:{screen:FeedbackScreen},
        Privacy:{screen:PrivacyScreen},
        // EditProfile:{screen:EditProfileScreen}
    },
    {navigationOptions:{header:null},
        //initialRouteName:'Home',

    })
export const Drawer=createDrawerNavigator({
        Stack: {screen:Stack},
    },
    {
        header: { visible: false, },
        contentComponent:DrawerMenu ,
        drawerPosition :'right'

    });

export default RootStack=createStackNavigator({
        Drawer:Drawer,
        SendComment:{screen:CommentScreen},
        Register:{screen:RegisterScreen},
        Confirmation:{screen:ConfirmationScreen},
        Login:{screen:LoginScreen},
        EditProfile:{screen:EditProfileScreen},
        ForgetPassword:{screen:ForgetPassScreen},
        CheckToken:{screen:CheckTokenScreen},
        ResetPassword:{screen:ResetPassScreen},
        ChangePassword:{screen:ChangePassScreen},

    },
    {navigationOptions:{header:null},/*initialRouteName:'RateBar'*/})




