import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity, Dimensions } from 'react-native';
import CategoryItemList from '../../components/Finance/CategoryItemList';
import { useSelector } from 'react-redux';
import DatePicker from '../../components/DatePicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CategoryScreen = props => {
    const [date, setDate] = useState(new Date());
    const [value, setValue] = useState(0);
    const [bookings, setBookings] = useState([]);
    const allCategories = useSelector(state => state.finances.categories);
    const [selectedCategory, setSelectedCategory] = useState(allCategories[0]);
    const categories = useSelector(state => state.finances.categories).filter((category) => category.parentId === selectedCategory.id).sort((a, b) => a.index > b.index ? 1 : a.index < b.index ? -1 : 0);
    const allBookings = useSelector(state => state.finances.bookings).sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

    const scaleFontSize = (fontSize) => {
        return Math.ceil((fontSize * Math.min(Dimensions.get('window').width / 411, Dimensions.get('window').height / 861)));
    }

    useEffect(() => {
        setLatestDate();
    }, []);

    useEffect(() => {
        const backAction = () => {
            if (!props.navigation.isFocused()) {
                return false;
            }
            if (selectedCategory.id === -1) {
                console.log('back -1')
                return false;
            } else {
                console.log('back default')
                setSelectedCategory(allCategories.find((category) => category.id === selectedCategory.parentId));
                return true;
            }
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    });

    useEffect(() => {
        let val = 0;
        const filteredBookings = allBookings.filter((booking) => booking.categoryId === selectedCategory.id && booking.date <= date);
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
        setValue(Math.round(val * 100 + Number.EPSILON) / 100);
    }, [date, allBookings, allCategories, selectedCategory]);

    const setLatestDate = () => {
        let today = new Date();
        if (allBookings[0]) {
            let newDate = new Date(allBookings[0].date);
            setDate(newDate > today ? newDate : today);
        } else {
            setDate(today);
        }
    }

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <View style={styles.topBarCat}>
                    <Text style={{ color: 'white', fontSize: scaleFontSize(36), fontWeight: 'bold', textAlign: 'center' }}>{selectedCategory.name} <Text numberOfLines={1} style={{ color: value > 0 ? 'green' : 'red' }}>{(selectedCategory.name + value).length > 20 && '\n'}{value} €</Text> </Text>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('EditCategory', { categoryId: selectedCategory.id, name: selectedCategory.name })
                        }}
                    >
                        <MaterialCommunityIcons name="lead-pencil" size={scaleFontSize(32)} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <CategoryItemList
                    style={{ maxHeight: '100%' }}
                    bookings={bookings}
                    categories={categories}
                    showBooking={(id) => props.navigation.push('Booking', { id: id })}
                    showCategory={(id) => setSelectedCategory(categories.find((category) => category.id === id))}
                    showBookings={selectedCategory.id != -1}
                />
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
                        <MaterialCommunityIcons name="timetable" size={scaleFontSize(36)} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setLatestDate();
                        }}>
                        <MaterialCommunityIcons name="timer-sand-full" size={scaleFontSize(36)} color="white" />
                    </TouchableOpacity>
                    {selectedCategory.id != -1 && <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('CreateBooking', {
                                categoryId: selectedCategory.id, editMode: false,
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
        color: 'white',
    },
    topBar: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'grey',
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
    dateInput: {
        width: '60%',
    }
});

export default CategoryScreen;