import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as financeActions from '../../store/actions/finances';

const EditCategoryScreen = props => {
    const categories = useSelector(state => state.finances.categories);
    const bookings = useSelector(state => state.finances.bookings);


    const dispatch = useDispatch();
    useEffect(() => {
        console.log('dispatch: useEffecht')
        dispatch(financeActions.fetchFinanceData());
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <TouchableOpacity
                onPress={() => {
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
                }}
            >
                <Text>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default EditCategoryScreen;
