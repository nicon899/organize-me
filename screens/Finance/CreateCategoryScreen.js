import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import * as financeActions from '../../store/actions/finances';

const CreateCategoryScreen = props => {
    const [name, setName] = useState('');
    const dispatch = useDispatch();

    return (
        <View style={styles.screen}>
            <TextInput
                placeholder='Name'
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={name}
                onChangeText={(input) => setName(input)}
            />
            <Button
                title='OK'
                onPress={() => {
                    dispatch(financeActions.addCategory(name, props.route.params.index, props.route.params.categoryId));
                    props.navigation.goBack();
                }} />
            <Button
                title='Cancel'
                onPress={() => { props.navigation.goBack() }} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: '50%',
        marginVertical: 5,
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1
    },
});

export default CreateCategoryScreen;
