import React, { useState } from 'react'
import { Button } from 'react-native';
import { TextInput } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import * as SecureStore from 'expo-secure-store';

const LogInScreen = props => {
    const [name, setName] = useState('');
    const [pwd, setPwd] = useState('');

    const write = async () => {
        try {
            await SecureStore.setItemAsync(
                'USERNAME',
                name
            );
            await SecureStore.setItemAsync(
                'PWD',
                pwd
            );
        } catch (e) {
            console.log(e);
        }
    }

    const check = async () => {
        const USERNAME = await SecureStore.getItemAsync('USERNAME');
        console.log(USERNAME);
        if (USERNAME) {
            props.navigation.navigate("Home");
        }
    }
    check();

    return (
        <View style={styles.screen}>
            <Text style={{ color: 'white', marginBottom: 25, fontSize: 52 }}>LOG IN</Text>
            <TextInput
                placeholder='Name'
                style={[styles.input, { marginBottom: 25 }]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />
            <TextInput
                placeholder='Password'
                style={[styles.input, { marginBottom: 25 }]}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={pwd}
                onChangeText={(input) => setPwd(input)}
            />
            <Button
                title="Log In"
                onPress={() => {
                    write();
                    props.navigation.navigate("Home")
                }}
            />
        </View>
    )
}

export default LogInScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '75%',
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white',
    },
})
