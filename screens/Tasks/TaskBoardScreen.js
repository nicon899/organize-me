import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Task from '../../models/task';
import TaskBoard from '../../models/taskboard';
import TaskItem from '../../components/Tasks/TaskItem';
import TextItem from '../../components/TextItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const USERNAME = 'Nico';


const TaskBoardScreen = props => {
    const [taskBoard, setTaskBoard] = useState(new TaskBoard('-1', 'Default'));
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${taskBoard.id}/Tasks`).on('value', function (snapshot) {
            const loadedTasks = [];
            snapshot.forEach(function (childSnapshot) {
                loadedTasks.push(
                    new Task(childSnapshot.key, childSnapshot.child('name').val(), new Date(childSnapshot.child('date').val()), new Date(childSnapshot.child('deadline').val()), childSnapshot.child('status').val()),
                )
            });
            setTasks(loadedTasks);
        });
        return () => { firebase.database().ref(`${USERNAME}/TaskManager/${taskBoard.id}/Tasks`).off() };
    }, [])

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('CreateTask', {
                            id: taskBoard.id, editMode: false,
                        });
                    }}
                >
                    <MaterialCommunityIcons name="plus" size={36} color="#00FF00" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {tasks.map((item, index) =>
                    <TaskItem task={item} taskBoardId={taskBoard.id} />)}
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});

export default TaskBoardScreen;
