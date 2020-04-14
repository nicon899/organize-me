import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DraggableFlatList from "react-native-draggable-flatlist";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as financeActions from '../../store/actions/finances';
import CategoryItem from '../../components/Finance/CategoryItem';

const EditCategoryScreen = props => {
    const [categories, setCategories] = useState(useSelector(state => state.finances.categories).filter((category) => category.parentId === props.route.params.categoryId).sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0));
    const bookings = useSelector(state => state.finances.bookings);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [name, setName] = useState(props.route.params.name);

    const dispatch = useDispatch();

    const updateIndexes = () => {
        console.log('update indexes')
        let index = 0;
        categories.forEach(cat => {
            dispatch(financeActions.updateCategoryIndex(cat.id, index));
            index++;
        });
    };

    const updateName = () => {
        console.log('update name')
        dispatch(financeActions.updateCategoryName(props.route.params.categoryId, name));
    };

    return (
        <View style={styles.screen}>
            {props.route.params.categoryId != -1 && <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Delete Category',
                            'Are you sure you want to delete this category with all its Bookings and child categories?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'OK', onPress: () => {
                                        dispatch(financeActions.deleteCategory(props.route.params.categoryId, categories, bookings));
                                        props.navigation.reset({
                                            index: 0,
                                            routes: [
                                                {
                                                    name: 'Category',
                                                    params: { id: -1, name: 'Finanzen' },
                                                },
                                            ],
                                        })
                                    }
                                },
                            ],
                            { cancelable: true }
                        )
                    }}
                >
                    <MaterialCommunityIcons style={{ margin: 8 }} name="delete" size={28} color="red" />
                </TouchableOpacity>
            </View>
            }
            {props.route.params.categoryId != 1 &&
                <View style={styles.nameInputContainer}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Name: </Text>
                    <TextInput
                        placeholder='Name'
                        style={styles.input}
                        blurOnSubmit
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={name}
                        onChangeText={(input) => { setName(input); setIsNameChanged(true) }}
                    />
                </View>
            }
            <View style={styles.catList}>
                <DraggableFlatList
                    data={categories}
                    onDragBegin={() => setIsOrderChanged(true)}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item, index, drag, isActive }) =>
                        (<TouchableOpacity
                            style={{
                                height: 50,
                                backgroundColor: isActive ? "blue" : item.backgroundColor,
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                            onLongPress={drag}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: "white",
                                    fontSize: 32
                                }}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>)
                    }
                    onDragEnd={(data) => setCategories(data.data)}
                />
            </View>

            <View style={{ width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (isNameChanged) {
                            updateName();
                        }
                        if (isOrderChanged) {
                            updateIndexes();
                        }
                        props.navigation.navigate('Category', { name: name});
                    }}
                >
                    <Text style={{ color: 'green' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black'
        //alignItems: 'center',
        //justifyContent: 'center'
    },
    nameInputContainer: {
        width: '100%',
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginVertical: 5,
        padding: 3,
        borderColor: 'grey',
        borderWidth: 1,
        color: 'white'
    },
    catList: {
        width: '100%',
        height: '60%'
    }
});

export default EditCategoryScreen;
