import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';

import CalenderDay from '../../components/Tasks/CalenderDay'

const CalendarScreen = props => {
    const tboard = useSelector(state => state.tasks.taskboards)[0];
    const calendarDays = [];
    const [startDate, setStartDate] = useState(new Date());
    const [dateRange, setDateRange] = useState(5);

    const days = [
        'So',
        'Mo',
        'Di',
        'Mi',
        'Do',
        'Fr',
        'Sa',
    ];

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

    var isSameDay = (dateA, dateB) => (dateA.getDate() === (dateB.getDate())
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getFullYear() === dateB.getFullYear())

    if (tboard) {
        const day = new Date(startDate);
        day.setHours(0, 0, 0, 0);
        for (let i = 0; i < dateRange; i++) {
            const tasksOfDay = tboard.tasks.filter((task) => isSameDay(task.date, day)).sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : a.deadline > b.deadline ? 1 : a.deadline < b.deadline ? -1 : 0);
            calendarDays.push(
                <CalenderDay
                    tasks={tasksOfDay}
                    taskBoardId={tboard.id}
                    name={days[day.getDay()]}
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
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'black'
    }
});

export default CalendarScreen;
