import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import TextItem from '../../components/TextItem';
import TaskItem from '../../components/Tasks/TaskItem';

const CalenderDay = props => {
    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    const events = [];
    const day = props.date;
    const now = new Date();

    console.log('date: ' + props.date + 'day: ' + day + ' now: ' + now)

    const getTime = (date) => {
        let hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        return (hours.length === 1 ? '0' + hours : hours) + ':' + (minutes.length === 1 ? '0' + minutes : minutes);
    }

    let index = 0;
    for (let i = 0; i < 1440; i += 15) {
        day.setHours(0, i, 0, 0);
        const items = [];
        while (index < props.tasks.length) {
            if (props.tasks[index].date.getTime() <= day.getTime()) {
                items.push(
                    <Text style={{ color: 'white' }}>{props.tasks[index].name}</Text>
                );
            } else {
                break;
            }
            index++;
        }

        events.push(
            <View style={styles.section}>
                {props.showTime && <View style={styles.time}>{day.getMinutes() % 30 === 0 && <Text style={{ color: (now.getTime() - 900000 < day.getTime() && now.getTime() > day.getTime()) ? 'blue' : 'white' }}>{getTime(day)}</Text>}</View>}
                <View style={[styles.timeSection, { borderBottomWidth: (day.getMinutes() + 15) % 30 === 0 ? 1 : 0, borderTopWidth: day.getMinutes() === 0 ? 1 : 0 }]}>{items}</View>
            </View>
        );

    }


    return (
        <View style={props.style}>
            {events}
            {/* <FlatList
                data={props.tasks}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <TaskItem
                        key={itemData.item.id}
                        editTask={(task) => props.editTask(task)}
                        task={itemData.item}
                        taskBoardId={props.taskBoardId}
                        showDayOfWeek={false} />
                )}
            /> */}

        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        width: '100%',
        height: 20,
        flexDirection: 'row',
    },
    timeSection: {
        borderColor: 'grey',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    time: {
        marginRight: 10,
        justifyContent: 'center',
        width: 40,
    }
});

export default CalenderDay;
