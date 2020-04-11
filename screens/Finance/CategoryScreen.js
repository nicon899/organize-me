import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import CategoryItem from '../../components/Finance/CategoryItem';
import { useSelector } from 'react-redux';
import BookingItem from '../../components/Finance/BookingItem';
import DatePicker from '../../components/DatePicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CategoryScreen = props => {
    const [date, setDate] = useState(props.route.params.date ? props.route.params.date : new Date());
    const [value, setValue] = useState(0);
    const [bookings, setBookings] = useState([]);

    const allCategories = useSelector(state => state.finances.categories);
    const categories = useSelector(state => state.finances.categories).filter((category) => category.parentId === props.route.params.id);
    const allBookings = useSelector(state => state.finances.bookings).sort((booking) => date >= booking.date);

    useEffect(() => {
        let val = 0;
        const filteredBookings = allBookings.filter((booking) => booking.categoryId === props.route.params.id && booking.date <= date);
        filteredBookings.forEach(booking => val += booking.value);

        allCategories.forEach(cat => {
            const catBookings = allBookings.filter((booking) => booking.categoryId === cat.id && booking.date <= date);
            let subCatValue = 0;
            catBookings.forEach(booking => {
                subCatValue += booking.value;
            });
            cat.value = Math.round((subCatValue) * 100 + Number.EPSILON) / 100;
        });

        const setCatValue = (id) => {
            const subCats = allCategories.filter((cat) => cat.parentId === id);
            if (subCats.length > 0) {
                let subCatValueTotal = 0;
                subCats.forEach((cat) => {
                    setCatValue(cat.id);
                    subCatValueTotal += cat.value;
                });
                const parentCat = allCategories.find((cat) => cat.id === id);
                if (parentCat) {
                    parentCat.value += subCatValueTotal;
                }
            }
        }
        setCatValue(-1);
        categories.forEach((cat) => {
            val += cat.value;
        });
        setBookings(filteredBookings);
        setValue(val);
    }, [date, allBookings, allCategories]);

    const showCategory = (id) => {
        let category = categories.find((category) => category.id === id);
        props.navigation.push('Category', { id: id, name: category.name, date: date });
    }

    const showBooking = (id) => {
        props.navigation.push('Booking', { id: id });
    }

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.topBarCat}>
                    <Text style={{ color: 'white' }}>{props.route.params.name} : {value}   </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            props.navigation.navigate('CreateCategory', { categoryId: props.route.params.id })
                        }}
                    >
                        <Text style={{ color: 'white' }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.topBarDate}>
                <DatePicker
                    style={styles.dateInput}
                    date={date}
                    setDate={setDate}
                />
                <View style={styles.topBarDateIcons}>
                    <TouchableOpacity
                        onPress={() => setDate(new Date())}
                    >
                        <MaterialCommunityIcons style={{ marginRight: '10%' }} name="timetable" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDate(allBookings[0] ? new Date(allBookings[0].date) : new Date())}
                    >
                        <MaterialCommunityIcons style={{ marginRight: '10%' }} name="timer-sand-full" size={32} color="white" />
                    </TouchableOpacity>
                </View>
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
            {props.route.params.id != -1 && < View >
                <Text style={{ color: 'white' }}>Bookings</Text>
                <View style={styles.categoryList}>
                    <FlatList
                        data={bookings}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => (
                            <BookingItem showBooking={(id) => showBooking(id)} id={itemData.item.id} name={itemData.item.name} value={itemData.item.value} date={itemData.item.date} />
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
                    <Text style={{ color: 'white' }}>+</Text>
                </TouchableOpacity>
            </View>
            }
        </View >
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
        color: 'white'
    },
    categoryList: {
        margin: 10,
        padding: 10,
        width: '100%',
    },
    addButton: {
        borderColor: 'white',
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
        justifyContent: 'space-evenly',
    },
    topBarDateIcons: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '25%'
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
        width: '60%',
    }
});

export default CategoryScreen;
