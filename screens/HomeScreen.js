import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import * as financeActions from '../store/actions/finances';

const HomeScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        console.log('dispatch: useEffecht')
        dispatch(financeActions.fetchFinanceData());
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <Text>HomeScreen</Text>
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

export default HomeScreen;
