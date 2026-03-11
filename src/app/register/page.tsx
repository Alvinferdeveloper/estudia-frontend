"use client";

import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Mail, Chrome, Facebook, ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck, Brain, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard",
      });

      if (signUpError) {
        setError(signUpError.message || "Error al crear la cuenta. Inténtalo de nuevo.");
      } else {
        router.push("/workspace");
      }
    } catch (err) {
      setError("Error de conexión. Revisa tu internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github" | "facebook") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/workspace",
      });
    } catch (err) {
      setError(`No se pudo conectar con ${provider}.`);
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden bg-slate-50">
      {/* Background Image Presentation */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/login_background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40" />
      </div>

      {/* Navigation Bar */}
      <div className="absolute top-0 w-full p-6 md:p-10 flex justify-between items-start z-20 pointer-events-none">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-all duration-300 font-bold group pointer-events-auto"
        >
          <div className="p-2 rounded-xl bg-white/90 border border-white shadow-sm group-hover:shadow-md transition-all backdrop-blur-md">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-tighter">Volver</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-white backdrop-blur-md shadow-sm opacity-80">
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-800">Cifrado de Extremo a Extremo</span>
        </div>
      </div>

      <div className="z-10 w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-2 duration-700">
        <Card className="bg-white/95 border-white shadow-[0_32px_80px_rgba(0,0,0,0.12)] rounded-[32px] overflow-hidden backdrop-blur-sm">
          <CardHeader className="pt-8 pb-0 flex flex-col items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl font-black text-slate-950 tracking-tight">Únete a estudiIA</CardTitle>
            <CardDescription className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Crea tu cuenta gratis</CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6 space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-slate-950 text-[10px] font-black uppercase tracking-widest ml-1">Nombre Completo</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    className="bg-slate-50 border-slate-100 h-11 rounded-xl focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-slate-900 font-medium text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-slate-950 text-[10px] font-black uppercase tracking-widest ml-1">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hola@estudiia.com"
                  className="bg-slate-50 border-slate-100 h-11 rounded-xl focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-slate-900 font-medium text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-slate-950 text-[10px] font-black uppercase tracking-widest ml-1">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    className="bg-slate-50 border-slate-100 h-11 pr-10 rounded-xl focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all text-slate-900 font-medium text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all font-bold text-sm"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Registrarme"}
              </Button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-slate-100" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-black">
                <span className="bg-white px-3 text-slate-400">O regístrate con</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "google", icon: Chrome },
                { name: "github", icon: Github },
                { name: "facebook", icon: Facebook }
              ].map((provider) => (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="bg-white border-slate-100 h-10 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center p-0"
                  onClick={() => handleSocialLogin(provider.name as any)}
                >
                  <provider.icon className={`w-4 h-4 ${provider.name === 'facebook' ? 'fill-blue-600 text-blue-600' : 'text-slate-700'}`} />
                </Button>
              ))}
            </div>
          </CardContent>

          <CardFooter className="pb-8 pt-0 justify-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">Inicia Sesión</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
