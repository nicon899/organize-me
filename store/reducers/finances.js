import {
  ADD_CATEGORY,
  ADD_BOOKING,
  UPDATE_BOOKING,
} from '../actions/finances';
import Category from '../../models/category';
import Booking from '../../models/booking';

const initialState = {
  categories: [new Category(0, 'Unkategorisiert', 0, -1)],
  bookings: [],
};

export default (state = initialState, action) => {
  const updatedCategories = [...state.categories];
  const updatedBookings = [...state.bookings];
  let catIndex;

  //Update Category Value
  const updateCategory = (id, value) => {
    catIndex = updatedCategories.findIndex((cat) => cat.id === id);
    let newValue = Math.round((updatedCategories[catIndex].value + value) * 100 + Number.EPSILON) / 100;
    updatedCategories[catIndex].value = newValue;
    if (updatedCategories[catIndex].parentId != -1) {
      updateCategory(updatedCategories[catIndex].parentId, value);
    }
  }

  switch (action.type) {
    case ADD_CATEGORY:
      updatedCategories.push(new Category(
        action.id,
        action.name,
        0.0,
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

      updateCategory(action.categoryId, action.value);

      return {
        ...state,
        bookings: updatedBookings,
        categories: updatedCategories
      };

    case UPDATE_BOOKING:
      const oldBookingIndex = updatedBookings.findIndex((book) => book.id === action.id);

      //Update Category Value
      updateCategory(updatedBookings[oldBookingIndex].categoryId, -1 * updatedBookings[oldBookingIndex].value);
      updateCategory(action.categoryId, action.value);

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
