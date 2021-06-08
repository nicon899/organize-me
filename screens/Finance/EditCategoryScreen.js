import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DraggableFlatList from "react-native-draggable-flatlist";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as financeActions from '../../store/actions/finances';

const EditCategoryScreen = props => {
    const [categories, setCategories] = useState([]);
    const allCategories = useSelector(state => state.finances.categories);
    const bookings = useSelector(state => state.finances.bookings);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [name, setName] = useState(props.route.params.name);

    const dispatch = useDispatch();

    useEffect(() => {
        setCategories(allCategories.filter((category) => category.parentId === props.route.params.categoryId).sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0));
    }, [allCategories]);

    const updateIndexes = () => {
        let index = 0;
        categories.forEach(cat => {
            dispatch(financeActions.updateCategoryIndex(cat.id, index));
            index++;
        });
    };

    const updateName = () => {
        dispatch(financeActions.updateCategoryName(props.route.params.categoryId, name));
    };

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }


    return (
        <View style={styles.screen}>
            <View style={{ width: '100%', height: '90%', }}>
                {props.route.params.categoryId != -1 && <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.nameInputContainer}>
                        <TextInput
                            placeholder='Name'
                            placeholderTextColor="white"
                            style={styles.input}
                            blurOnSubmit
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={name}
                            onChangeText={(input) => { setName(input); setIsNameChanged(true) }}
                        />
                    </View>
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
                        <MaterialCommunityIcons style={{ margin: 8 }} name="delete" size={32} color="red" />
                    </TouchableOpacity>
                </View>
                }
                <View style={{
                    width: '100%',
                    height: props.route.params.categoryId === -1 ? '100%' : '90%',
                }}>
                    <View style={styles.bookingsheader}>
                        <Text style={{ color: 'white', fontSize: scaleFontSize(32), fontWeight: 'bold' }}>Categories:</Text>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.navigate('CreateCategory', { categoryId: props.route.params.categoryId, index: categories.length })
                            }}
                        >
                            <MaterialIcons style={{ marginRight: '10%' }} name="library-add" size={28} color="#00FF00" />
                        </TouchableOpacity>
                    </View>

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
            </View>
            <View style={{ width: '100%', height: '10%', flexDirection: 'row', justifyContent: 'space-around', alignSelf: 'flex-end'}}>
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center', padding: 15, width: '30%', height: '50%' }}
                    onPress={() => {
                        props.navigation.goBack();
                    }}
                >
                    <Text style={{ color: 'red' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'green', borderRadius: 5, alignItems: 'center', justifyContent: 'center', padding: 15, width: '30%', height: '50%' }}
                    onPress={() => {
                        if (isNameChanged) {
                            updateName();
                        }
                        if (isOrderChanged) {
                            updateIndexes();
                        }
                        props.navigation.navigate('Category', { name: name });
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
        backgroundColor: 'black',
    },
    nameInputContainer: {
        width: '80%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        marginVertical: 5,
        padding: 3,
        borderColor: 'grey',
        borderBottomWidth: 1,
        color: 'white'
    },
    bookingsheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    },
});

export default EditCategoryScreen;
