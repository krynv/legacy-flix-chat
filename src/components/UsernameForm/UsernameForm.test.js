import React from 'react';
import ReactDOM from 'react-dom';
import UsernameForm from './UsernameForm';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { stub } from 'sinon';

configure({ adapter: new Adapter() });

describe('<UsernameForm />', () => {

    it('component renders wihout crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<UsernameForm />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('onSubmit gets handled correctly', () => {
        let onSubmitFn = jest.fn();
        let wrapper = mount(< UsernameForm onSubmit={onSubmitFn} />);
        let inputForm = wrapper.find('form');

        inputForm.simulate('submit');
        expect(onSubmitFn).toHaveBeenCalledTimes(1);
    });

    it('onChange event is handled correctly', () => {
        let onChangeFn = jest.fn();
        let component = shallow(<UsernameForm onChange={onChangeFn} />);
        let form = component.find('input');

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

