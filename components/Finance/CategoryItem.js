import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CategoryItem = props => {
    return (
        <TouchableOpacity
            onPress={() => {
                props.showContent(props.item.id);
            }}
        >
            <Text>{props.item.name} {props.item.value} €</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

});

export default CategoryItem;
