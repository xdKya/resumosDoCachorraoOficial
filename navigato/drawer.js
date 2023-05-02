import React, { Component } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./stackNavigator";
import Profile from "../screens/profile";
import Logoff from "../screens/logoff";
import firebase from "firebase";

import CustomSidebarMenu from "../screens/CustomSideBarMenu";

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
    };
  }

  componentDidMount() {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  }

  render() {
    let props = this.props;
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: this.state.light_theme ? "blue" : "#29b6f6",
          drawerInactiveTintColor: this.state.light_theme ? "black" : "white",
          itemStyle: { marginVertical: 5 },
          drawerActiveBackgroundColor: this.state.light_theme
            ? "#81d4f4"
            : "rgba(0,0,255,0.5)",
        }}
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={StackNavigator}
          options={{ unmountOnBlur: true }}
        />
        <Drawer.Screen
          name="Perfil"
          component={Profile}
          options={{ unmountOnBlur: true }}
        />
        <Drawer.Screen
          name="Sair"
          component={Logoff}
          options={{ unmountOnBlur: true }}
        />
      </Drawer.Navigator>
    );
  }
}
