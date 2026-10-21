import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell, ThemeProvider } from "@/components/shell";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Panel from "@/pages/panel";
import Nivel from "@/pages/nivel";
import Informe from "@/pages/informe";
import Metodo from "@/pages/metodo";
import AuthPage from "@/pages/auth";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Panel} />
      <Route path="/nivel/:id" component={Nivel} />
      <Route path="/informe" component={Informe} />
      <Route path="/metodo" component={Metodo} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router hook={useHashLocation}>
                <AppShell>
                  <AppRouter />
                </AppShell>
              </Router>
            </TooltipProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
