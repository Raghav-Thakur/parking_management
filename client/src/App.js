import './App.css';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        {/* Add your main content here */}
        <h1>Welcome to the App!</h1>
        <p>This is the main content of the application.</p>
      </div>
      <Footer />
    </div>
  );
}

export default App;
