import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const USERNAME = 'Nico';


const CreateTaskBoardScreen = props => {
    const [name, setName] = useState(props.route.params.editMode ? props.route.params.name : '');
    
    const deleteTaskBoard = () => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/TaskManager/${props.route.params.id}`).remove();
        props.navigation.goBack();
    };

    return (
        <View style={[styles.screen, { justifyContent: props.route.params.editMode ? 'flex-start' : 'center' }]}>

            {props.route.params.editMode && <TouchableOpacity
                style={{ marginBottom: '40%', width: '100%', alignItems: 'flex-end', paddingRight: 10, paddingTop: 10 }}
                onPress={() => deleteTaskBoard()}            >
                <MaterialCommunityIcons style={{ marginLeft: 8 }} name="delete" size={36} color="red" />
            </TouchableOpacity>}

            <Text style={{ color: 'white', marginBottom: 10, fontWeight: 'bold', fontSize: 32 }}>{props.route.params.editMode ? 'Edit TaskBoard' : 'Create TaskBoard'}</Text>

            <TextInput
                placeholder='Name'
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
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
                        const firebase = require("firebase");
                        if (!firebase.apps.length) {
                            firebase.initializeApp({
                                databaseURL: "https://organize-me-private.firebaseio.com/",
                                projectId: "organize-me-private",
                            });
                        }
                        if (props.route.params.editMode) {
                            firebase.database().ref(`${USERNAME}/TaskManager/${props.route.params.id}`).update({
                                name: name,
                            });
                        } else {
                            firebase.database().ref(`${USERNAME}/TaskManager`).push({
                                name,
                            });
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
