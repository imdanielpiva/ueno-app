import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import {
  JOB_APPLICATIONS_SCREEN,
  CONTACT_FORMS_SCREEN,
} from 'screens';
import Button from 'components/button';

export default class BusinessScreen extends Component {

  static propTypes = {
    navigator: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  onJobApplicationsPress = () => {
    this.props.navigator.push({
      screen: JOB_APPLICATIONS_SCREEN,
    });
  }

  onContactFormsPress = () => {
    this.props.navigator.push({
      screen: CONTACT_FORMS_SCREEN,
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <Text>BUSINESS_SCREEN</Text>

        <View style={{ height: 50 }} />

        <Button onPress={this.onJobApplicationsPress}>Job Applications</Button>
        <Button onPress={this.onContactFormsPress}>Contact Forms</Button>
        <Button>Website Uptimes</Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
