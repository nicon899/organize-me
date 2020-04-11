import {
  ADD_CATEGORY,
  ADD_BOOKING,
  UPDATE_BOOKING,
  SET_FINANCES,
} from '../actions/finances';
import Category from '../../models/category';
import Booking from '../../models/booking';

const initialState = {
  categories: [],
  bookings: [],
};

export default (state = initialState, action) => {
  const updatedCategories = [...state.categories];
  const updatedBookings = [...state.bookings];

  switch (action.type) {
    case SET_FINANCES:
      return {
        ...state,
        bookings: action.bookings,
        categories: action.categories
      };

    case ADD_CATEGORY:
      updatedCategories.push(new Category(
        action.id,
        action.name,
        action.parentId
      ));

      return {
        ...state,
        categories: updatedCategories
      };
    case ADD_BOOKING:
      updatedBookings.push(new Booking(
        action.id,
        action.name,
        action.value,
        action.details,
        action.date,
        action.categoryId,
      ));

      return {
        ...state,
        bookings: updatedBookings,
        categories: updatedCategories
      };

    case UPDATE_BOOKING:
      const oldBookingIndex = updatedBookings.findIndex((book) => book.id === action.id);

      updatedBookings[oldBookingIndex].name = action.name;
      updatedBookings[oldBookingIndex].value = action.value;
      updatedBookings[oldBookingIndex].details = action.details;
      updatedBookings[oldBookingIndex].date = action.date;
      updatedBookings[oldBookingIndex].categoryId = action.categoryId;

      return {
        ...state,
        bookings: updatedBookings,
        categories: updatedCategories
      };
  }
  return state;
};
