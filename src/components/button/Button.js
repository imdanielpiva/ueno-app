import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { PRIMARY_COLOR } from 'theme';

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    children: null,
    onPress: () => {},
  };

  render() {
    const { children, onPress } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Text style={styles.label}>{children.toString().toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },

  label: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
