import { fireEvent, render, screen } from '@testing-library/react';
import AppDialog from '../../components/AppDialog';


describe('AppDialog', () => {
    test('renders appDialog', () => {
        let isOpen = true;

        render(
            <AppDialog
                isOpen={isOpen}
                title={"Test Dialog"}
                description={"Describes the action"}
                warningMessage={"Describes the consequences"}
                actionName={"Action Name"}
                handleAction={() => { }}
                handleClose={() => { isOpen = false }}
            />
        );
        expect(screen.getByText(/Test Dialog/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Close/i));
        expect(isOpen).toBe(false);
    });
})