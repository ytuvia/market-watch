// project import
import { store } from 'store';
import { Provider as ReduxProvider } from 'react-redux';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
//import { withAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //
/*
const App = () => (
  <ThemeCustomization>
    <ScrollTop>
      <Routes />
    </ScrollTop>
  </ThemeCustomization>
);
*/
export default function App() {
  return (
    <ReduxProvider store={store}>
      <Authenticator>
        {({ signOut, user }) => (
          <ThemeCustomization>
            <ScrollTop>
              <Routes />
            </ScrollTop>
          </ThemeCustomization>
        )}
      </Authenticator>
    </ReduxProvider>
  )
}

//export default withAuthenticator(App,{hideSignUp:false});
