import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';


const CreateTaskBoardScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>CreateTaskBoardScreen</Text>
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

export default CreateTaskBoardScreen;
