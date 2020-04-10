import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Platform, ToastAndroid, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as financeActions from '../../store/actions/finances';
import DatePicker from '../../components/DatePicker';
import { AntDesign } from '@expo/vector-icons';

const CreateBookingScreen = props => {
    const [name, setName] = useState(props.route.params.editMode ? props.route.params.name : '');
    const [value, setValue] = useState(props.route.params.editMode ? props.route.params.value > 0 ? props.route.params.value.toString() : (props.route.params.value * -1).toString() : '');
    const [details, setDetails] = useState(props.route.params.editMode ? props.route.params.details : '');
    const [date, setDate] = useState(props.route.params.editMode ? props.route.params.date : new Date());
    const [isPositive, setIsPositive] = useState(props.route.params.value > 0);
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

            <View style={styles.valueInput}>
                <TouchableOpacity
                    style={{ width: '25%', alignItems: 'center' }}
                    onPress={() => setIsPositive(!isPositive)}   >
                    {isPositive && <AntDesign style={{ marginRight: '10%' }} name="pluscircle" size={32} color="green" />}
                    {!isPositive && <AntDesign style={{ marginRight: '10%' }} name="minuscircle" size={32} color="red" />}
                </TouchableOpacity>
                <TextInput
                    style={[styles.input, { width: '75%' }]}
                    placeholder='Value'
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    keyboardType='number-pad'
                    onChangeText={(input) => setValue(input)}
                />
            </View>


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
                            dispatch(financeActions.updateBooking(props.route.params.id, name, isPositive ? value : -1 * value, details, date, props.route.params.categoryId)) :
                            dispatch(financeActions.addBooking(name, isPositive ? value : -1 * value, details, date, props.route.params.categoryId));
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
    },
    valueInput: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'spa',
        width: '75%'
    }
});

export default CreateBookingScreen;
