import * as actions from '../../../app/reduxContent/message/actions';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();
const store = mockStore();

beforeEach(() => { 
    store.clearActions();
});

describe('Messages clear and create', () => {
    it('should return exact type', () => {
        store.dispatch(actions.clearMessageState());
        expect(store.getActions()).toMatchSnapshot();
    });

    it('should return exact type and payload', () => {
        store.dispatch(actions.createMessage('test',true));
        expect(store.getActions()).toMatchSnapshot();
    });
})