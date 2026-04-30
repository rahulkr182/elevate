import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(150);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, calorieGoal, proteinGoal);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8 rounded-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-accent/20 p-3 rounded-full">
            <Activity className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Email Address</label>
            <input 
              type="email" 
              className="input-field py-2" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Password</label>
            <input 
              type="password" 
              className="input-field py-2" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Calorie Goal</label>
              <input 
                type="number" 
                className="input-field py-2" 
                value={calorieGoal} 
                onChange={e => setCalorieGoal(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 opacity-80">Protein Goal (g)</label>
              <input 
                type="number" 
                className="input-field py-2" 
                value={proteinGoal} 
                onChange={e => setProteinGoal(e.target.value)} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn-secondary mt-6">
            Sign Up
          </button>
        </form>
        
        <p className="mt-6 text-center opacity-80">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
