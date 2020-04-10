import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BookingItem = props => {
    return (
        <TouchableOpacity
            onPress={() => {
                props.showBooking(props.id);
            }}
        >
            <Text>{props.name} {props.value}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

});

export default BookingItem;
