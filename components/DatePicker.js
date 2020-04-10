import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const DatePicker = props => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);


    const dateText = ""
        + (props.date.getDate() < 10 ? "0" + props.date.getDate() : props.date.getDate()) + "."
        + (props.date.getMonth() < 9 ? "0" + (props.date.getMonth() + 1) : (props.date.getMonth() + 1)) + "."
        + props.date.getFullYear()


    return (
        <View style={[styles.datepicker, props.style]}>
            <TouchableOpacity style={styles.btn} onPress={() => setShow(true)}>
                <View style={{ marginRight: 15 }}>
                    <Ionicons name="md-calendar" size={32} color="black" />
                </View>
                <Text>{dateText}</Text>

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
        borderWidth: 1,
        borderColor: 'grey'
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 2
    }
});


export default DatePicker;
