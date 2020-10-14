import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import financeReducer from './store/reducers/finances';
import taskReducer from './store/reducers/tasks';
import { MainNavigator } from './navigation/AppNavigator';

const rootReducer = combineReducers({
  finances: financeReducer,
  tasks: taskReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.screen}>
          <StatusBar backgroundColor="black" />
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black'
  }
});