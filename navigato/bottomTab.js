import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";

import Feed from "../screens/feed";
import CreateStory from "../screens/createStory";
const Tab = createMaterialBottomTabNavigator();

import firebase from "firebase";

export default class BottomTabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdated: false,
      light_theme: false,
    };
  }
  componentDidMount() {
    this.fetchUser();
  }
  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({
          light_theme: theme === "light" ? true : false,
        });
      });
  }

  renderFeed = (props) => {
    return <Feed setUpdateToFalse={this.removeUpdated} {...props} />;
  };

  renderStory = (props) => {
    return <CreateStory setUpdateToTrue={this.changeUpdated} {...props} />;
  };

  changeUpdated = () => {
    this.setState({ isUpdated: true });
  };

  removeUpdated = () => {
    this.setState({ isUpdated: false });
  };

  render() {
    return (
      <Tab.Navigator
        labeled={false}
        barStyle={
          this.state.light_theme
            ? styles.bottomTabStyleLight
            : styles.bottomTabStyle
        }
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Feed") {
              iconName = focused ? "newspaper" : "newspaper-outline";
            } else if (route.name === "Criar Resumo") {
              iconName = focused ? "pencil" : "pencil-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={RFValue(25)}
                color={color}
                style={styles.icons}
              />
            );
          },
        })}
        activeColor={"lightgreen"}
        inactiveColor={"gray"}
      >
        <Tab.Screen
          name="Feed"
          component={this.renderFeed}
          options={{ unmountOnBlur: true }}
        />
        <Tab.Screen
          name="Criar Resumo"
          component={this.renderStory}
          options={{ unmountOnBlur: true }}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  bottomTabStyle: {
    backgroundColor: "#2f345d",
    height: "8%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute",
  },
  bottomTabStyleLight: {
    backgroundColor: "#F2F2F2",
    height: "8%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute",
  },
  icons: {
    width: RFValue(30),
    height: RFValue(30),
  },
});
