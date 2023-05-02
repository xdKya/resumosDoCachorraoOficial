import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "react-native-paper";
import firebase from "firebase";

SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Mario-Kart-DS": require("../assets/Mario-Kart-DS.ttf"),
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: true,
      stories: [],
      text: "",
    };
  }

  pesquisar = () => {
    let text = this.state.text;
    if (text === "") {
      this.fetchStories();
      //console.log("mostrar tudo");
    } else {
      this.filterStories();
      //console.log("filtrar pesquisa");
    }
  };

  filterStories = () => {
    let pesquisado = this.state.text.toUpperCase();
    //console.log("o que foi pesquisado: " + pesquisado);
    firebase
      .database()
      .ref("/posts/")
      .on("value", (data) => {
        let stories = [];

        if (data.val()) {
          Object.keys(data.val()).forEach(function (key) {
            // console.log("valor de cada post: ");
            // console.log(data.val()[key]);

            // console.log("valor do titulo  de cada post: ");
            // console.log(data.val()[key].title);

            if (data.val()[key].title.toUpperCase() == pesquisado) {
              // console.log("salvando o valor pesquisado:");
              // console.log(data.val()[key]);

              //consegui!
              stories.push({
                key: key,
                value: data.val()[key],
              });
            }
          });
        }
        this.setState({ stories: stories });
      });
  };

  fetchStories = () => {
    firebase
      .database()
      .ref("/posts/")
      .on(
        "value",
        (snapshot) => {
          let stories = [];
          if (snapshot.val()) {
            Object.keys(snapshot.val()).forEach(function (key) {
              stories.push({
                key: key,
                value: snapshot.val()[key],
              });
            });
          }
          this.setState({ stories: stories });
          this.props.setUpdateToFalse();
        },
        function (errorObject) {
          console.log("A leitura falhou: " + errorObject.code);
        }
      );
  };

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
    this.fetchStories();
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

  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
          style={
            this.state.light_theme ? styles.containerClaro : styles.container
          }
        >
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextClaro
                    : styles.appTitleText
                }
              >
                Resumos (☞ﾟヮﾟ)☞
              </Text>
            </View>
          </View>

          <View style={styles.textinputContainer}>
            <TextInput
              style={
                this.state.light_theme
                  ? styles.textinputLight
                  : styles.textinput
              }
              onChangeText={(text) => this.setState({ text: text })}
              placeholder={"Pesquisar"}
              placeholderTextColor={"#FFFFFF"}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => this.pesquisar()}
            >
              <Text
                style={
                  this.state.light_theme
                    ? styles.scanbuttonTextLight
                    : styles.scanbuttonText
                }
              >
                🔍
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardContainer}>
            {!this.state.stories[0] ? (
              <View style={styles.noStories}>
                <Text
                  style={
                    this.state.light_theme
                      ? styles.noStoriesTextLight
                      : styles.noStoriesText
                  }
                >
                  {" "}
                  Você não escreveu nenhum resumo ainda mané😐
                </Text>
              </View>
            ) : (
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.stories}
                renderItem={this.renderItem}
              />
            )}
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
  },
  containerClaro: {
    flex: 1,
    backgroundColorClaro: "white",
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.15,
    flexDirection: "row",
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: RFValue(10),
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center",
    marginBottom: RFValue(10),
  },

  textinputContainer: {
    //alignSelf: "center",

    //borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 2,
    //backgroundColor: "white",
    //marginTop: RFValue(10),
  },
  textinput: {
    borderWidth: 1,
    borderColor: "white",
    width: "100%",
    height: RFValue(35),
    padding: 10,
    fontSize: RFValue(18),
    fontFamily: "Mario-Kart-DS",
    color: "#FFFFFF",
    textAlign: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    //borderBottomRightRadius: 30,
    //marginBottom: RFValue(10),
    placeholderTextColor: "white",
  },
  textinputLight: {
    borderWidth: 1,
    borderColor: "black",
    width: "100%",
    height: RFValue(35),
    padding: 10,
    fontSize: RFValue(18),
    fontFamily: "Mario-Kart-DS",
    color: "black",
    textAlign: "center",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    //borderBottomRightRadius: 30,
    //marginBottom: RFValue(10),
    placeholderTextColor: "black",
  },
  scanbutton: {
    width: RFValue(80),
    height: RFValue(35),
    backgroundColor: "#D4EBCA",
    borderTopRightRadius: 10,
    // borderBottomRightRadius: 5,
    //justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    //marginBottom: RFValue(10),
    borderBottomRightRadius: 10,
  },
  scanbuttonText: {
    fontSize: RFValue(28),
    color: "white",
    fontFamily: "Mario-Kart-DS",
    textAlign: "center",
  },
  scanbuttonTextLight: {
    fontSize: RFValue(28),
    color: "black",
    fontFamily: "Mario-Kart-DS",
    textAlign: "center",
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Mario-Kart-DS",
  },
  appTitleTextClaro: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Mario-Kart-DS",
  },
  cardContainer: {
    flex: 0.85,
  },
  noStories: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
  },
  noStoriesTextLight: {
    fontSize: RFValue(40),
    fontFamily: "Mario-Kart-DS",
  },
  noStoriesText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Mario-Kart-DS",
  },
});
