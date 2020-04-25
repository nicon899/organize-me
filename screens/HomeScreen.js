import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import * as financeActions from '../store/actions/finances';

const HomeScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(financeActions.fetchFinanceData());
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <Text>HomeScreen</Text>
            <TouchableOpacity
                style={{}}
                onPress={() => {
                    props.navigation.navigate('Finance')
                }}
            >
                <Text style={{ fontSize: 32 }}>Finanzen</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{}}
                onPress={() => {
                    props.navigation.navigate('Tasks')
                }}
            >
                <Text style={{ fontSize: 32 }}>Tasks</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
});

export default HomeScreen;
