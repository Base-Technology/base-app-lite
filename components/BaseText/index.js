import React, { Component } from "react";
import { Text } from "react-native";

export default function BaseText(props) {
    return (
        <Text {...props} style={{fontSize:12, fontFamily: 'Karla-Light',color:'#000',lineHeight:20,...props.style }}>
            {props.children}
        </Text>
    )
}