import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as taskActions from '../../store/actions/tasks';

import * as FileSystem from 'expo-file-system';

const CreateTaskBoardScreen = props => {
    const [name, setName] = useState(props.route.params.editMode ? props.route.params.name : '');
    const [color, setColor] = useState(props.route.params.color ? props.route.params.color : 'blue');
    const [link, setLink] = useState(props.route.params.link ? props.route.params.link : null);
    const [showLink, setShowLink] = useState(props.route.params.link ? true : false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const dispatch = useDispatch();

    const deleteTaskBoard = () => {
        dispatch(taskActions.deleteTaskboard(props.route.params.id));
        props.navigation.goBack();
    };

    const callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress);
    };

    const downloadResumable = FileSystem.createDownloadResumable(
        link,
        FileSystem.documentDirectory + name + '.ics',
        {},
        callback
    );

    async function syncCalendar() {
        console.log('sync');
        try {
            const { uri } = await downloadResumable.resumeAsync();
            const response = await FileSystem.readAsStringAsync(uri, {});
            addEvents(response);
        } catch (e) {
            console.error(e);
        }
    }

    const addEvents = (myCalendarString) => {
        const ical = require('cal-parser');
        const parsed = ical.parseString(myCalendarString);
        dispatch(taskActions.deleteTaskboardTasks(props.route.params.id)).then(() => {
            const dayLimit = new Date(new Date().getTime() - 604800000);
            parsed.events.forEach((object) => {
                const name = object.summary.value + ` (${object.location ? object.location.value : ''})`;
                const dateStart = object.dtstart.value;
                const dateEnd = object.dtend.value;
                const duration = Math.ceil((dateEnd.getTime() - dateStart.getTime()) / 60000);
                if (dateStart > dayLimit) {
                    dispatch(taskActions.addTask(name, dateStart, dateStart, duration, 'imported', props.route.params.id))
                }
            });
        });
    }

    return (
        <View style={[styles.screen, { justifyContent: props.route.params.editMode ? 'flex-start' : 'center' }]}>
            {props.route.params.editMode && <TouchableOpacity
                style={{ width: '100%', alignItems: 'flex-end', paddingRight: 10, paddingTop: 10 }}
                onPress={() => deleteTaskBoard()}            >
                <MaterialCommunityIcons style={{ marginLeft: 8 }} name="delete" size={36} color="red" />
            </TouchableOpacity>}

            {props.route.params.editMode && showLink && <TouchableOpacity
                style={{ width: '100%', alignItems: 'center', paddingRight: 10, paddingTop: 10 }}
                onPress={() => syncCalendar()}            >
                <MaterialCommunityIcons style={{ marginLeft: 8 }} name="sync" size={48} color="grey" />
            </TouchableOpacity>}


            <Text style={{ color: 'white', marginBottom: 10, fontWeight: 'bold', fontSize: 32 }}>{props.route.params.editMode ? 'Edit Calendar' : 'Create Calendar'}</Text>

            <TextInput
                placeholder='Name'
                placeholderTextColor="white"
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />

            <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Link:</Text>

                {showLink && <TextInput
                    style={[styles.input, { flex: 1, marginHorizontal: 10 }]}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={link}
                    onChangeText={(input) => setLink(input)}
                />}
                <Switch
                    onValueChange={() => {
                        if (showLink) {
                            setLink(null);
                        }
                        setShowLink(!showLink);
                    }}
                    value={showLink}
                    trackColor={{ false: "#777777", true: "#81b0ff" }}
                    thumbColor='white'
                />
            </View>
            <TextInput
                placeholder='Color'
                placeholderTextColor="white"
                style={[styles.input, { backgroundColor: color }]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={color}
                onChangeText={(input) => setColor(input)}
            />

            <View style={{ width: '80%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center', padding: 15, width: '30%', height: '50%' }}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'green', borderRadius: 5, alignItems: 'center', justifyContent: 'center', padding: 15, width: '30%', height: '50%' }}
                    onPress={() => {
                        if (props.route.params.editMode) {
                            dispatch(taskActions.updateTaskboard(props.route.params.id, name, color, link));
                        } else {
                            dispatch(taskActions.addTaskboard(name, color, link));
                        }
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'green' }}>{props.route.params.editMode ? 'OK' : 'ADD'}</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'black'
    },
    input: {
        width: '80%',
        marginBottom: 20,
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white'
    },
});

export default CreateTaskBoardScreen;
