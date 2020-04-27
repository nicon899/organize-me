import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

import CalenderDay from '../../components/Tasks/CalenderDay';
import TextItem from '../../components/TextItem';


const CalendarScreen = props => {
    const tboard = useSelector(state => state.tasks.taskboards)[0];
    const calendarDays = [];
    const [startDate, setStartDate] = useState(new Date());
    const [dateRange, setDateRange] = useState(Platform.OS === 'web' ? 5 : 2);
    const [focused, setIsFocused] = useState(false);

    const days = [
        'So',
        'Mo',
        'Di',
        'Mi',
        'Do',
        'Fr',
        'Sa',
    ];

    const dayWidth = Math.ceil(Math.floor((Dimensions.get('window').width - 50) / dateRange));

    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            console.log('Focus');
            setIsFocused(true);
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setIsFocused(false);
            };
        }, [])
    );

    const editTask = (task) => {
        props.navigation.navigate('CreateTask', {
            id: tboard.id,
            taskId: task.id,
            name: task.name,
            date: task.date,
            deadline: task.deadline.toString(),
            editMode: true,
        });
    }

    const isSameDay = (dateA, dateB) => (dateA.getDate() === (dateB.getDate())
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getFullYear() === dateB.getFullYear());

    const calenderDayNames = [];
    const dayName = new Date(startDate);
    dayName.setHours(0, 0, 0, 0);
    for (let i = 0; i < dateRange; i++) {
        calenderDayNames.push(
            <TextItem fontSize={28} style={{ color: 'white', textAlign: 'center', width: dayWidth }}>{days[dayName.getDay()]}</TextItem>
        );
        dayName.setHours(24, 0, 0, 0);
    }

    if (tboard) {
        const day = new Date(startDate);
        day.setHours(0, 0, 0, 0);
        for (let i = 0; i < dateRange; i++) {
            const tasksOfDay = tboard.tasks.filter((task) => isSameDay(task.date, day)).sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : a.deadline > b.deadline ? 1 : a.deadline < b.deadline ? -1 : 0);
            calendarDays.push(
                <CalenderDay
                    style={{ width: i === 0 ? dayWidth + 50 : dayWidth }}
                    tasks={tasksOfDay}
                    taskBoardId={tboard.id}
                    editTask={(task) => editTask(task)}
                    showTime={i === 0}
                    date={new Date(day)}
                />);
            day.setHours(24, 0, 0, 0);
        }
    }

    return (
        <View style={styles.screen}>
            <TouchableOpacity
                onPress={() => {
                    let date = new Date(startDate);
                    date.setDate(date.getDate() + dateRange);
                    setStartDate(date);
                }}
                onLongPress={() => {
                    let date = new Date(startDate);
                    date.setDate(date.getDate() - dateRange);
                    setStartDate(date);
                }}
            >
                <Text style={{ color: 'white' }}>start: {startDate.getDate()} end:{startDate.getDate() + dateRange}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginLeft: 50 }}>
                {calenderDayNames}
            </View>
            <ScrollView style={{ height: '60%', width: '100%' }}>
                <View style={{ flexDirection: 'row' }}>
                    {calendarDays}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: 'black'
    }
});

export default CalendarScreen;
