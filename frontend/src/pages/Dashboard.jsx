import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LogOut, Plus, Dumbbell, Utensils, Brain, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Forms state
  const [workoutForm, setWorkoutForm] = useState({ name: '', sets: '', reps: '', weight: '' });
  const [mealForm, setMealForm] = useState({ food: '', calories: '', protein: '' });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [workoutsRes, mealsRes] = await Promise.all([
        axios.get('http://127.0.0.1:5001/api/workouts', { headers }),
        axios.get('http://127.0.0.1:5001/api/meals', { headers })
      ]);
      setWorkouts(workoutsRes.data);
      setMeals(mealsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5001/api/workouts', workoutForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowWorkoutModal(false);
      setWorkoutForm({ name: '', sets: '', reps: '', weight: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding workout', error);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5001/api/meals', mealForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowMealModal(false);
      setMealForm({ food: '', calories: '', protein: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding meal', error);
    }
  };

  // Calculate today's totals
  const today = new Date().toDateString();
  const todaysMeals = meals.filter(m => new Date(m.date).toDateString() === today);
  const totalCalories = todaysMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = todaysMeals.reduce((acc, curr) => acc + curr.protein, 0);

  const caloriePercentage = Math.min((totalCalories / user.calorieGoal) * 100, 100).toFixed(0);
  const proteinPercentage = Math.min((totalProtein / user.proteinGoal) * 100, 100).toFixed(0);

  // Get AI Advice
  const getAiAdvice = async () => {
    setLoadingAi(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://127.0.0.1:5001/api/ai', {
        calories: totalCalories,
        protein: totalProtein,
        goal: `Calorie goal: ${user.calorieGoal}, Protein goal: ${user.proteinGoal}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiAdvice(res.data.advice);
    } catch (error) {
      setAiAdvice('Unable to get advice right now. Please try again later.');
    } finally {
      setLoadingAi(false);
    }
  };

  // Prepare Chart Data (Last 7 Days)
  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toDateString();
      const dayMeals = meals.filter(m => new Date(m.date).toDateString() === dateString);
      const cals = dayMeals.reduce((acc, curr) => acc + curr.calories, 0);
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        Calories: cals
      });
    }
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center glass p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Fitness Tracker
          </h1>
          <p className="opacity-70 mt-1">Welcome back, {user.email.split('@')[0]}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Progress Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium opacity-80">Daily Calories</h3>
            <span className="text-blue-400 font-bold">{caloriePercentage}%</span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold">{totalCalories}</span>
            <span className="opacity-60 mb-1">/ {user.calorieGoal} kcal</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${caloriePercentage}%` }}></div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium opacity-80">Daily Protein</h3>
            <span className="text-emerald-400 font-bold">{proteinPercentage}%</span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <span className="text-4xl font-bold">{totalProtein}</span>
            <span className="opacity-60 mb-1">/ {user.proteinGoal} g</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${proteinPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Action Buttons & AI */}
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={() => setShowWorkoutModal(true)} className="btn-primary flex items-center justify-center gap-2 flex-1">
          <Dumbbell size={20} /> Log Workout
        </button>
        <button onClick={() => setShowMealModal(true)} className="btn-secondary flex items-center justify-center gap-2 flex-1">
          <Utensils size={20} /> Log Meal
        </button>
        <button onClick={getAiAdvice} disabled={loadingAi} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 flex-1 flex items-center justify-center gap-2 disabled:opacity-70">
          <Brain size={20} /> {loadingAi ? 'Thinking...' : 'Get AI Advice'}
        </button>
      </div>

      {/* AI Advice Display */}
      {aiAdvice && (
        <div className="glass p-6 rounded-2xl border border-purple-500/30 bg-purple-900/10 relative">
          <div className="absolute -top-3 -left-3 bg-purple-600 p-2 rounded-full shadow-lg">
            <Brain className="text-white" size={24} />
          </div>
          <h3 className="text-xl font-bold text-purple-300 mb-2 ml-4">AI Coach says:</h3>
          <p className="text-lg opacity-90 leading-relaxed ml-4">{aiAdvice}</p>
        </div>
      )}

      {/* Data Visualization & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Column */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity className="text-blue-400"/> 7-Day Calorie History</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px'}} />
                <Bar dataKey="Calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Logs Column */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Dumbbell className="text-blue-400"/> Recent Workouts</h2>
            <div className="space-y-4">
              {workouts.slice(0, 3).map(w => (
                <div key={w._id} className="glass p-4 rounded-xl flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                  <div>
                    <h4 className="font-semibold">{w.name}</h4>
                    <p className="text-sm opacity-60">{new Date(w.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{w.weight} lbs</p>
                    <p className="text-sm opacity-60">{w.sets} sets × {w.reps} reps</p>
                  </div>
                </div>
              ))}
              {workouts.length === 0 && <p className="opacity-50 py-4">No workouts logged yet.</p>}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Utensils className="text-emerald-400"/> Recent Meals</h2>
            <div className="space-y-4">
              {meals.slice(0, 3).map(m => (
                <div key={m._id} className="glass p-4 rounded-xl flex justify-between items-center hover:bg-slate-800/50 transition-colors">
                  <div>
                    <h4 className="font-semibold">{m.food}</h4>
                    <p className="text-sm opacity-60">{new Date(m.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-400">+{m.protein}g protein</p>
                    <p className="text-sm opacity-60">{m.calories} kcal</p>
                  </div>
                </div>
              ))}
              {meals.length === 0 && <p className="opacity-50 py-4">No meals logged yet.</p>}
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      {showWorkoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Log Workout</h2>
            <form onSubmit={handleAddWorkout} className="space-y-4">
              <input type="text" placeholder="Exercise Name" required className="input-field" value={workoutForm.name} onChange={e => setWorkoutForm({...workoutForm, name: e.target.value})} />
              <div className="grid grid-cols-3 gap-4">
                <input type="number" placeholder="Sets" required className="input-field" value={workoutForm.sets} onChange={e => setWorkoutForm({...workoutForm, sets: e.target.value})} />
                <input type="number" placeholder="Reps" required className="input-field" value={workoutForm.reps} onChange={e => setWorkoutForm({...workoutForm, reps: e.target.value})} />
                <input type="number" placeholder="Weight" required className="input-field" value={workoutForm.weight} onChange={e => setWorkoutForm({...workoutForm, weight: e.target.value})} />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowWorkoutModal(false)} className="btn-secondary !bg-slate-600 hover:!bg-slate-700">Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Log Meal</h2>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <input type="text" placeholder="Food Name" required className="input-field" value={mealForm.food} onChange={e => setMealForm({...mealForm, food: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Calories" required className="input-field" value={mealForm.calories} onChange={e => setMealForm({...mealForm, calories: e.target.value})} />
                <input type="number" placeholder="Protein (g)" required className="input-field" value={mealForm.protein} onChange={e => setMealForm({...mealForm, protein: e.target.value})} />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowMealModal(false)} className="btn-secondary !bg-slate-600 hover:!bg-slate-700">Cancel</button>
                <button type="submit" className="btn-secondary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
