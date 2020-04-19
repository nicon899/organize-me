import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DatePicker from '../../components/DatePicker';
import TextItem from '../../components/TextItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const USERNAME = 'Nico';


const CreateTaskScreen = props => {
    const [name, setName] = useState(props.route.params.editMode ? props.route.params.name : '');
    const [date, setDate] = useState(props.route.params.editMode ? new Date(props.route.params.date) : new Date());
    const [deadline, setDeadline] = useState(props.route.params.editMode ? new Date(props.route.params.deadline) : new Date());

    const deleteTask = () => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${props.route.params.id}/Tasks/${props.route.params.taskId}`).remove();
        props.navigation.goBack();
    };

    return (
        <View style={styles.screen}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 50, }}
            >
                <TextItem fontSize={48} style={{ color: 'white', fontWeight: 'bold', }}>{props.route.params.editMode ? 'Edit Task' : 'New Task'}</TextItem>

                {props.route.params.editMode && <TouchableOpacity
                    onPress={() => deleteTask()}            >
                    <MaterialCommunityIcons style={{ marginLeft: 8 }} name="delete" size={36} color="red" />
                </TouchableOpacity>}
            </View>

            <TextInput
                placeholder='Name'
                style={[styles.input, { marginBottom: 25 }]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />

            <TextItem fontSize={26} style={{ color: 'white', marginHorizontal: '12.5%', width: '75%', marginBottom: 10, fontWeight: 'bold' }}>Date:</TextItem>
            <DatePicker
                style={styles.dateInput}
                date={date}
                setDate={setDate}
            />

            <TextItem fontSize={26} style={{ color: 'white', marginHorizontal: '12.5%', width: '75%', marginBottom: 10, fontWeight: 'bold' }}>Deadline:</TextItem>
            <DatePicker
                style={styles.dateInput}
                date={deadline}
                setDate={setDeadline}
            />

            <View style={{ width: '80%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 50 }}>
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
                        date.setHours(0, 0, 0, 0);
                        deadline.setHours(0, 0, 0, 0);
                        const firebase = require("firebase");
                        if (!firebase.apps.length) {
                            firebase.initializeApp({
                                databaseURL: "https://organize-me-private.firebaseio.com/",
                                projectId: "organize-me-private",
                            });
                        }
                        if (props.route.params.editMode) {
                            firebase.database().ref(`${USERNAME}/TaskManager/${props.route.params.id}/Tasks/${props.route.params.taskId}`).update({
                                name,
                                date: date.toString(),
                                deadline: deadline.toString(),
                                status: 'Open'
                            });
                        } else {
                            firebase.database().ref(`${USERNAME}/TaskManager/${props.route.params.id}/Tasks`).push({
                                name,
                                date: date.toString(),
                                deadline: deadline.toString(),
                                status: 'Open'
                            });
                        }
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'green' }}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50
    },
    input: {
        width: '75%',
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
    },
    dateInput: {
        width: '75%',
        marginBottom: 25
    }
});

export default CreateTaskScreen;
