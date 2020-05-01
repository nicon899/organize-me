import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator, } from '@react-navigation/material-top-tabs';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

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
            <TaskStack.Screen name="TaskScreen" component={TaskScreen} />
            <TaskStack.Screen name="CreateTaskBoard" component={CreateTaskBoardScreen} />
            <TaskStack.Screen name="CreateTask" component={CreateTaskScreen} />
        </TaskStack.Navigator>
    );
};


const CalendarStack = createStackNavigator();
const CalendarStackNavigator = () => {
    return (
        <CalendarStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <CalendarStack.Screen name="CalendarScreen" component={CalendarScreen} />
            <CalendarStack.Screen name="CreateTask" component={CreateTaskScreen} />
        </CalendarStack.Navigator>
    );
};

const Tab = createMaterialTopTabNavigator();
export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Feed"
            tabBarPosition='bottom'
            tabBarOptions={{
                showIcon: true,
                showLabel: false,
                activeTintColor: '#80F00F',
                inactiveTintColor: '#FFFFFF',
                indicatorStyle: {backgroundColor: 'transparent'},
                labelStyle: { fontSize: 12 },
                style: { backgroundColor: '#000010'},
            }}
        >
            <Tab.Screen
                name="Feed"
                component={FinanceStackNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="attach-money" color={color} size={32} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={TaskStackNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="tasks" color={color} size={28} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={CalendarStackNavigator}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="md-calendar" color={color} size={30} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
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

