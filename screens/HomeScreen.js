import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import * as taskActions from '../store/actions/tasks';
import * as financeActions from '../store/actions/finances';

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
        return (
            <View style={styles.screen}>
                <Text>HomeScreen</Text>
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                        props.navigation.navigate('Finance')
                    }}
                >
                    <Text style={{ fontSize: 32 }}>Finanzen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                        props.navigation.navigate('Tasks')
                    }}
                >
                    <Text style={{ fontSize: 32 }}>Tasks</Text>
                </TouchableOpacity>
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
