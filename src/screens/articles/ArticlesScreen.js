import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, StyleSheet, VirtualizedList, Image, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { graphql } from 'react-apollo';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { autobind } from 'core-decorators';
import articlesQuery from 'queries/articles.gql';
import { ARTICLES_DETAIL_SCREEN } from 'screens';
import { PRIMARY_COLOR_TEXT } from 'theme';

const articlesOptions = {
  name: 'articles',
  options: {
    variables: {
      offset: 0,
      limit: 2,
    },
    fetchPolicy: 'network-only',
  },
};

@graphql(articlesQuery, articlesOptions)
@observer
export default class ArticlesScreen extends Component {

  static propTypes = {
    articles: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.object, // eslint-disable-line
      articles: PropTypes.array, // eslint-disable-line
      refetch: PropTypes.func,
      fetchMore: PropTypes.func,
    }).isRequired,
    navigator: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  static navigatorStyle = {
    navBarTranslucent: true,
    drawUnderNavBar: true,
    drawUnderTabBar: true,
    navBarButtonColor: PRIMARY_COLOR_TEXT,
  }

  state = {
    scrollY: new Animated.Value(0),
  }

  @autobind
  onEndReached() {
    const { fetchMore, articles } = this.props.articles;
    if (!articles) return;
    fetchMore({
      variables: {
        offset: articles.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return previousResult; }
        return {
          ...previousResult,
          articles: [...previousResult.articles, ...fetchMoreResult.articles]
          .filter((item, pos, self) => self.findIndex(sitem => sitem.id === item.id) === pos),
        };
      },
    });
  }

  @autobind
  onLayout() {
    // Update dimensions of viewport
    this.dimensions = Dimensions.get('window');
  }

  @observable
  dimensions = Dimensions.get('window');

  @observable
  items = new Map();

  @autobind
  renderItem({ item, index }) {

    const topOffset = Array.from(this.items.values()).slice(0, index).reduce((a, b) => a + b, 0);
    const inputRange = [topOffset - this.dimensions.height, topOffset];
    const onPress = () => this.props.navigator.push({
      screen: ARTICLES_DETAIL_SCREEN,
      title: item.title,
      passProps: {
        title: item.title,
        url: item.url,
      },
    });

    if (index === 0) {
      // We have no height for first item.
      // Let's just assume it.
      inputRange[0] = -this.dimensions.height;
      inputRange[1] = this.dimensions.height;
    }

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View onLayout={e => this.items.set(index, e.nativeEvent.layout.height)}>
          <View style={{ height: this.dimensions.width, overflow: 'hidden' }}>
            <Animated.View
              style={{
                transform: [{
                  translateY: this.state.scrollY.interpolate({
                    inputRange,
                    outputRange: [-100, 0],
                    extrapolate: 'clamp',
                  }),
                }],
              }}
            >
              <Image
                source={{ uri: `https:${item.image}` }}
                resizeMode="contain"
                style={{
                  width: this.dimensions.width,
                  height: this.dimensions.width * (380 / 300),
                }}
              />
            </Animated.View>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      articles = [],
      error,
    } = this.props.articles;

    if (error) {
      return (
        <ScrollView>
          <View style={{ height: 1000, backgroundColor: '#AEC' }}>
            <Text>Hello</Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={{ flex: 1, width: this.dimensions.width }} onLayout={this.onLayout}>
        <VirtualizedList
          data={articles}
          renderItem={this.renderItem}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])}
          scrollEventThrottle={1}
          getItemCount={data => data.length}
          getItem={(data, i) => data[i]}
          keyExtractor={item => item.id}
          onEndReached={this.onEndReached}
          ListHeaderComponent={() => <View style={{ height: 64 }} />}
          ListFooterComponent={() => <View style={{ height: 49 }} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },

  title: {
    color: '#000000',
    fontFamily: 'HelveticaNeue',
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 10,
  },

  description: {
    color: '#010101',
    fontFamily: 'HelveticaNeue',
    fontWeight: '300',
    fontSize: 18,
  },

});
