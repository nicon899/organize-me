import React, { useState } from 'react';
import { Text, Dimensions, Picker, View } from 'react-native';

const DurationPicker = props => {
    const [start, setStart] = useState(props.start && props.start ? props.start : 0);
    const [end, setEnd] = useState(props.start && props.duration && props.start > 0 ? props.start + props.duration : 15);

    const startTimes = [];
    const endTimes = [];

    const getTimeLabel = (time) => {
        let hour = (Math.floor(time / 60)).toString();
        let min = (time % 60).toString();
        return (hour.length > 1 ? hour : '0' + hour) + ':' + (min.length > 1 ? min : '0' + min);
    }

    const getDuration = (endTime) => {
        const time = endTime - start;
        let hour = (Math.floor(time / 60)).toString();
        let min = (time % 60).toString();
        min = min.length > 1 ? min : '0' + min
        return `(${hour}h ${min})`;
    }

    for (let i = 0; i < 1440; i += 15) {
        startTimes.push(<Picker.Item label={getTimeLabel(i)} value={i} key={i} />
        );
    }

    for (let i = start + 15; i <= 1440; i += 15) {
        endTimes.push(<Picker.Item label={getTimeLabel(i) + ' h ' + getDuration(i)} value={i} key={i} />
        );
    }


    return (
        <View>
            <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: '5%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ height: 50, justifyContent: 'center', width: '30%' }}>
                    <Text style={{ color: 'white' }}>VON: </Text>
                    <Picker mode='dropdown' style={{ color: 'white', flex: 1 }}
                        onValueChange={(itemValue) => {
                            setStart(itemValue);
                            setEnd(itemValue + (end - start));
                            props.setStart(itemValue);
                        }}
                        selectedValue={start}
                    >
                        {startTimes}
                    </Picker>
                </View>
                <View style={{ height: 50, justifyContent: 'center', width: '50%' }}>
                    <Text style={{ color: 'white' }}>BIS: </Text>
                    <Picker mode='dropdown' style={{ color: 'white', flex: 1 }}
                        onValueChange={(itemValue) => { setEnd(itemValue); props.setDuration(itemValue - start); }}
                        selectedValue={end}
                    >
                        {endTimes}
                    </Picker>
                </View>
            </View>
        </View >
    );
};

export default DurationPicker;
