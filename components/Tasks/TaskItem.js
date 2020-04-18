import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const TaskItem = props => {
    return (
        <View style={styles.screen}>
            <Text>{props.task.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
    }
});

export default TaskItem;
