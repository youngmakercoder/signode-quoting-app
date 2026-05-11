import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  async function loadUser() {
    const response = await fetch("/.auth/me");
    const data = await response.json();
    setUser(data.clientPrincipal);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <main className="container">
      <h1>Signode Quoting App</h1>

      {!user ? (
        <>
          <p>You are not signed in.</p>
          <a href="/.auth/login/aad" className="button">
            Sign in with Microsoft Entra ID
          </a>
        </>
      ) : (
        <>
          <p>Signed in as:</p>
          <strong>{user.userDetails}</strong>

          <h2>Roles</h2>
          <pre>{JSON.stringify(user.userRoles, null, 2)}</pre>

          <a href="/.auth/logout" className="button">
            Sign out
          </a>
        </>
      )}
    </main>
  );
}

export default App;