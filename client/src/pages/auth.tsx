import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Lock, KeyRound, Building2, CheckCircle2, ArrowRight, LogOut, FileText, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const { t, lang } = useI18n();
  const { user, login, register, logout, isConsultant } = useAuth();
  const [, setLocation] = useLocation();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login({ email: loginEmail, password: loginPassword });
      setLocation("/");
    } catch (err: any) {
      setLoginError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setIsRegistering(true);
    try {
      await register({ companyName: regName, email: regEmail, password: regPassword });
      setLocation("/");
    } catch (err: any) {
      setRegError(err.message || "Error al registrar la empresa");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Encabezado Principal */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <ShieldCheck className="h-4 w-4" />
          <span>{t("authBadgeSecurity")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {t("authTitle")}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          {t("authSubtitle")}
        </p>
      </div>

      {/* Si ya hay sesión activa */}
      {user ? (
        <Card className="border-border shadow-md bg-card/60 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">
              {lang === "es" ? "Sesión Activa" : "Active Session"}
            </CardTitle>
            <CardDescription>
              {lang === "es"
                ? "Actualmente tienes acceso autenticado a la plataforma."
                : "You currently have authenticated access to the platform."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-muted/60 border border-border/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">
                  {lang === "es" ? "Empresa:" : "Company:"}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {user.companyName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Email:</span>
                <span className="text-sm font-mono text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Rol:</span>
                <Badge variant={isConsultant ? "default" : "secondary"} className="text-xs">
                  {isConsultant ? t("consultantRoleBadge") : t("clientRoleBadge")}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="flex-1 gap-2"
                onClick={() => setLocation("/")}
              >
                <FileText className="h-4 w-4" />
                {lang === "es" ? "Ir al Expediente" : "Go to Dossier"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:bg-destructive/10"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                {t("navLogout")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Formulario de Login / Registro */
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Tarjeta con Tabs de Autenticación */}
          <div className="md:col-span-7">
            <Card className="border-border shadow-lg bg-card">
              <Tabs defaultValue="login" className="w-full">
                <CardHeader className="pb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" className="font-semibold text-xs sm:text-sm">
                      <Lock className="h-3.5 w-3.5 mr-1.5" />
                      {t("tabLogin")}
                    </TabsTrigger>
                    <TabsTrigger value="register" className="font-semibold text-xs sm:text-sm">
                      <Building2 className="h-3.5 w-3.5 mr-1.5" />
                      {t("tabRegister")}
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                {/* TAB 1: INICIAR SESIÓN */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4 pt-2">
                      {loginError && (
                        <Alert variant="destructive" className="py-2.5">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{loginError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="login-email">{t("emailLabel")}</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder={t("emailPlaceholder")}
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">{t("passwordLabel")}</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder={t("passwordPlaceholder")}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                        />
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button
                        type="submit"
                        className="w-full font-semibold gap-2 py-5"
                        disabled={isLoggingIn}
                      >
                        <KeyRound className="h-4 w-4" />
                        {isLoggingIn ? t("authLoading") : t("btnLoginAction")}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                {/* TAB 2: REGISTRO DE EMPRESA */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 pt-2">
                      {regError && (
                        <Alert variant="destructive" className="py-2.5">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">{regError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="reg-name">{t("companyNameLabel")}</Label>
                        <Input
                          id="reg-name"
                          type="text"
                          placeholder={t("companyNamePlaceholder")}
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                          autoComplete="organization"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-email">{t("emailLabel")}</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder={t("emailPlaceholder")}
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reg-password">{t("passwordLabel")}</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          placeholder={t("passwordPlaceholder")}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          minLength={6}
                          autoComplete="new-password"
                        />
                        <p className="text-[0.7rem] text-muted-foreground">
                          {lang === "es" ? "Mínimo 6 caracteres." : "Minimum 6 characters."}
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button
                        type="submit"
                        className="w-full font-semibold gap-2 py-5"
                        disabled={isRegistering}
                      >
                        <ShieldCheck className="h-4 w-4" />
                        {isRegistering ? t("authLoading") : t("btnRegisterAction")}
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Panel Lateral: Pilares de Seguridad y Confidencialidad */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {lang === "es" ? "Garantías de Protección de Datos" : "Data Protection Guarantees"}
            </h3>

            {/* Pilar 1: Cifrado */}
            <div className="p-4 rounded-xl border border-border/80 bg-card/40 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Lock className="h-4 w-4" />
                <h4 className="text-sm font-semibold text-foreground">
                  {t("securityBadge1")}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("securityDesc1")}
              </p>
            </div>

            {/* Pilar 2: Aislamiento */}
            <div className="p-4 rounded-xl border border-border/80 bg-card/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
                <h4 className="text-sm font-semibold text-foreground">
                  {t("securityBadge2")}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("securityDesc2")}
              </p>
            </div>

            {/* Pilar 3: Confidencialidad */}
            <div className="p-4 rounded-xl border border-border/80 bg-card/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <Building2 className="h-4 w-4" />
                <h4 className="text-sm font-semibold text-foreground">
                  {t("securityBadge3")}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("securityDesc3")}
              </p>
            </div>

            {/* Nota de Tatiana Lovric */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">
                {lang === "es" ? "Auditoría y Supervisión" : "Auditing & Supervision"}
              </p>
              <p>
                {lang === "es"
                  ? "Los expedientes generados bajo esta plataforma están preparados para la revisión experta de Tatiana Lovric y comités de contratación pública."
                  : "Dossiers generated on this platform are ready for expert review by Tatiana Lovric and public procurement tender boards."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
