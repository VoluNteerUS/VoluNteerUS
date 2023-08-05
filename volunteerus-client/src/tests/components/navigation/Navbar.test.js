import { render } from '@testing-library/react';
import Navbar from "../../../components/navigation/Navbar"
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/lib/integration/react';
import { store, persistor } from '../../../store';
describe("Navbar", () => {
    test("renders navbar", () => {
        render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <Navbar />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    });
});