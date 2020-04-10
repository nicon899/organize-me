import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import CategoryItem from '../../components/Finance/CategoryItem';
import { useSelector } from 'react-redux';
import BookingItem from '../../components/Finance/BookingItem';
import DatePicker from '../../components/DatePicker';

const CategoryScreen = props => {
    const [date, setDate] = useState(new Date());
    const [value, setValue] = useState(0);
    const [bookings, setBookings] = useState([]);

    const categories = useSelector(state => state.finances.categories).filter((category) => category.parentId === props.route.params.id);
    const allBookings = useSelector(state => state.finances.bookings);

    useEffect(() => {
        console.log('UseEffect');
        let val = 0;
        const filteredBookings = allBookings.filter((booking) => booking.categoryId === props.route.params.id && booking.date <= date);
        filteredBookings.forEach(booking => val += booking.value);

        categories.forEach(cat => {
            const catBookings = allBookings.filter((booking) => booking.categoryId === cat.id && booking.date <= date);
            let subCatValue = 0;
            catBookings.forEach(booking => {
                subCatValue += booking.value;
                console.log('Booking: ' + booking.value);
            });
            cat.value = subCatValue;
            val += subCatValue;
        });

        setBookings(filteredBookings);
        setValue(val);
    }, [date, allBookings]);

    const showCategory = (id) => {
        let category = categories.find((category) => category.id === id);
        props.navigation.push('Category', { id: id, name: category.name });
    }

    const showBooking = (id) => {
        props.navigation.push('Booking', { id: id });
    }

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.topBarCat}>
                    <Text>{props.route.params.name} : {value}   </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            props.navigation.navigate('CreateCategory', { categoryId: props.route.params.id })
                        }}
                    >
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.topBarDate}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setDate(new Date(date.setDate(date.getDate() - 1)));
                    }}
                >
                    <Text>-</Text>
                </TouchableOpacity>
                <DatePicker
                    style={styles.dateInput}
                    date={date}
                    setDate={setDate}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setDate(new Date(date.setDate(date.getDate() + 1)));
                    }}
                >
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.categoryList}>
                <FlatList
                    data={categories}
                    keyExtractor={item => item.id.toString()}
                    renderItem={itemData => (
                        <CategoryItem showContent={(id) => showCategory(id)} item={itemData.item} />
                    )}
                />
            </View>
            {
                props.route.params.id != -1 && < View >
                    <Text>Bookings</Text>
                    <View style={styles.categoryList}>
                        <FlatList
                            data={bookings}
                            keyExtractor={item => item.id.toString()}
                            renderItem={itemData => (
                                <BookingItem showBooking={(id) => showBooking(id)} id={itemData.item.id} name={itemData.item.name} value={itemData.item.value} />
                            )}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            props.navigation.navigate('CreateBooking', {
                                categoryId: props.route.params.id, editMode: false,
                            });
                        }}
                    >
                        <Text>+</Text>
                    </TouchableOpacity>
                </View>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    categoryList: {
        margin: 10,
        padding: 10,
        width: '100%',
    },
    addButton: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
        width: 60,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topBar: {
        width: '100%',
        borderColor: 'grey',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        marginBottom: 10
    },
    topBarDate: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBarCat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        width: '50%',
        marginVertical: 5,
        padding: 3,
        backgroundColor: 'grey'
    },
    dateInput: {
        width: '50%',
    }
});

export default CategoryScreen;
