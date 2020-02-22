import React from 'react';
import {View,Text,TouchableOpacity,I18nManager} from 'react-native';
import './global';
export default class FavoritesScreen extends React.Component{
    static navigationOptions= {
        tabBarLabel: 'پر بازدیدترین',
    }
    render(){
        return(
            <View>
                <Text>Favorites Screen</Text>
            </View>
        )
    }

}//end class