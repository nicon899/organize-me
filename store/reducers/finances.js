import {
  ADD_CATEGORY,
  ADD_BOOKING,
  UPDATE_CATEGORY_INDEX,
  UPDATE_CATEGORY_NAME,
  UPDATE_BOOKING,
  SET_FINANCES,
  DELETE_BOOKING,
  DELETE_CATEGORY,
} from '../actions/finances';
import Category from '../../models/category';
import Booking from '../../models/booking';

const initialState = {
  categories: [],
  bookings: [],
  loaded: false
};

export default (state = initialState, action) => {
  const updatedCategories = [...state.categories];
  const updatedBookings = [...state.bookings];

  switch (action.type) {
    case SET_FINANCES:
      return {
        ...state,
        bookings: action.bookings,
        categories: action.categories,
        loaded: true
      };

    case ADD_CATEGORY:
      updatedCategories.push(new Category(
        action.id,
        action.name,
        action.index,
        action.parentId
      ));

      return {
        ...state,
        categories: updatedCategories
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: [...state.categories].filter((cat) => cat.id != action.id)
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

    case DELETE_BOOKING:
      return {
        ...state,
        bookings: [...state.bookings].filter((booking) => booking.id != action.id)
      }

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

    case UPDATE_CATEGORY_NAME:
      const oldCategoryNameIndex = updatedCategories.findIndex((book) => book.id === action.id);
      updatedCategories[oldCategoryNameIndex].name = action.name;
      return {
        ...state,
        bookings: updatedBookings,
        categories: updatedCategories
      };

    case UPDATE_CATEGORY_INDEX:
      const oldCategoryIndexIndex = updatedCategories.findIndex((book) => book.id === action.id);
      updatedCategories[oldCategoryIndexIndex].index = action.index;
      return {
        ...state,
        bookings: updatedBookings,
        categories: updatedCategories
      };

  }
  return state;
};
