import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BookingItem = props => {
    return (
        <TouchableOpacity
            onPress={() => {
                props.showBooking(props.id);
            }}>

            <View style={styles.item}>
                <Text style={{ color: 'white' }}>{props.name} {props.value}</Text>
                <Text style={{ color: 'white' }}>{""
                    + (props.date.getDate() < 10 ? "0" + props.date.getDate() : props.date.getDate()) + "."
                    + (props.date.getMonth() < 9 ? "0" + (props.date.getMonth() + 1) : (props.date.getMonth() + 1)) + "."
                    + props.date.getFullYear()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    }
});

export default BookingItem;
