import React from 'react';
import { Platform } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/Finance/CategoryScreen';
import CreateCategoryScreen from '../screens/Finance/CreateCategoryScreen';
import BookingDetailsScreen from '../screens/Finance/BookingDetailsScreen';
import CreateBookingScreen from '../screens/Finance/CreateBookingScreen';
import EditCategoryScreen from '../screens/Finance/EditCategoryScreen';

import CreateTaskBoardScreen from '../screens/Tasks/CreateTaskBoardScreen';
import CreateTaskScreen from '../screens/Tasks/CreateTaskScreen';
import TaskScreen from '../screens/Tasks/TaskScreen';
import CalendarScreen from '../screens/Tasks/CalendarScreen';

const FinanceStack = createStackNavigator();
const FinanceStackNavigator = () => {
    return (
        <FinanceStack.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <FinanceStack.Screen name="Category" component={CategoryScreen} />
            <FinanceStack.Screen name="CreateCategory" component={CreateCategoryScreen} />
            <FinanceStack.Screen name="EditCategory" component={EditCategoryScreen} />
            <FinanceStack.Screen name="Booking" component={BookingDetailsScreen} />
            <FinanceStack.Screen name="CreateBooking" component={CreateBookingScreen} />
        </FinanceStack.Navigator>
    );
}

const TaskStack = createStackNavigator();
const TaskStackNavigator = () => {
    return (
        <TaskStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            {/* <TaskStack.Screen name="Calendar" component={CalendarScreen} /> */}
            <TaskStack.Screen name="TaskScreen" component={TaskScreen} />
            <TaskStack.Screen name="CreateTaskBoard" component={CreateTaskBoardScreen} />
            <TaskStack.Screen name="CreateTask" component={CreateTaskScreen} />
        </TaskStack.Navigator>
    );
};

const MainTabNavigation = createMaterialTopTabNavigator();
export const MainTabNavigator = () => {
    if (Platform.OS === 'web') {
        return (
            <MainTabNavigation.Navigator>
                <MainTabNavigation.Screen name="Calendar" component={CalendarScreen} />
                <MainTabNavigation.Screen name="Tasks" component={TaskStackNavigator} />
            </MainTabNavigation.Navigator>
        );
    } else {
        return (
            <MainTabNavigation.Navigator>
                <MainTabNavigation.Screen name="Finance" component={FinanceStackNavigator} />
                <MainTabNavigation.Screen name="Tasks" component={TaskStackNavigator} />
                <MainTabNavigation.Screen name="Calendar" component={CalendarScreen} />
            </MainTabNavigation.Navigator>
        );
    }
};

const MainDrawerNavigator = createStackNavigator();
export const MainNavigator = () => {
    return (
        <MainDrawerNavigator.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <MainDrawerNavigator.Screen name="Home" component={HomeScreen} />
            <MainDrawerNavigator.Screen name="Main" component={MainTabNavigator} />
        </MainDrawerNavigator.Navigator>
    );
};

