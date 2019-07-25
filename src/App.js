import React, { Component } from 'react';
import UsernameForm from './components/UsernameForm/UsernameForm';
import ChatScreen from './ChatScreen';

class App extends Component {

    constructor() {
        super();

        this.state = {
            currentScreen: 'WhatIsYourUsernameScreen',
            currentUsername: '',
        }

        this.onUsernameSubmitted = this.onUsernameSubmitted.bind(this);
    }

    onUsernameSubmitted(username) {

        //TODO: validation for special characters etc.
        if (username && username !== '') {
            fetch('http://localhost:1337/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
                .then(res => {

                    //console.log('success', username);

                    this.setState({
                        currentUsername: username,
                        currentScreen: 'ChatScreen'
                    });

                })
                .catch(error => {
                    console.error('error', error);
                });
        } else {
            let orig = document.getElementById('usernameForm').className;
            document.getElementById('usernameForm').className = 'shake';
            setTimeout(() => {
                document.getElementById('usernameForm').classList = orig;
            }, 820);
        }
    }

    render() {
        if (this.state.currentScreen === 'WhatIsYourUsernameScreen') {
            return <div className='chatScreen'><UsernameForm onSubmit={this.onUsernameSubmitted} /></div>

        }
        if (this.state.currentScreen === 'ChatScreen') {
            return <div className='chatScreen'><ChatScreen currentUsername={this.state.currentUsername} /></div>
        }
    }
}

export default App;
