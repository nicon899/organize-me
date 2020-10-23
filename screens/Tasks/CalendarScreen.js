import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import CalenderDay from '../../components/Tasks/CalenderDay';
import TextItem from '../../components/TextItem';
import TaskItem from '../../components/Tasks/TaskItem';
import CreateTaskScreen from '../Tasks/CreateTaskScreen'


const CalendarScreen = props => {
    const tboards = useSelector(state => state.tasks.taskboards);
    const calendarDays = [];
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dateRange, setDateRange] = useState((Platform.OS === 'web' || Dimensions.get('window').width > 1000) ? 7 : 3);
    const [focused, setIsFocused] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editParams, setEditParams] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [scrollRef, setScrollRef] = useState(null);
    const [nowY, setNowY] = useState(0)

    const allTasks = [];
    tboards.forEach(tboard => {
        tboard.tasks.forEach(task => {
            task.tboardId = tboard.id;
            task.color = tboard.color;
            allTasks.push(task)
        });
    });

    useEffect(() => {
        let day = new Date(startDate.getTime() + (dateRange - 1) * 86400000);
        setEndDate(day);
    }, [startDate, dateRange]);

    useEffect(() => {
        if (Dimensions.get('window').width > 1000) {
            const d = new Date();
            const day = d.getDay();
            const diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            setStartDate(new Date(d.setDate(diff)));
        }
    }, []);

    useEffect(() => {
        if (scrollRef) {
            scrollRef.scrollTo({ x: 0, y: nowY, animated: true });
        }
    }, [nowY, focused])

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
            setIsFocused(true);
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                setIsFocused(false);
            };
        }, [])
    );

    const editTask = (task) => {
        if (editMode) {
            setEditMode(false);
        } else {
            if (Platform.OS === 'web' || (Platform.OS === 'web' || Dimensions.get('window').width > 1000)) {
                const date = task.duration > 0 ? task.date.toString() : new Date(task.date.getTime() + 36000000).toString()
                setEditParams(
                    {
                        id: task.tboardId,
                        taskId: task.id,
                        name: task.name,
                        date: date,
                        deadline: task.deadline.toString(),
                        editMode: true,
                        duration: task.duration,
                        withDuration: true,
                        close: true,
                        duration: task.duration > 0 ? task.duration : 90,
                    }
                );
                setEditMode(true);
            } else {
                props.navigation.navigate('CreateTask', {
                    id: task.tboardId,
                    taskId: task.id,
                    name: task.name,
                    date: task.date,
                    deadline: task.deadline.toString(),
                    duration: task.duration,
                    editMode: true,
                    withDuration: true
                });
            }
        }
    }

    const createTask = (date) => {
        if (Platform.OS === 'web' || (Platform.OS === 'web' || Dimensions.get('window').width > 1000)) {
            setEditMode(false);
            setEditParams(
                {
                    id: tboards[0].id,
                    date: date.toString(),
                    deadline: date.toString(),
                    editMode: false,
                    withDuration: true,
                    close: true,
                    duration: 90,
                }
            );
            setEditMode(true);
        } else {
            props.navigation.navigate('CreateTask', {
                id: tboards[0].id, editMode: false, withDuration: true, close: false, date: date.toString(), deadline: date.toString(),
            });
        }
    }

    const isSameDay = (dateA, dateB) => (dateA.getDate() === (dateB.getDate())
        && dateA.getMonth() === dateB.getMonth()
        && dateA.getFullYear() === dateB.getFullYear());

    const getTime = (date) => {
        let hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        return (hours.length === 1 ? '0' + hours : hours) + ':' + (minutes.length === 1 ? '0' + minutes : minutes);
    }

    const setScrollViewRef = (element) => {
        setScrollRef(element);
    };

    const calenderDayNames = [];
    const dayName = new Date(startDate);
    dayName.setHours(0, 0, 0, 0);
    for (let i = 0; i < dateRange; i++) {
        calenderDayNames.push(
            <TextItem key={i} fontSize={28} style={{ color: 'white', textAlign: 'center', width: dayWidth }}>{days[dayName.getDay()]}, {""
                + (dayName.getDate() < 10 ? "0" + dayName.getDate() : dayName.getDate()) + "."
                + (dayName.getMonth() < 9 ? "0" + (dayName.getMonth() + 1) : (dayName.getMonth() + 1))}</TextItem>
        );
        dayName.setHours(24, 0, 0, 0);
    }

    const timeElements = [];
    const day = new Date();
    const now = new Date();
    day.setHours(0, 0, 0, 0);
    for (let i = 0; i < 1440; i += 15) {
        day.setHours(0, i, 0, 0);
        const isNow = (now.getTime() > day.getTime() && now.getTime() < day.getTime() + 900000);
        timeElements.push(
            <View
                key={i}
                style={styles.time}
                onLayout={(e) => {
                    if (isNow) {
                        setNowY(+e.nativeEvent.layout.y);
                    }
                }
                }

            >
                {day.getMinutes() % 30 === 0 && <Text style={{ color: 'white', textAlign: 'center' }}>{getTime(day)}</Text>}
            </View>);
    }

    const tasksWithoutTime = [];
    if (allTasks) {
        const day = new Date(startDate);
        day.setHours(0, 0, 0, 0);
        for (let i = 0; i < dateRange; i++) {
            const tasksOfDay = allTasks.filter((task) => isSameDay(task.date, day)).sort((a, b) => a.date > b.date ? 1 : a.date < b.date ? -1 : a.deadline > b.deadline ? 1 : a.deadline < b.deadline ? -1 : 0);
            const tasksOfDayWithTime = tasksOfDay.filter((task) => task.duration > 0);
            const tasksOfDayWithoutTime = tasksOfDay.filter((task) => task.duration <= 0);
            tasksWithoutTime.push(
                <View key={i} style={{ width: dayWidth, borderColor: 'grey', borderWidth: 1, marginBottom: 5 }}>
                    <FlatList
                        data={tasksOfDayWithoutTime}
                        keyExtractor={item => item.id}
                        renderItem={itemData => (
                            <TouchableOpacity
                                onPress={() => editTask(itemData.item)}
                            >
                                <TextItem fontSize={18} style={{ color: 'white' }}>{itemData.item.name}</TextItem>
                            </TouchableOpacity>
                        )}
                    />
                </View>);

            calendarDays.push(
                <CalenderDay
                    style={{ width: dayWidth }}
                    tasks={tasksOfDayWithTime}
                    editTask={(task) => editTask(task)}
                    createTask={(date) => createTask(date)}
                    showTime={i === 0}
                    date={new Date(day)}
                    key={i}
                />);
            day.setHours(24, 0, 0, 0);
        }
    }

    return (
        <View style={styles.screen}>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate}
                    mode={'date'}
                    is24Hour={true}
                    display="default"
                    onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date != undefined) {
                            setStartDate(date);
                        }
                    }}
                />
            )}

            <View style={{ flex: 3 }}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            let date = new Date(startDate);
                            date.setDate(date.getDate() - dateRange);
                            setStartDate(date);
                        }}
                        onLongPress={() => {
                            setDateRange(dateRange - 1);
                        }}
                    >
                        <Ionicons name="ios-arrow-back" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                    >
                        <TextItem fontSize={18} style={{ color: 'white', textAlign: 'center' }}>{days[startDate.getDay()]}, {""
                            + (startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()) + "."
                            + (startDate.getMonth() < 9 ? "0" + (startDate.getMonth() + 1) : (startDate.getMonth() + 1))} - {days[endDate.getDay()]}, {""
                                + (endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()) + "."
                                + (endDate.getMonth() < 9 ? "0" + (endDate.getMonth() + 1) : (endDate.getMonth() + 1))}</TextItem>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            let date = new Date(startDate);
                            date.setDate(date.getDate() + dateRange);
                            setStartDate(date);
                        }}
                        onLongPress={() => {
                            setDateRange(dateRange + 1);
                        }}
                    >
                        <Ionicons name="ios-arrow-forward" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setStartDate(new Date());
                        }}
                        onLongPress={() => {
                            setDateRange((Platform.OS === 'web' || Dimensions.get('window').width > 1000) ? 5 : 2);
                        }}
                    >
                        <MaterialIcons name="today" size={32} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', marginLeft: 50 }}>
                        {calenderDayNames}
                    </View>
                    <ScrollView ref={setScrollViewRef}>
                        <View style={{ flexDirection: 'row', marginLeft: 50 }}>
                            {tasksWithoutTime}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ marginTop: -10 }}>
                                {timeElements}
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                {calendarDays}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            {editMode && <View style={{ width: '30%', height: '100%', backgroundColor: 'black' }}>
                <CreateTaskScreen
                    route={
                        { params: editParams }
                    }
                    close={() => setEditMode(false)}
                />
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-around',
        backgroundColor: 'black',
        flexDirection: 'row',
    },
    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderColor: 'grey',
        borderBottomWidth: 0.5,
        flexDirection: 'row'
    },
    time: {
        width: 50,
        height: 20,
        alignItems: 'center'
    }
});

export default CalendarScreen;
