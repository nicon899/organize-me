import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux'

const BookingDetailScreen = props => {
    const booking = useSelector(state => state.finances.bookings).find((booking) => booking.id === props.route.params.id);

    return (
        <View style={styles.screen}>
            <Button
                title="Edit"
                onPress={() => {
                    props.navigation.navigate('CreateBooking', {
                        editMode: true,
                        categoryId: booking.categoryId,
                        name: booking.name,
                        id: booking.id,
                        value: booking.value,
                        date: booking.date,
                        details: booking.details
                    });
                }}
            />
            <Text>Name: {booking.name}</Text>
            <Text>Value: {booking.value}</Text>
            <Text>Date: {
                "" + (booking.date.getDate() < 10 ? "0" + booking.date.getDate() : booking.date.getDate()) + "."
                + (booking.date.getMonth() < 9 ? "0" + (booking.date.getMonth() + 1) : (booking.date.getMonth() + 1)) + "."
                + booking.date.getFullYear()}</Text>
            <Text>Details: {booking.details}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default BookingDetailScreen;
