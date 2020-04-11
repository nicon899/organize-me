import Category from '../../models/category';
import Booking from '../../models/booking';

export const ADD_CATEGORY = 'ADD_CATEGORY';
export const ADD_BOOKING = 'ADD_BOOKING';
export const UPDATE_BOOKING = 'UPDATE_BOOKING';
export const SET_FINANCES = 'SET_FINANCES';

const USERNAME = 'Nico';

export const fetchFinanceData = () => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }
        const categories = [];
        const bookings = [];

        firebase.database().ref(`${USERNAME}/Finance/Categories`).once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                categories.push(
                    new Category(childSnapshot.key, childSnapshot.child('name').val(), childSnapshot.child('parentId').val())
                )
            });
        });

        firebase.database().ref(`${USERNAME}/Finance/Bookings`).once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                bookings.push(
                    new Booking(childSnapshot.key, childSnapshot.child('name').val(),
                        parseFloat(childSnapshot.child('value').val()), childSnapshot.child('details').val(),
                        new Date(childSnapshot.child('date').val()), childSnapshot.child('categoryId').val())
                )
            });
        });
        dispatch({
            type: SET_FINANCES,
            categories: categories,
            bookings: bookings
        });
    }
}


export const addCategory = (name, parentId) => {
    return dispatch => {
        const firebase = require("firebase");
        if (!firebase.apps.length) {
            firebase.initializeApp({
                databaseURL: "https://organize-me-private.firebaseio.com/",
                projectId: "organize-me-private",
            });
        }

        firebase.database().ref(`${USERNAME}/Finance/Categories`).push({
            name,
            parentId
        }).then((data) => {
            //success callback
            dispatch({
                type: ADD_CATEGORY,
                id: data.key,
                name: name,
                parentId: parentId
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
            name,
            value,
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
            name,
            value,
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