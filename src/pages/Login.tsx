
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LockKeyhole, User } from 'lucide-react';

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

  useEffect(() => {
    // Simple animation for login elements
    const elements = document.querySelectorAll('.animate-on-load');
    elements.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 100 * (index + 1));
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-manga-primary to-manga-secondary overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-600/20 filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-indigo-600/20 filter blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-md z-10">
        <Card className="neo-glass border-gray-800/50 shadow-2xl overflow-hidden">
          <CardHeader className="space-y-2">
            <div className="flex justify-center mb-4 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
              <div className="w-16 h-16 rounded-full ios-gradient flex items-center justify-center shadow-lg">
                <LockKeyhole className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display text-center animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
              Admin Login
            </CardTitle>
            <CardDescription className="text-center font-sans animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
                <Label htmlFor="username" className="font-sans text-sm font-medium flex items-center">
                  <User size={14} className="mr-1.5 text-gray-400" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="premium-input"
                />
              </div>
              <div className="space-y-2 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
                <Label htmlFor="password" className="font-sans text-sm font-medium flex items-center">
                  <LockKeyhole size={14} className="mr-1.5 text-gray-400" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="premium-input"
                />
              </div>
              <div className="text-xs text-gray-400 italic font-sans animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
                <p>Default credentials:</p>
                <p>Username: admin</p>
                <p>Password: admin123</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full ios-gradient hover:opacity-90 transition-all duration-300 rounded-xl py-5 shadow-lg animate-on-load opacity-0"
                style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}
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
        <div className="text-center mt-8 text-sm text-gray-500 animate-on-load opacity-0" style={{ transform: 'translateY(20px)', transition: 'all 0.5s ease-out' }}>
          MangaScribe Admin © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default Login;
