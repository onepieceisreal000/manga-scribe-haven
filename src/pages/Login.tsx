
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LockKeyhole } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/admin');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-manga-secondary px-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-manga-primary to-manga-secondary">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="glass-card border-gray-800 shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-manga-accent/20 flex items-center justify-center">
                <LockKeyhole className="h-6 w-6 text-manga-accent" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center font-manga">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-manga">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-manga-secondary/80 border-gray-700 transition-all duration-300 focus:border-manga-accent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-manga">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-manga-secondary/80 border-gray-700 transition-all duration-300 focus:border-manga-accent"
                />
              </div>
              <div className="text-sm text-gray-400 italic font-manga">
                <p>Default credentials:</p>
                <p>Username: admin</p>
                <p>Password: admin123</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-manga-accent hover:bg-manga-accent/90 transition-all duration-300"
                disabled={isSubmitting || !username || !password}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
