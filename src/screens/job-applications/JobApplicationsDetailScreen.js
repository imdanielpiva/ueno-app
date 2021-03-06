import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, ScrollView, View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { graphql } from 'react-apollo';
import jobDetailQuery from 'queries/job.gql';

const queryOptions = {
  name: 'data',
  options: ({ item }) => ({
    variables: {
      id: item.id,
    },
  }),
};

@graphql(jobDetailQuery, queryOptions)
export default class JobApplicationDetail extends Component {

  static propTypes = {
    data: PropTypes.shape({
      application: PropTypes.shape({
        email: PropTypes.string,
        avatarUrl: PropTypes.string,
        job: PropTypes.object,
        created: PropTypes.string,
        externals: PropTypes.array,
      }),
      loading: PropTypes.bool,
    }).isRequired,
  }

  renderExternal({ url }) {
    const onPress = () => {
      const link = /^https?:\/\//.test(url) ? url : `http://${url}`;
      Linking.canOpenURL(link).then((isSupported) => {
        if (isSupported) {
          return Linking.openURL(link);
        }
        return Alert.alert('Could not open', 'No suitable app found');
      });
    };

    return (
      <TouchableOpacity onPress={onPress} style={styles.head} key={url}>
        <Text style={styles.status}>{url}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      application = { job: {} },
      loading,
    } = this.props.data;

    const {
      email,
      avatarUrl,
      job: { position, location },
      created,
      externals = [],
      visaStatus,
    } = application;

    if (loading) return null;

    return (
      <View style={styles.container}>
        <View style={styles.head}>
          <View style={styles.headImage}>
            <Image style={styles.avatar} source={{ uri: avatarUrl }} />
          </View>
          <View style={styles.headInfo}>
            <Text style={styles.email}>{email}</Text>
            <Text>{position} - {location}</Text>
            <Text>{(new Date(+created)).toDateString()}</Text>
          </View>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.status}>{visaStatus}</Text>
          {externals.map(this.renderExternal)}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: 10,
  },

  head: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },

  headImage: {
    paddingRight: 20,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  headInfo: {
    justifyContent: 'center',
  },

  email: {
    fontWeight: '700',
    fontSize: 18,
    paddingBottom: 5,
  },

  content: {
    paddingTop: 20,
  },

  status: {
    fontSize: 18,
  },
};
