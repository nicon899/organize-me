import React from 'react';
import { Platform } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/Finance/CategoryScreen';
import CreateCategoryScreen from '../screens/Finance/CreateCategoryScreen';
import BookingDetailsScreen from '../screens/Finance/BookingDetailsScreen';
import CreateBookingScreen from '../screens/Finance/CreateBookingScreen';
import EditCategoryScreen from '../screens/Finance/EditCategoryScreen';

const FinanceStack = createStackNavigator();
const FinanceStackNavigator = () => {
    return (
        <FinanceStack.Navigator
            screenOptions={{
                headerShown: Platform.OS === 'android' ? false : true
            }}>
            <FinanceStack.Screen name="Category" component={CategoryScreen} />
            <FinanceStack.Screen name="CreateCategory" component={CreateCategoryScreen} />
            <FinanceStack.Screen name="EditCategory" component={EditCategoryScreen} />
            <FinanceStack.Screen name="Booking" component={BookingDetailsScreen} />
            <FinanceStack.Screen name="CreateBooking" component={CreateBookingScreen} />
        </FinanceStack.Navigator>
    );
}

const MainDrawerNavigator = createDrawerNavigator();
export const MainNavigator = () => {
    return (
        <MainDrawerNavigator.Navigator>
            <MainDrawerNavigator.Screen
                name="Home"
                component={HomeScreen}
            />
            <MainDrawerNavigator.Screen
                name="Finance"
                component={FinanceStackNavigator}
            />
        </MainDrawerNavigator.Navigator>
    );
};