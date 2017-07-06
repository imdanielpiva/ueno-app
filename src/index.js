/* eslint global-require: 0 */
import 'utils/reactotron';
import { Navigation } from 'react-native-navigation';
import registerConnectedScreen from './utils/registerConnectedScreen';
import Home from './screens/Home';
import Articles from './screens/Articles';
import Contacts from './screens/Contacts';
import ContactsDetail from './screens/ContactsDetail';
import JobApplications from './screens/JobApplications';

registerConnectedScreen('Home', () => Home);
registerConnectedScreen('Articles', () => Articles);
registerConnectedScreen('JobApplications', () => JobApplications);
registerConnectedScreen('Contacts', () => Contacts);
registerConnectedScreen('ContactsDetail', () => ContactsDetail);

const defaultScreen = {
  screen: 'Home',
  title: 'ueno.',
  navigatorStyle: {
    navBarHidden: true,
  },
};

const startApp = (screen = defaultScreen) => Navigation.startSingleScreenApp({ screen });

startApp();
