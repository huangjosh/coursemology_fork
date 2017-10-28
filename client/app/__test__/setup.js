import PropTypes from 'prop-types';
import { IntlProvider, intlShape } from 'react-intl';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

require('babel-polyfill');
// Our jquery is from CDN and loaded at runtime, so this is required in test.
const jQuery = require('jquery');

const timeZone = "Asia/Singapore";
const intlProvider = new IntlProvider({ locale: 'en', timeZone }, {});
const courseId = "1";

const muiTheme = getMuiTheme();
const buildContextOptions = store => ({
  context: { intl, store, muiTheme },
  childContextTypes: {
    muiTheme: PropTypes.object,
    store: PropTypes.object,
    intl: intlShape,
  },
});

// Global variables
global.courseId = courseId;
global.window = window;
global.intl = intlProvider.getChildContext().intl;
global.intlShape = intlShape;
global.muiTheme = muiTheme;
global.$ = jQuery;
global.jQuery = jQuery;
global.buildContextOptions = buildContextOptions;

// Global mocks
document.head.innerHTML =
  `<meta name="server-context" data-i18n-locale="en" data-time-zone="${timeZone}">`;

Object.defineProperty(window.location, 'pathname', {
  configurable: true,
  value: `/courses/${courseId}`,
});

// Global helper functions

// Sleep for a given period in ms.
function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
global.sleep = sleep;

// summernote does not work well with jsdom in tests, stub it to normal text field.
jest.mock('lib/components/redux-form/RichTextField', () => {
  const TextField = require.requireActual('lib/components/redux-form/TextField');
  return TextField;
});
