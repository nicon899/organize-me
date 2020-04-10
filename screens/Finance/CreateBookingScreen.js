import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Platform, ToastAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as financeActions from '../../store/actions/finances';
import DatePicker from '../../components/DatePicker';

const CreateBookingScreen = props => {
    const [name, setName] = useState(props.route.params.editMode ? props.route.params.name : '');
    const [value, setValue] = useState(props.route.params.editMode ? props.route.params.value.toString() : '');
    const [details, setDetails] = useState(props.route.params.editMode ? props.route.params.details : '');
    const [date, setDate] = useState(props.route.params.editMode ? props.route.params.date : new Date());
    const categories = useSelector(state => state.finances.categories);
    const accounts = useSelector(state => state.finances.accounts);
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

            <DatePicker
                style={styles.dateInput}
                date={date}
                setDate={setDate}
            />

            <TextInput
                placeholder='Value'
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                keyboardType='number-pad'
                onChangeText={(input) => setValue(input)}
            />
            <TextInput
                placeholder='Details'
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                value={details}
                onChangeText={(input) => setDetails(input)}
            />

            <Button
                title='OK'
                onPress={() => {
                    if (/^[0-9]+(\.[0-9]{1,2})?$/g.test(value)) {
                        date.setHours(0, 0, 0, 0);
                        props.route.params.editMode ?
                            dispatch(financeActions.updateBooking(props.route.params.id, name, value, details, date, props.route.params.categoryId)) :
                            dispatch(financeActions.addBooking(name, value, details, date, props.route.params.categoryId));
                        props.navigation.goBack();
                    } else {
                        switch (Platform.OS) {
                            case 'android': ToastAndroid.show('Please enter a valid Value!', ToastAndroid.SHORT)
                                break;
                            case 'web': alert('Please enter a valid Value');
                                break;
                            default: Alert.alert('Invalid Value!', 'Please enter a valid Value');
                        }

                    }
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
        justifyContent: 'center',
    },
    input: {
        width: '75%',
        marginVertical: 5,
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1
    },
    picker: {
        height: 25,
        width: '100%',
        padding: 10,
    },
    dateInput: {
        width: '75%',
    }
});

export default CreateBookingScreen;
