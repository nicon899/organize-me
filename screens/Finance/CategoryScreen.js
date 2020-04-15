import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import CategoryItem from '../../components/Finance/CategoryItem';
import { useSelector } from 'react-redux';
import BookingItem from '../../components/Finance/BookingItem';
import DatePicker from '../../components/DatePicker';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Category from '../../models/category';
import { ScrollView } from 'react-native-gesture-handler';

const CategoryScreen = props => {
    const [date, setDate] = useState(props.route.params.date ? new Date(props.route.params.date) : new Date());
    const [value, setValue] = useState(0);
    const [bookings, setBookings] = useState([]);

    const allCategories = useSelector(state => state.finances.categories);
    const categories = useSelector(state => state.finances.categories).filter((category) => category.parentId === props.route.params.id).sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0);
    const allBookings = useSelector(state => state.finances.bookings).sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }


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
        props.navigation.push('Category', { id: id, name: category.name, date: date.toString() });
    }

    const showBooking = (id) => {
        props.navigation.push('Booking', { id: id });
    }

    return (
        <View style={styles.screen}>

            <View style={styles.topBar}>
                <View style={styles.topBarCat}>
                    <Text style={{ color: 'white', fontSize: scaleFontSize(36), fontWeight: 'bold' }}>{props.route.params.name} <Text numberOfLines={1} style={{ color: value > 0 ? 'green' : 'red' }}>{value} €</Text> </Text>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('EditCategory', { categoryId: props.route.params.id, name: props.route.params.name })
                        }}
                    >
                        <MaterialCommunityIcons name="lead-pencil" size={scaleFontSize(32)} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                <View style={styles.categoryList}>
                    <FlatList
                        data={categories}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => (
                            <CategoryItem showContent={(id) => showCategory(id)} item={itemData.item} />
                        )}
                    />
                </View>

                {props.route.params.id != -1 && < View>
                    <FlatList
                        data={bookings}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => (
                            <BookingItem showBooking={(id) => showBooking(id)} id={itemData.item.id} name={itemData.item.name} value={itemData.item.value} date={itemData.item.date} />
                        )}
                    />
                </View>
                }
            </ScrollView>

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
                        <MaterialCommunityIcons name="timetable" size={scaleFontSize(36)} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDate(allBookings[0] ? new Date(allBookings[0].date) : new Date())}
                    >
                        <MaterialCommunityIcons name="timer-sand-full" size={scaleFontSize(36)} color="white" />
                    </TouchableOpacity>
                    {props.route.params.id != -1 && <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('CreateBooking', {
                                categoryId: props.route.params.id, editMode: false,
                            });
                        }}
                    >
                        <MaterialCommunityIcons name="credit-card-plus" size={scaleFontSize(36)} color="#00FF00" />
                    </TouchableOpacity>}
                </View>
            </View>

        </View >
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'black',
        color: 'white'
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
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    topBarDate: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'grey',
        borderTopWidth: 1,
        padding: 10,
    },
    topBarDateIcons: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: '40%'
    },
    topBarCat: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    input: {
        width: '50%',
        marginVertical: 5,
        padding: 3,
        backgroundColor: 'grey',
    },
    dateInput: {
        width: '60%',
    },
    bookingsheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryContainer: {
        height: '35%'
    }, categoryList: {
        marginBottom: 20,
        marginTop: 10
    }
});

export default CategoryScreen;