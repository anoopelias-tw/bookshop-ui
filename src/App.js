import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect, useState } from "react";
import Header from './Header/Header';

function login() {
    window.location.href = "http://localhost:8090/default/authorize?client_id=bookshop&scope=openid+user&response_type=code&response_mode=query&state=1234&nonce=5678&redirect_uri=http%3A%2F%2Flocalhost%3A3000";
}

const Tokens = () => {
    const [tokens, setTokens] = useState({});
    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
            return;
        }

        const data = {
            code: code,
            grant_type: "authorization_code",
            scope: "openid user",
            redirect_uri: "http://localhost:3000",
            client_id: "bookshop",
        };

        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        formBody = formBody.join("&");
        fetch("http://localhost:8090/default/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "origin": "http://localhost:3000",
            },
            body: formBody
        }).then((response) => {
            return response.json();
        }).then ((responseJson) => {
            console.log("set");
            setTokens(responseJson);
        });
    }, []);

    return <div>Tokens:
            <p>access_token:{tokens["access_token"]}</p>
            <p>id_token:{tokens["id_token"]}</p>
            <p>refresh_token:{tokens["refresh_token"]}</p>
            </div>;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <Tokens />
        <button onClick={login}>Login</button>
      </header>
    </div>
  );
}

export default App;
