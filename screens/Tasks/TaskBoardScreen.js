import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Picker, CheckBox, Modal } from 'react-native';
import Task from '../../models/task';
import TaskBoard from '../../models/taskboard';
import TaskItem from '../../components/Tasks/TaskItem';
import TextItem from '../../components/TextItem';
import MyPicker from '../../components/Tasks/TaskBoardPicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const USERNAME = 'Nico';

const TaskBoardScreen = props => {
    const [taskBoard, setTaskBoard] = useState(new TaskBoard('-1', 'Default'));
    const [tasks, setTasks] = useState([]);
    const [taskBoards, setTaskBoards] = useState([]);
    const [sortBy, setSortBy] = useState('Date ASC');
    const [showTasksOpen, setShowTasksOpen] = useState(true);
    const [showTasksInProgress, setShowTasksInProgress] = useState(true);
    const [showTasksDone, setShowTasksDone] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const firebase = require("firebase");
    if (!firebase.apps.length) {
        firebase.initializeApp({
            databaseURL: "https://organize-me-private.firebaseio.com/",
            projectId: "organize-me-private",
        });
    }

    const sort = (a, b) => {
        switch (sortBy) {
            case 'Name ASC':
                return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
            case 'Name DESC':
                return a.name < b.name ? 1 : a.name === b.name ? 0 : -1;
            case 'Date ASC':
                return a.date > b.date ? 1 : a.date === b.date ? 0 : -1;
            case 'Date DESC':
                return a.date < b.date ? 1 : a.date === b.date ? 0 : -1;
            case 'Deadline ASC':
                return a.deadline > b.deadline ? 1 : a.deadline === b.deadline ? 0 : -1;
            case 'Deadline DESC':
                return a.deadline < b.deadline ? 1 : a.deadline === b.deadline ? 0 : -1;
        }
    }

    const filter = (task) => {
        switch (task.status) {
            case 'Open':
                return showTasksOpen;
            case 'InProgress':
                return showTasksInProgress;
            case 'Done':
                return showTasksDone;
        }
    }

    const loadTasks = () => {
        console.log('loadTasks');
        firebase.database().ref(`${USERNAME}/TaskManager/${taskBoard.id}/Tasks`).once('value', function (snapshot) {
            const loadedTasks = [];
            snapshot.forEach(function (childSnapshot) {
                loadedTasks.push(
                    new Task(childSnapshot.key, childSnapshot.child('name').val(), new Date(childSnapshot.child('date').val()), new Date(childSnapshot.child('deadline').val()), childSnapshot.child('status').val()),
                )
            });
            setTasks(loadedTasks);
        })
    }

    const editTask = (task) => {
        props.navigation.navigate('CreateTask', {
            id: taskBoard.id,
            taskId: task.id,
            name: task.name,
            date: task.date.toString(),
            deadline: task.deadline.toString(),
            editMode: true,
        });
    }

    useEffect(() => {
        firebase.database().ref(`${USERNAME}/TaskManager`).on('value', function (snapshot) {
            const loadedTaskBoards = [];
            snapshot.forEach(function (childSnapshot) {
                loadedTaskBoards.push(
                    new TaskBoard(childSnapshot.key, childSnapshot.child('name').val()),
                )
            });
            setTaskBoards(loadedTaskBoards);
            if (loadedTaskBoards.length > 0) {
                setTaskBoard(loadedTaskBoards[0]);
            } else {
                props.navigation.navigate('CreateTaskBoard', {
                    id: taskBoard.id, editMode: false,
                });
            }
        });
        return () => {
            firebase.database().ref(`${USERNAME}/TaskManager`).off()
        };
    }, [])

    useEffect(() => {
        loadTasks();
    }, [taskBoard])

    return (
        <View style={styles.screen}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={showFilterModal}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        width: '60%',
                    }}>
                        <View>
                            <TouchableOpacity
                                style={{ width: '100%', alignItems: 'center', backgroundColor: showTasksOpen ? '#40FFAA80' : '#00000000' }}
                                onPress={() => setShowTasksOpen(!showTasksOpen)}>
                                <TextItem fontSize={26} >Open</TextItem>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: '100%', alignItems: 'center', backgroundColor: showTasksInProgress ? '#40FFAA80' : '#00000000' }}
                                onPress={() => setShowTasksInProgress(!showTasksInProgress)}>
                                <TextItem fontSize={26}>In Progress</TextItem>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: '100%', alignItems: 'center', backgroundColor: showTasksDone ? '#40FFAA80' : '#00000000' }}
                                onPress={() => setShowTasksDone(!showTasksDone)}>
                                <TextItem fontSize={26}>Done</TextItem>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ width: '100%', alignItems: 'flex-end', padding: 10 }}
                                onPress={() => {
                                    setShowFilterModal(false);
                                }}>
                                <TextItem fontSize={18} style={{ color: 'grey' }}>Close</TextItem>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.header}>
                {taskBoards.length > 0 && <MyPicker
                    style={styles.picker}
                    data={taskBoards}
                    presetItemId={taskBoards[0].id}
                    onValueChange={(taskBoard) => { setTaskBoard(taskBoard); }}
                    createBoard={() => {
                        props.navigation.navigate('CreateTaskBoard', {
                            editMode: false,
                        });
                    }}
                    editTaskBoard={(taskBoard) => {
                        props.navigation.navigate('CreateTaskBoard', {
                            id: taskBoard.id, name: taskBoard.name, editMode: true,
                        });
                    }}
                />}

                <TouchableOpacity
                    style={{ width: '20%' }}
                    onPress={() => {
                        setShowFilterModal(true);
                    }}
                >
                    <TextItem fontSize={20} style={{ color: 'grey' }}>Filter</TextItem>
                </TouchableOpacity>

            </View>
            <View style={styles.configBar}>

                <Picker
                    selectedValue={sortBy}
                    style={{ height: 50, color: 'grey', flex: 1 }}
                    onValueChange={(itemValue, itemIndex) => setSortBy(itemValue)}>
                    <Picker.Item label="Name ASC" value="Name ASC" />
                    <Picker.Item label="Name DESC" value="Name DESC" />
                    <Picker.Item label="Date ASC" value="Date ASC" />
                    <Picker.Item label="Date DESC" value="Date DESC" />
                    <Picker.Item label="Deadline ASC" value="Deadline ASC" />
                    <Picker.Item label="Deadline DESC" value="Deadline DESC" />
                </Picker>


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
                {tasks.filter((task) => filter(task)).sort((a, b) => sort(a, b)).map((item, index) =>
                    <TaskItem editTask={(task) => editTask(task)} task={item} taskBoardId={taskBoard.id} firebase={firebase} />)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black'
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        maxHeight: '30%',
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 4,
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    picker: {
        marginHorizontal: 10,
        maxHeight: '90%',
        flex: 1,
    },
    configBar: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    }
});

export default TaskBoardScreen;
