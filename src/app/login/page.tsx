"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Chrome, Facebook, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/workspace`,
      });

      if (signInError) {
        setError(signInError.message || "Credenciales incorrectas.");
      } else {
        router.push("/workspace");
      }
    } catch (err) {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github" | "facebook") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/workspace`,
      });
    } catch (err) {
      setError(`Error con ${provider}.`);
    }
  };

  return (
    // h-[100dvh] garantiza el 100% del alto dinámico de la pantalla (ideal para móviles) y overflow-hidden evita el scroll
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-50 selection:bg-blue-500/30">

      {/* Fondo con Glassmorphism y Luces Ambientales */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/login_background.png"
          alt="Background"
          fill
          className="object-cover opacity-60 mix-blend-multiply"
          priority
        />
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-white/50" />
      </div>

      {/* Navegación Superior - Márgenes reducidos para no empujar el contenido */}
      <div className="absolute top-0 w-full p-5 md:px-8 md:py-6 flex justify-between items-start z-20">
        <Link
          href="/"
          className="group flex items-center gap-2 text-slate-600 hover:text-slate-950 transition-colors"
        >
          <div className="p-2 rounded-xl bg-white/50 border border-white/60 shadow-sm backdrop-blur-md group-hover:bg-white/80 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wide hidden sm:block">Volver</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 border border-white/60 backdrop-blur-md shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Secure</span>
        </div>
      </div>

      {/* Contenedor principal de la tarjeta */}
      <div className="z-10 w-full max-w-[380px] relative group perspective flex flex-col items-center">
        {/* Sombra Glow detrás de la tarjeta - Adaptada al nuevo borde */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/20 to-indigo-500/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-700" />

        {/* Tarjeta más rectangular (rounded-2xl en lugar de 3xl/4xl) */}
        <Card className="relative w-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden transition-shadow duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)]">

          <CardHeader className="pt-8 pb-0 flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-md opacity-20 rounded-xl animate-pulse" />
              <div className="relative w-12 h-12 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-xl flex items-center justify-center shadow-md border border-slate-700/50">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 tracking-tight">
                Acceder a estudiIA
              </CardTitle>
              <CardDescription className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest">
                Potencia tu aprendizaje
              </CardDescription>
            </div>
          </CardHeader>

          {/* Reducción de padding vertical (p-6 pt-5) para que encaje mejor */}
          <CardContent className="p-6 pt-5 space-y-5">
            <form onSubmit={handleEmailLogin} className="space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 text-[10px] font-bold uppercase tracking-wider ml-1">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="hola@estudiia.com"
                    className="bg-white/60 border-white/80 h-11 rounded-xl px-3 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-300 text-slate-900 font-medium text-sm placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-slate-700 text-[10px] font-bold uppercase tracking-wider">Contraseña</Label>
                  <Link href="#" className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">¿Olvidaste tu clave?</Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="bg-white/60 border-white/80 h-11 rounded-xl px-3 pr-10 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all duration-300 text-slate-900 font-medium text-sm placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-900 rounded-md transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2.5 rounded-xl bg-red-50/80 border border-red-100 text-red-600 text-[11px] font-medium flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:-translate-y-[1px] transition-all duration-300 font-medium text-sm group/btn"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span className="flex items-center gap-2">
                    Entrar al sistema
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-slate-200/50" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold">
                <span className="bg-transparent px-3 text-slate-400 backdrop-blur-3xl rounded-full">
                  O entra con
                </span>
              </div>
            </div>

            {/* Botones Sociales más compactos y rectangulares */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "google", icon: Chrome, hover: "hover:bg-red-50 hover:text-red-500 hover:border-red-200" },
                { name: "github", icon: Github, hover: "hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300" },
                { name: "facebook", icon: Facebook, hover: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" }
              ].map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className={`bg-white/60 border-white/80 backdrop-blur-sm h-10 rounded-xl transition-all duration-300 flex items-center justify-center p-0 text-slate-600 ${provider.hover} shadow-[0_2px_8px_rgba(0,0,0,0.02)]`}
                  onClick={() => handleSocialLogin(provider.name as any)}
                >
                  <provider.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pb-6 pt-0 justify-center bg-transparent mt-1">
            <p className="text-[11px] font-medium text-slate-500">
              ¿No tienes una cuenta?{" "}
              <Link href="#" className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                Crear cuenta
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Links de Footer ultra-minimalistas movidos más cerca de la tarjeta */}
        <div className="absolute -bottom-10 flex justify-center gap-6 text-[9px] uppercase tracking-widest font-semibold text-slate-500 w-full">
          <Link href="#" className="hover:text-slate-900 transition-colors">Privacidad</Link>
          <span className="w-1 h-1 rounded-full bg-slate-300 self-center" />
          <Link href="#" className="hover:text-slate-900 transition-colors">Términos</Link>
        </div>
      </div>
    </div>
  );
}