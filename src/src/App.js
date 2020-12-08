import React from "react";
import "./App.css";

import { Container } from "react-bootstrap";
import { Route, Switch, withRouter } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import Header from "./components/Header";
import Premium from "./components/Premium";
import Home from "./components/Home";
import Footer from "./components/Footer";

class App extends React.Component {
  render() {
    const App = withRouter(({ location }) => (
      <Container fluid id="main-container">
        <Header />
        <SwitchTransition mode={'out-in'}>
          <CSSTransition key={location.key} classNames="fade" timeout={300}>
            <Switch location={location}>
              <Route exact path="/" component={Home} />
              <Route path="/premium" component={Premium} />
            </Switch>
          </CSSTransition>
        </SwitchTransition>
        <Footer />
      </Container>
    ));
    return <App />;
  }
}

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { apiResponse: "" };
//   }

//   callAPI() {
//     fetch("http://localhost:8080/test")
//       .then((res) => res.text())
//       .then((res) => this.setState({ apiResponse: res }));
//   }

//   componentWillMount() {
//     this.callAPI();
//   }

//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//           <p className="App-intro">{this.state.apiResponse}</p>
//         </header>
//       </div>
//     );
//   }
// }

export default App;
