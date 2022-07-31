import ReactDOM from 'react-dom/client';
import './index.css';
import {Tezori3} from "./components/Tezori3";
import { GlobalProvider } from './context/GlobalState';
import {HashRouter} from 'react-router-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import Theme from './theme'

const theme = createTheme(Theme);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
      <GlobalProvider address={""} apiKey={""} derivationPath={""} network={""} tezosServer={""} beaconClient={null} isAddressInitialized={false}>
        <HashRouter basename={"/"}>
          <ThemeProvider theme={theme}>
          <Tezori3 />
          </ThemeProvider>
        </HashRouter>
      </GlobalProvider>
);

