import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import TextItem from '../../components/TextItem';
import { FontAwesome5 } from '@expo/vector-icons';
import * as taskActions from '../../store/actions/tasks';


const TaskItem = props => {
    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    const dispatch = useDispatch();

    const days = [
        'So',
        'Mo',
        'Di',
        'Mi',
        'Do',
        'Fr',
        'Sa'
    ];

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

    const getDateString = (date) => {
        return ""
            + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "."
            + (date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "."
            + date.getFullYear()
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => props.editTask(props.task)}
        >
            <View style={styles.screen}>
                {props.task.status != 'imported' && <TouchableOpacity
                    style={{ marginHorizontal: 10 }}
                    onLongPress={() => changeStatus()}>
                    {props.task.status === 'Open' && <FontAwesome5 name="tasks" size={scaleFontSize(48)} color={props.task.duration > 0 ? "#0080FF" : "#FF00FF"} />}
                    {props.task.status === 'InProgress' && <FontAwesome5 name="tasks" size={scaleFontSize(48)} color="yellow" />}
                    {props.task.status === 'Done' && <FontAwesome5 name="tasks" size={scaleFontSize(48)} color="green" />}
                </TouchableOpacity>}
                <TextItem fontSize={20} style={{ color: 'white', flex: 1 }}>{props.task.name}</TextItem>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 }}>
                    <TextItem fontSize={16} style={{ color: 'grey', width: '100%', fontWeight: 'bold' }}>
                        {props.showDayOfWeek && <TextItem fontSize={16} style={{ color: 'grey', width: '100%', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold' }}>{days[props.task.date.getDay()] + " "}</TextItem>}
                        {getDateString(props.task.date)}
                    </TextItem>
                    <TextItem fontSize={16} style={{ color: 'red', width: '100%' }}>
                        {props.showDayOfWeek && <TextItem fontSize={16} style={{ color: 'grey', width: '100%', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{days[props.task.deadline.getDay()] + " "}</TextItem>}
                        {getDateString(props.task.deadline)}
                    </TextItem>
                </View>
            </View>
        </TouchableWithoutFeedback>
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

export default TaskItem;
