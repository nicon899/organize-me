import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const DatePicker = props => {

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    const [show, setShow] = useState(false);

    const dateText = ""
        + (props.date.getDate() < 10 ? "0" + props.date.getDate() : props.date.getDate()) + "."
        + (props.date.getMonth() < 9 ? "0" + (props.date.getMonth() + 1) : (props.date.getMonth() + 1)) + "."
        + props.date.getFullYear()

    return (
        <View style={[styles.datepicker, props.style]}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    let newDate = new Date(props.date.setDate(props.date.getDate() - 1));
                    props.setDate(newDate);
                }}
            >
                <Ionicons name="ios-arrow-back" size={32} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => setShow(true)}>
                <Ionicons style={{ marginRight: '10%' }} name="md-calendar" size={scaleFontSize(42)} color="#295184" />
                <Text style={{ color: 'white', fontSize: scaleFontSize(22), fontWeight: 'bold' }} >{dateText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    let newDate = new Date(props.date.setDate(props.date.getDate() + 1));
                    props.setDate(newDate);
                }}
            >
                <Ionicons name="ios-arrow-forward" size={32} color="white" />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={props.date}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                        setShow(false);
                        if (date != undefined) {
                            props.setDate(date);
                        }
                    }}
                />
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    datepicker: {
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});


export default DatePicker;
