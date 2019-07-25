import React from 'react';
import ReactDOM from 'react-dom';
import UsernameForm from './UsernameForm';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { exportAllDeclaration } from '@babel/types';

configure({ adapter: new Adapter() });

describe('<UsernameForm />', () => {

    const onSubmitFn = jest.fn();
    const onChangeFn = jest.fn();

    const component = shallow(<UsernameForm onSubmit={onSubmitFn} onChange={onChangeFn} />);
    const form = component.find('input');

    it('component renders wihout crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<UsernameForm />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    // it('onSubmit gets handled correctly', () => {
    //     form.props().onSubmit({

    //     });
    //     // expect(onSubmitFn.calledOnce).to.equal(true);
    // });

    it('onChange event is handled correctly', () => {

        //trigger onChange event of our component
        form.props().onChange({
            target: {
                value: 'TestUser',
            }
        });

        //check our output
        expect(component.state('username')).toEqual('TestUser');
    });
});

