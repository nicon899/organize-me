import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import TextItem from '../../components/TextItem';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const USERNAME = 'Nico';

const TaskItem = props => {

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

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
        props.firebase.database().ref(`${USERNAME}/TaskManager/${props.taskBoardId}/Tasks/${props.task.id}`).update({
            status: newStatus
        });
    }

    return (
        <TouchableOpacity
            onLongPress={() => props.editTask(props.task)}
        >
            <View style={styles.screen}>
                <TouchableOpacity
                    style={{ marginHorizontal: 10 }}
                    onPress={() => changeStatus()}>
                    {props.task.status === 'Open' && <FontAwesome5 name="tasks" size={scaleFontSize(48)} color="#0080FF" />}
                    {props.task.status === 'InProgress' && <FontAwesome5 name="tasks" size={scaleFontSize(48)} color="yellow" />}
                    {props.task.status === 'Done' && <FontAwesome5 name="tasks" size={scaleFontSize(48)} color="green" />}
                </TouchableOpacity>
                <TextItem fontSize={20} style={{ color: 'white', flex: 1 }}>{props.task.name}</TextItem>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 }}>
                    <TextItem fontSize={18} style={{ color: 'grey' }}>{""
                        + (props.task.date.getDate() < 10 ? "0" + props.task.date.getDate() : props.task.date.getDate()) + "."
                        + (props.task.date.getMonth() < 9 ? "0" + (props.task.date.getMonth() + 1) : (props.task.date.getMonth() + 1)) + "."
                        + props.task.date.getFullYear()}</TextItem>

                    <TextItem fontSize={18} style={{ color: 'red' }}>{""
                        + (props.task.deadline.getDate() < 10 ? "0" + props.task.deadline.getDate() : props.task.deadline.getDate()) + "."
                        + (props.task.deadline.getMonth() < 9 ? "0" + (props.task.deadline.getMonth() + 1) : (props.task.deadline.getMonth() + 1)) + "."
                        + props.task.deadline.getFullYear()}</TextItem>
                </View>
            </View>
        </TouchableOpacity>
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
