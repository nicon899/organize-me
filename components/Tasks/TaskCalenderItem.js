import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import TextItem from '../../components/TextItem';
import { FontAwesome5 } from '@expo/vector-icons';
import * as taskActions from '../../store/actions/tasks';

const TaskCalenderItem = props => {
    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    const dispatch = useDispatch();

    const changeStatus = () => {
        let newStatus;
        switch (props.task.status) {
            case 'Open': newStatus = 'InProgress';
                break;
            case 'InProgress': newStatus = 'Done';
                break;
            case 'Done': newStatus = 'Open';
                break;
        }
        dispatch(taskActions.editTaskStatus(props.task.id, newStatus, props.taskBoardId))
    }

    return (
    <TextItem fontSize={18}>{props.task.name}</TextItem>
    );
};

const styles = StyleSheet.create({
    screen: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginVertical: 4,
        justifyContent: 'space-between'
    }
});

export default TaskCalenderItem;
