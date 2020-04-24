import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import TextItem from '../../components/TextItem';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Picker = props => {
    const [selectedItem, setSelectedItem] = useState(props.presetItemId != '-1' ? props.data.find((item) => item.id === props.presetItemId) : props.data[0]);
    const [showList, setShowList] = useState(false);

    useEffect(() => { props.onValueChange(selectedItem) }, [])
    return (
        <View style={[props.style]}>
            <View style={[styles.item, { maxHeight: showList ? '20%' : '100%', marginBottom: showList ? 20 : 0 }]}>
                <TouchableOpacity
                    onPress={() => {
                        setShowList(!showList);
                    }}
                >
                    <TextItem fontSize={42} style={{ color: 'white' }}>{selectedItem.name}</TextItem>
                </TouchableOpacity>

                {showList && <TouchableOpacity
                    style={{ marginLeft: 5 }}
                    onPress={() => {
                        props.editTaskBoard(selectedItem);
                    }}
                >
                    <MaterialCommunityIcons name="lead-pencil" size={28} color="white" />
                </TouchableOpacity>}

            </View>
            {showList && <View style={[styles.list, { borderWidth: showList ? 1 : 0 }]}>
                <ScrollView>
                    {props.data.sort((a, b) => a.name > b.name ? 1 : a.name === b.name ? 0 : -1).map((item, index) =>
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => {
                                setSelectedItem(item);
                                props.onValueChange(item);
                                setShowList(false);
                            }}
                        >
                            <TextItem fontSize={20} style={{ color: 'white' }}>{item.name}</TextItem>
                        </TouchableOpacity>)}
                    <TouchableOpacity
                        style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => {
                            props.createBoard();
                        }}
                    >
                        <TextItem fontSize={20} style={{ color: 'white' }}>New Taskboard</TextItem>
                        <MaterialCommunityIcons name="plus" size={36} color="green" />
                    </TouchableOpacity>
                </ScrollView>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        width: '100%',
        backgroundColor: 'black',
        alignItems: 'center',
        maxHeight: '60%',
        borderColor: '#80808080',
        paddingVertical: 4
    },
    item: {
        alignItems: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default Picker;
