import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client'
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import TypingIndicator from './components/TypingIndicator';
import OnlineList from './components/OnlineList';

class ChatScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersWhoAreTyping: [],
        }

        this.sendMessage = this.sendMessage.bind(this);
        this.sendTypingEvent = this.sendTypingEvent.bind(this);
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            roomId: this.state.currentRoom.id,
            text,
        });
    }

    sendTypingEvent() {
        // gets the state of the user to show if typing
        this.state.currentUser.isTypingIn({
            roomId: this.state.currentRoom.id
        })
            .catch(error => console.error('error', error));
        // ^ just in case anything goes wrong
    }

    componentDidMount() {

        const chatManager = new ChatManager({
            instanceLocator: 'v1:us1:4f6486d4-e89d-400c-b3cc-2c3b3ba0e8b5',
            userId: this.props.currentUsername,
            tokenProvider: new TokenProvider({
                url: 'http://localhost:1337/authenticate'
            }),
        });

        chatManager.connect().then(currentUser => {
            //console.log('currentUser', currentUser);
            this.setState({ currentUser });

            // returns a promise
            return currentUser.subscribeToRoomMultipart({
                roomId: '9548428',
                messageLimit: 0,
                hooks: {
                    onMessage: message => {
                        this.setState({
                            messages: [...this.state.messages, message],
                        });
                    },
                    onUserStartedTyping: user => {
                        //console.log(user.name, 'started typing'); 
                        this.setState({
                            usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name]
                        });
                    },
                    onUserStoppedTyping: user => {
                        //console.log(user.name, 'stopped typing'); 
                        this.setState({
                            usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                                username => username !== user.name
                            ),
                        });
                    },
                    // call render again, which causes the user property to get re-evaluated again
                    onUserOnline: () => {
                        this.forceUpdate();
                    },
                    onUserOffline: () => {
                        this.forceUpdate();
                    },
                    onUserJoined: () => {
                        this.forceUpdate();
                    },

                }
            }).then(currentRoom => {
                // gives easier access to current room (and user) properties
                this.setState({ currentRoom });
            });

        }).catch(error => {
            console.error(error);
        });
    }

    render() {

        const styles = {
            container: {
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
            },
            chatContainer: {
                display: 'flex',
                flex: 1,
                backgroundColor: '#282828',
                color: 'white',
            },
            onlineListContainer: {
                width: '15%',
                padding: 20,
                backgroundColor: '#2c303b',
                color: 'white',
            },
            chatListContainer: {
                padding: 20,
                width: '85%',
                display: 'flex',
                flexDirection: 'column',
            },
        }

        return (
            <div style={styles.container}>
                <div style={styles.chatContainer}>
                    <aside style={styles.onlineListContainer}>
                        <OnlineList currentUser={this.state.currentUser} users={this.state.currentRoom.users} />
                    </aside>
                    <section style={styles.chatListContainer}>
                        <MessageList messages={this.state.messages} style={styles.chatList} />
                        <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                        <SendMessageForm onSubmit={this.sendMessage} onChange={this.sendTypingEvent} />
                    </section>
                </div>
            </div>
        );
    }
}

export default ChatScreen;