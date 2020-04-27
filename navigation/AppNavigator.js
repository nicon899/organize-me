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

const TaskStack = createStackNavigator();
const TaskStackNavigator = () => {
    return (
        <TaskStack.Navigator
            screenOptions={{
                headerShown: Platform.OS === 'android' ? false : true
            }}>
            {/* <TaskStack.Screen name="Calendar" component={CalendarScreen} /> */}
            <TaskStack.Screen name="TaskScreen" component={Platform.OS === 'web' ? CalendarScreen : TaskScreen} />
            <TaskStack.Screen name="CreateTaskBoard" component={CreateTaskBoardScreen} />
            <TaskStack.Screen name="CreateTask" component={CreateTaskScreen} />
        </TaskStack.Navigator>
    );
};

// const MainDrawerNavigator = createDrawerNavigator();
// export const MainNavigator = () => {
//     return (
//         <MainDrawerNavigator.Navigator>
//             <MainDrawerNavigator.Screen name="Home" component={HomeScreen} />
//             <MainDrawerNavigator.Screen name="Finance" component={FinanceStackNavigator} />
//             <MainDrawerNavigator.Screen name="Tasks" component={TaskStackNavigator} />
//         </MainDrawerNavigator.Navigator>
//     );
// };

const MainDrawerNavigator = createMaterialTopTabNavigator();
export const MainNavigator = () => {
    return (
        <MainDrawerNavigator.Navigator>
            <MainDrawerNavigator.Screen name="Home" component={HomeScreen} />
            <MainDrawerNavigator.Screen name="Finance" component={FinanceStackNavigator} />
            <MainDrawerNavigator.Screen name="Tasks" component={TaskStackNavigator} />
        </MainDrawerNavigator.Navigator>
    );
};