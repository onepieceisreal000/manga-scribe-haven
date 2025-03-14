
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MangaProvider } from "./contexts/MangaContext";
import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index";
import Home from "./pages/Home";
import MangaDetail from "./pages/MangaDetail";
import ReadChapter from "./pages/ReadChapter";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MangaManagement from "./pages/admin/MangaManagement";
import ChapterManagement from "./pages/admin/ChapterManagement";
import CreateManga from "./pages/admin/CreateManga";
import CreateChapter from "./pages/admin/CreateChapter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <MangaProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/manga/:id" element={<MangaDetail />} />
              <Route path="/manga/:mangaId/chapter/:chapterId" element={<ReadChapter />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/manga" element={<MangaManagement />} />
              <Route path="/admin/manga/create" element={<CreateManga />} />
              <Route path="/admin/manga/:id/chapters" element={<ChapterManagement />} />
              <Route path="/admin/manga/:id/chapters/create" element={<CreateChapter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </MangaProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
