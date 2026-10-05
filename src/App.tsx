import Dashboard from './pages/Dashboard/Dashboard';
import Ingredients from './pages/Ingredients/Ingredients';
import Users from './pages/Users/Users';
import UserDetails from './pages/Users/UserDetails';
import Login from './auth/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import { useAuth } from './auth/context';

function App() {
	const { isAuthenticated } = useAuth();
  const path = window.location.pathname;
  const userDetailsMatch = path.match(/^\/users\/([^/]+)$/);

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
