import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import * as taskActions from '../store/actions/tasks';
import * as financeActions from '../store/actions/finances';
import { useSelector } from 'react-redux';

const HomeScreen = props => {
    const dispatch = useDispatch();
    const loadedFinanceData = useSelector(state => state.finances.loaded);

    const loadFinance = useCallback(() => {
        try {
            dispatch(financeActions.fetchFinanceData());
        } catch (err) {
            console.log('TaskLoadingScreen/loadTask Error: ' + err);
        }
    }, [dispatch]);

    const loadTasks = useCallback(() => {
        try {
            dispatch(taskActions.fetchTaskData());
        } catch (err) {
            console.log('TaskLoadingScreen/loadTask Error: ' + err);
        }
    }, [dispatch]);

    useEffect(() => {
        loadTasks()
        loadFinance();
    }, [dispatch, loadTasks]);

    if (!loadedFinanceData) {
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
