import Category from '../../models/category';
import Booking from '../../models/booking';
import { encryptString, decryptString } from '../SafeStorage';

export const ADD_CATEGORY = 'ADD_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const UPDATE_CATEGORY_NAME = 'UPDATE_CATEGORY_NAME';
export const UPDATE_CATEGORY_INDEX = 'UPDATE_CATEGORY_INDEX';
export const ADD_BOOKING = 'ADD_BOOKING';
export const DELETE_BOOKING = 'DELETE_BOOKING';
export const UPDATE_BOOKING = 'UPDATE_BOOKING';
export const SET_FINANCES = 'SET_FINANCES';

const USERNAME = 'Nico';
const PASSWORD = '8paikkaa'
const FIREBASE_PASSWORD = USERNAME + "UFF123DA" + PASSWORD;

export const fetchFinanceData = () => {
    return async dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        const categories = [new Category(-1, 'Finanzen', 0, 0)];
        const bookings = [];

        firebase.database().ref(`${USERNAME}/Finance/Categories`).once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                const name = decryptString(childSnapshot.child('name').val(), FIREBASE_PASSWORD)
                categories.push(
                    new Category(childSnapshot.key, name, childSnapshot.child('index').val(), childSnapshot.child('parentId').val())
                )
            });
        }).then(() => {
            firebase.database().ref(`${USERNAME}/Finance/Bookings`).once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    const name = decryptString(childSnapshot.child('name').val(), FIREBASE_PASSWORD)
                    const value = decryptString(childSnapshot.child('value').val(), FIREBASE_PASSWORD)
                    bookings.push(
                        new Booking(childSnapshot.key, name, parseFloat(value), childSnapshot.child('details').val(),
                            new Date(childSnapshot.child('date').val()), childSnapshot.child('categoryId').val())
                    )
                })
            }).then(() => {
                dispatch({
                    type: SET_FINANCES,
                    categories: categories,
                    bookings: bookings
                });
            })
        })
    }
}

export const updateCategoryName = (id, name) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/Finance/Categories/${id}`).update({
            name: encryptString(name, FIREBASE_PASSWORD),
        }).then((data) => {
            //success callback
            dispatch({
                type: UPDATE_CATEGORY_NAME,
                id: id,
                name: name,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const updateCategoryIndex = (id, index) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/Finance/Categories/${id}`).update({
            index,
        }).then((data) => {
            //success callback
            dispatch({
                type: UPDATE_CATEGORY_INDEX,
                id: id,
                index: index,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const addCategory = (name, index, parentId) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }

        firebase.database().ref(`${USERNAME}/Finance/Categories`).push({
            name: encryptString(name, FIREBASE_PASSWORD),
            index,
            parentId
        }).then((data) => {
            //success callback
            dispatch({
                type: ADD_CATEGORY,
                id: data.key,
                name: name,
                index: index,
                parentId: parentId
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const deleteCategory = (id, categories, bookings) => {
    return dispatch => {
        const catbookings = bookings.filter((booking) => booking.categoryId === id);
        catbookings.forEach((booking) => {
            dispatch(deleteBooking(booking.id));
        })

        const catCats = categories.filter((cat) => cat.parentId === id);
        catCats.forEach((cat) => {
            dispatch(deleteCategory(cat.id, categories, bookings));
        })

        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/Finance/Categories/${id}`).remove().then((data) => {
            //success callback
            dispatch({
                type: DELETE_CATEGORY,
                id: id,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const deleteBooking = (id) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/Finance/Bookings/${id}`).remove().then((data) => {
            //success callback
            dispatch({
                type: DELETE_BOOKING,
                id: id,
            });
        }).catch((error) => {
            //error callback
        });
    };
}

export const addBooking = (name, value, details, date, categoryId) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }

        firebase.database().ref(`${USERNAME}/Finance/Bookings`).push({
            name: encryptString(name, FIREBASE_PASSWORD),
            value: encryptString(value.toString(), FIREBASE_PASSWORD),
            details,
            date: date.toString(),
            categoryId
        }).then((data) => {
            //success callback
            dispatch({
                type: ADD_BOOKING,
                id: data.key,
                name: name,
                value: parseFloat(value),
                details: details,
                date: date,
                categoryId: categoryId,
            });
        }).catch((error) => {
            //error callback
        });
    };
};

export const updateBooking = (id, name, value, details, date, categoryId) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        firebase.database().ref(`${USERNAME}/Finance/Bookings/${id}`).set({
            name: encryptString(name, FIREBASE_PASSWORD),
            value: encryptString(value.toString(), FIREBASE_PASSWORD),
            details,
            date: date.toString(),
            categoryId
        }).then((data) => {
            //success callback
            dispatch({
                type: UPDATE_BOOKING,
                id: id,
                name: name,
                value: parseFloat(value),
                details: details,
                date: date,
                categoryId: categoryId,
            });
        }).catch((error) => {
            //error callback
        });
    };
};