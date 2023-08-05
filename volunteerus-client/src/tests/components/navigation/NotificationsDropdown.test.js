import { render } from "@testing-library/react";
import NotificationsDropdown from "../../../components/navigation/NotificationsDropdown";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/lib/integration/react';
import { store, persistor } from '../../../store';

describe("NotificationsDropdown", () => {
    test("renders notificationsDropdown", () => {
        render(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <BrowserRouter>
                        <NotificationsDropdown />
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        );
    });
});