import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useDispatch } from 'react-redux';
import DatePicker from '../../components/DatePicker';
import TextItem from '../../components/TextItem';
import DurationPicker from '../../components/Tasks/DurationPicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as taskActions from '../../store/actions/tasks';


const CreateTaskScreen = props => {
    const [name, setName] = useState(props.route.params.editMode ? props.route.params.name : '');
    const [date, setDate] = useState(props.route.params.date ? new Date(props.route.params.date) : new Date());
    const [deadline, setDeadline] = useState(props.route.params.deadline ? new Date(props.route.params.deadline) : new Date());
    const [withDuratation, setWithDuration] = useState(props.route.params.withDuration);
    const [duration, setDuration] = useState(props.route.params.duration ? props.route.params.duration : -1);

    const dispatch = useDispatch();

    const deleteTask = () => {
        dispatch(taskActions.deleteTask(props.route.params.taskId, props.route.params.id));
        leaveScreen();
    };

    const leaveScreen = () => {
        if (props.route.params.close) {
            props.close();
        } else {
            props.navigation.goBack();
        }
    }

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

            <View style={{ marginHorizontal: '12.5%', width: '75%', marginBottom: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextItem fontSize={26} style={{ color: 'white', fontWeight: 'bold' }}>Date: </TextItem>
                <Switch
                    onValueChange={() => {
                        if (withDuratation) {
                            setDuration(-1);
                            date.setHours(0, 0, 0, 0);
                        } else {
                            date.setHours(10, 0, 0, 0);
                            setDuration(90)
                        }
                        setWithDuration(!withDuratation);
                    }}
                    value={withDuratation}
                    trackColor={{ false: "#777777", true: "#81b0ff" }}
                    thumbColor='white'
                />
            </View>
            <DatePicker
                style={styles.dateInput}
                date={date}
                setDate={setDate}
                setTime={withDuratation}
            />
            {withDuratation && <DurationPicker
                duration={duration}
                start={(date.getHours() * 60) + (date.getMinutes() - (date.getMinutes() % 15))}
                setDuration={(duration) => setDuration(duration)}
                setStart={(start) => {
                    date.setHours(0, start, 0, 0);
                }}
            />}

            <TextItem fontSize={26} style={{ color: 'white', marginHorizontal: '12.5%', width: '75%', marginBottom: 10, fontWeight: 'bold' }}>Deadline:</TextItem>
            <DatePicker
                style={styles.dateInput}
                date={deadline}
                setDate={setDeadline}
                setTime={withDuratation}
            />

            <View style={{ width: '80%', height: '10%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 50 }}>
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center', padding: 15, width: '30%', height: '50%' }}
                    onPress={() => {
                        leaveScreen();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'green', borderRadius: 5, alignItems: 'center', justifyContent: 'center', padding: 15, width: '30%', height: '50%' }}
                    onPress={() => {
                        if (duration === -1) {
                            date.setHours(0, 0, 0, 0)
                        }
                        if (props.route.params.editMode) {
                            dispatch(taskActions.editTask(props.route.params.taskId, name, date, deadline, duration, props.route.params.id))
                        } else {
                            dispatch(taskActions.addTask(name, date, deadline, duration, 'Open', props.route.params.id));
                        }
                        leaveScreen();
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
