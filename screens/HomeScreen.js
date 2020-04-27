import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import * as taskActions from '../store/actions/tasks';
import * as financeActions from '../store/actions/finances';
import { MainTabNavigator } from '../navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';


const HomeScreen = props => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const loadFinance = useCallback(async () => {
        try {
            await dispatch(financeActions.fetchFinanceData());
        } catch (err) {
            console.log('TaskLoadingScreen/loadTask Error: ' + err);
        }
    }, [dispatch, setIsLoading]);

    const loadTasks = useCallback(async () => {
        try {
            await dispatch(taskActions.fetchTaskData());
        } catch (err) {
            console.log('TaskLoadingScreen/loadTask Error: ' + err);
        }
    }, [dispatch, setIsLoading]);

    useEffect(() => {
        loadTasks().then(() => {
            loadFinance().then(() => {
                setIsLoading(false);
            })
        });
    }, [dispatch, loadTasks]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, }}>
                <ActivityIndicator size="large" color='#FF00FF' />
            </View>
        );
    } else {
        props.navigation.reset({
            index: 0,
            routes: [
                {
                    name: 'Main',
                },
            ],
        }
        );
        return (
            <View style={styles.screen}>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default HomeScreen;
