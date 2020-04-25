import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

import * as taskActions from '../../store/actions/tasks';
import TaskBoardScreen from './TaskBoardScreen';

const TaskLoadingScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const loadTasks = useCallback(async () => {
        try {
            await dispatch(taskActions.fetchTaskData());
        } catch (err) {
            console.log('TaskLoadingScreen/loadTask Error: ' + err);
        }
    }, [dispatch, setIsLoading]);

    useEffect(() => {
        setIsLoading(true);
        loadTasks().then(() => {
            setIsLoading(false);
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
            <TaskBoardScreen />
        );
    }
};


export default TaskLoadingScreen;
