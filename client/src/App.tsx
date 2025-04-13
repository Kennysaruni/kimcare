import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Donate from "@/pages/donate";
import Volunteer from "@/pages/volunteer";
import Resources from "@/pages/resources";
import Partners from "@/pages/partners";
import ContentManager from "@/pages/admin/content-manager";
import Login from "./pages/admin/login";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/donate" component={Donate} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/resources" component={Resources} />
          <Route path="/partners" component={Partners} />
          <Route path="/admin/login" component={Login} />
          <Route path="/admin/content" component={ContentManager} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;