import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import "./App.css";

function App() {
  const { instance, accounts } = useMsal();

  const user = accounts[0];

  async function signIn() {
    await instance.loginRedirect(loginRequest);
  }

  async function signOut() {
    await instance.logoutRedirect();
  }

  return (
    <main className="container">
      <h1>Signode Quoting App</h1>

      {!user ? (
        <>
          <p>You are not signed in.</p>

          <button onClick={signIn} className="button">
            Sign in with Microsoft Entra ID
          </button>
        </>
      ) : (
        <>
          <p>Signed in as:</p>
          <strong>{user.username}</strong>

          <h2>MSAL account object</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>

          <button onClick={signOut} className="button">
            Sign out
          </button>
        </>
      )}
    </main>
  );
}

export default App;