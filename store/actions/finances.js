export const ADD_CATEGORY = 'ADD_CATEGORY';
export const ADD_BOOKING = 'ADD_BOOKING';
export const UPDATE_BOOKING = 'UPDATE_BOOKING';

export const addCategory = (name, parentId) => {
    return {
        type: ADD_CATEGORY,
        id: 'cat' + Math.floor(Math.random() * Math.floor(999999)),
        name: name,
        parentId: parentId
    };
};

export const addBooking = (name, value, details, date, categoryId) => {
    return {
        type: ADD_BOOKING,
        id: 'book' + Math.floor(Math.random() * Math.floor(999999)),
        name: name,
        value: parseFloat(value),
        details: details,
        date: date,
        categoryId: categoryId,
    };
};

export const updateBooking = (id, name, value, details, date, categoryId) => {
    return {
        type: UPDATE_BOOKING,
        id: id,
        name: name,
        value: parseFloat(value),
        details: details,
        date: date,
        categoryId: categoryId,
    };
};