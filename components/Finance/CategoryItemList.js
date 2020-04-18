import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CategoryItem from '../../components/Finance/CategoryItem';
import BookingItem from '../../components/Finance/BookingItem';
import { ScrollView } from 'react-native-gesture-handler';

const CategoryItemList = props => {
    return (
        <ScrollView>
            <View >
                <View style={styles.categoryList}>
                    <FlatList
                        data={props.categories}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => (
                            <CategoryItem showContent={(id) => props.showCategory(id)} item={itemData.item} />
                        )}
                    />
                </View>

                {props.showBookings && < View>
                    <FlatList
                        data={props.bookings}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => (
                            <BookingItem showBooking={(id) => props.showBooking(id)} id={itemData.item.id} name={itemData.item.name} value={itemData.item.value} date={itemData.item.date} />
                        )}
                    />
                </View>
                }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    categoryList: {
        marginBottom: 20,
        marginTop: 10
    }
});

export default CategoryItemList;
