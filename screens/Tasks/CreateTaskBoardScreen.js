import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
const USERNAME = 'Nico';


const CreateTaskBoardScreen = props => {
    const [name, setName] = useState('');

    return (
        <View style={styles.screen}>
            <Text style={{ color: 'white', marginBottom: 10, fontWeight: 'bold', fontSize: 32 }}>Create TaskBoard</Text>
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

                        firebase.database().ref(`${USERNAME}/TaskManager`).push({
                            name,
                        }).then((data) => {
                            //success callback
                        }).catch((error) => {
                            //error callback
                        });
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'green' }}>ADD</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
