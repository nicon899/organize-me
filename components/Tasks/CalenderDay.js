import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import TextItem from '../../components/TextItem';
import TaskItem from '../../components/Tasks/TaskItem';

const HHHEIGHT = 20;

const CalenderDay = props => {
    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    const getTime = (date) => {
        let hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        return (hours.length === 1 ? '0' + hours : hours) + ':' + (minutes.length === 1 ? '0' + minutes : minutes);
    }

    const events = [];
    const day = props.date;
    const now = new Date();

    let index = 0;
    for (let i = 0; i < 1440; i += 15) {
        day.setHours(0, i, 0, 0);
        const items = [];
        let extendEndTimeMax = 0;
        while (index < props.tasks.length) {
            if (props.tasks[index].date.getTime() <= day.getTime()) {
                let late = false;
                if (props.tasks[index].date.getTime() < day.getTime()) {
                    late = true;
                }
                const index2 = index;
                items.push(
                    <TouchableOpacity key={props.tasks[index].id} style={{ borderColor: '#FF0000', borderWidth: late ? 4 : 0, backgroundColor: props.tasks[index].color, flex: 1, borderRadius: 25, justifyContent: 'center', opacity: now.getTime() > day.getTime() ? 0.3 : 1 }}
                        onPress={() => props.editTask(props.tasks[index2])}
                        autoFocus = {true}
                    >
                        <TextItem fontSize={16} style={{ color: 'white', textAlign: 'center' }} >{props.tasks[index].name}</TextItem>
                        <TextItem fontSize={14} style={{ color: '#CCCCCC', textAlign: 'center', }} >{getTime(props.tasks[index].date) + ' - ' + getTime(new Date(props.tasks[index].date.getTime() + props.tasks[index].duration * 60000))}</TextItem>
                    </TouchableOpacity>
                );
                if (props.tasks[index].duration > extendEndTimeMax) {
                    extendEndTimeMax = late ? (props.tasks[index].duration - ((day.getTime() - props.tasks[index].date.getTime()) / 60000)) : props.tasks[index].duration;
                }
            } else {
                break;
            }
            index++;
        }
        if (extendEndTimeMax > 0) {
            i += (extendEndTimeMax - 15);
            day.setHours(0, i, 0, 0);
        }
        const isNow = (now.getTime() > day.getTime() && now.getTime() < day.getTime() + 900000);
        if (items.length > 0) {
            events.push(
                <View style={[styles.section, { height: extendEndTimeMax > 0 ? (extendEndTimeMax / 15) * HHHEIGHT + (0) : HHHEIGHT }]} key={day.getTime()}>
                    <View style={[styles.timeSection, { borderLeftColor: isNow ? 'red' : 'grey', borderLeftWidth: props.showTime ? 1 : 0, borderBottomWidth: (day.getMinutes() + 15) % 30 === 0 ? 1 : 0, borderTopWidth: (day.getMinutes() + day.getHours()) === 0 ? 1 : 0 }]}>{items}</View>
                </View>
            );
        } else {
            const dayString = day.toString();
            events.push(
                <TouchableOpacity style={[styles.section, { height: extendEndTimeMax > 0 ? (extendEndTimeMax / 15) * HHHEIGHT + (0) : HHHEIGHT }]} key={day.getTime()}
                    onPress={() => props.createTask(dayString)}
                >
                    <View style={[styles.timeSection, { borderLeftColor: isNow ? 'red' : 'grey', borderLeftWidth: props.showTime ? 1 : 0, borderBottomWidth: (day.getMinutes() + 15) % 30 === 0 ? 1 : 0, borderTopWidth: (day.getMinutes() + day.getHours()) === 0 ? 1 : 0 }]}></View>
                </TouchableOpacity>
            );
        }
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
                        taskBoardId={itemData.item.tboardId}
                        showDayOfWeek={false} />
                )}
            /> */}

        </View >
    );
};

const styles = StyleSheet.create({
    section: {
        width: '100%',
        flexDirection: 'row',
    },
    timeSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRightWidth: 1,
        padding: 5,
        borderRightColor: 'grey',
        borderTopColor: 'grey',
        borderBottomColor: 'grey',
    },
    time: {
        marginRight: 10,
        justifyContent: 'center',
        width: 40,
    }
});

export default CalenderDay;
