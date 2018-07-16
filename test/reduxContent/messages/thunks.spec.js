import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { addMessage } from '../../../app/reduxContent/message/thunks';
import * as actions from '../../../app/reduxContent/message/actions';

const middlewares = [thunk]
const mockStore = configureStore(middlewares)
const store = mockStore()

beforeEach(() => {
    store.clearActions();
});

describe('Thunk action', () => {
    it('should dispatch expected actions', () => {
        const expectedActions = [
            'ADD_MESSAGE',
        ];

        return
        store.dispatch(addMessage('test', true))
            .then(() => {
                const actualActions = store.getActions().map(action => action.type)
                expect(actualActions).toEqual(expectedActions)
            })
    })
});
