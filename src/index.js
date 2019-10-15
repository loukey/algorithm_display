import React from 'react';
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Home from "./router/home/home";
import Register from "./router/register/register";
import Record from "./router/record/record";

export default function Navigator() {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/Register">Register</Link>
                        </li>
                        <li>
                            <Link to="/Record">Record</Link>
                        </li>
                    </ul>
                </nav>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/Register">
                        <Register />
                    </Route>
                    <Route path="/Record">
                        <Record />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

const nav = Navigator()

ReactDOM.render(
    nav,
    document.getElementById('root')
)