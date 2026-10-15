import Dashboard from './pages/Dashboard/Dashboard';
import Ingredients from './pages/Ingredients/Ingredients';
import Users from './pages/Users/Users';
import UserDetails from './pages/Users/UserDetails';
import Login from './auth/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/context';

function App() {
	const { isAuthenticated, status } = useAuth();
  const path = window.location.pathname;
  const userDetailsMatch = path.match(/^\/users\/([^/]+)$/);

  if (status === 'checking') {
    return (
      <main className="grid min-h-screen place-items-center bg-[#FAF5F4] px-4">
        <p role="status" className="text-[12px] text-[#1E0C08]/60">Checking your session…</p>
      </main>
    );
  }

  if (path === '/login') return isAuthenticated ? <Dashboard /> : <Login />;

  let page = <Dashboard />;
  if (userDetailsMatch) {
    page = <UserDetails userId={decodeURIComponent(userDetailsMatch[1])} />;
	} else if (path.startsWith('/users')) {
		page = <Users />;
	} else if (path.startsWith('/ingredients')) {
		page = <Ingredients />;
	}

	return <ProtectedRoute>{page}</ProtectedRoute>;
}

export default App;
