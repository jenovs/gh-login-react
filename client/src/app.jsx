import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    axios.get('/success').then(res => {
      this.setState({
        user: res.data.user
      })
    });
  }

  handleLogin() {
    // axios.get('/auth/github').then().catch();
    location.href = '/auth/github'
  }

  handleLogout() {
    this.setState({
      user: null
    });
    axios.get('/logout').then().catch();
  }

  render() {
    return(
      <div>
        {this.state.user ? <button onClick={this.handleLogout}>Logout</button> :
          <button onClick={this.handleLogin}>Login</button>}
        {this.state.user && <h1>Welcome @{this.state.user}</h1>}
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
