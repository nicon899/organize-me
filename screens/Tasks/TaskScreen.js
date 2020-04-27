import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Picker, Modal, Platform, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import TaskItem from '../../components/Tasks/TaskItem';
import TextItem from '../../components/TextItem';
import MyPicker from '../../components/Tasks/TaskBoardPicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

const TaskLoadingScreen = props => {
    const taskBoards = useSelector(state => state.tasks.taskboards);
    const [taskBoard, setTaskBoard] = useState(taskBoards[0]);
    const [sortBy, setSortBy] = useState('Date ASC');
    const [showTasksOpen, setShowTasksOpen] = useState(true);
    const [showTasksInProgress, setShowTasksInProgress] = useState(true);
    const [showTasksDone, setShowTasksDone] = useState(false);
    const [showDayOfWeek, setShowDayOfWeek] = useState(true);
    const [showFilterModal, setShowFilterModal] = useState(false);

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

    const sortByNameASC = (a, b) => {
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    }

    const sortByNameDESC = (a, b) => {
        return a.name < b.name ? 1 : a.name === b.name ? 0 : -1;
    }

    const sortByDateASC = (a, b) => {
        return a.date > b.date ? 1 : a.date < b.date ? -1 : a.deadline > b.deadline ? 1 : a.deadline < b.deadline ? -1 : 0;
    }

    const sortByDateDESC = (a, b) => {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : a.deadline < b.deadline ? 1 : a.deadline > b.deadline ? -1 : 0;
    }

    const sortByDeadlineASC = (a, b) => {
        return a.deadline > b.deadline ? 1 : a.deadline < b.deadline ? -1 : a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
    }

    const sortByDeadlineDESC = (a, b) => {
        return a.deadline < b.deadline ? 1 : a.deadline > b.deadline ? -1 : a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    }


    const sort = (a, b) => {
        switch (sortBy) {
            case 'Name ASC':
                return sortByNameASC(a, b);
            case 'Name DESC':
                return sortByNameDESC(a, b);
            case 'Date ASC':
                return sortByDateASC(a, b);
            case 'Date DESC':
                return sortByDateDESC(a, b);
            case 'Deadline ASC':
                return sortByDeadlineASC(a, b);
            case 'Deadline DESC':
                return sortByDeadlineDESC(a, b);
        }
    }

    return (
        <View style={styles.screen}>
            {Platform.OS != 'web' && <Modal
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
                                style={{ width: '100%', alignItems: 'center', backgroundColor: showDayOfWeek ? '#40FFAA80' : '#00000000' }}
                                onPress={() => setShowDayOfWeek(!showDayOfWeek)}>
                                <TextItem fontSize={26}>Show Day of Week</TextItem>
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
            </Modal>}

            <View style={styles.header}>
                {taskBoards.length > 0 && <MyPicker
                    style={styles.picker}
                    data={taskBoards}
                    presetItemId={taskBoards[0].id}
                    onValueChange={(taskBoard) => setTaskBoard(taskBoard)}
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
                    onValueChange={(itemValue, itemIndex) => {
                        setSortBy(itemValue);
                    }}>
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
            {taskBoard && <FlatList
                data={(taskBoard.tasks.filter((task) => filter(task)).sort((a, b) => sort(a, b)))}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <TaskItem key={itemData.item.id} editTask={(task) => editTask(task)} task={itemData.item} taskBoardId={taskBoard.id} showDayOfWeek={showDayOfWeek} />
                )}
            />}
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


export default TaskLoadingScreen;