import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Ticket, Users, Zap, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Discount Marquee */}
      <div className="relative flex overflow-hidden bg-white border-b border-primary/20">
        <div className="flex animate-marquee whitespace-nowrap py-2.5">
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
        </div>
        <div className="flex animate-marquee whitespace-nowrap py-2.5" aria-hidden="true">
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
          <span className="inline-block px-8 text-primary font-black tracking-widest text-xs md:text-sm uppercase">⚡ 50% DE DESCUENTO ⚡</span>
        </div>
      </div>



      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
          {/* Navbar - Transparent & Integrated */}
          <header className="w-full relative z-50 pt-4 px-6">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <div className="relative w-12 h-12">
                  <Image src="/logo-1.png" alt="NaoLite" fill className="object-contain" />
                </div>
                <span className="text-white text-2xl">NaoLite</span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/demo" className="text-sm font-medium text-white/90 hover:text-white transition-colors hidden sm:block">
                  Ver Demo
                </Link>
                <Button href="/login" size="sm" className="rounded-full px-6 bg-white text-primary hover:bg-white/90 font-bold shadow-lg">
                  Iniciar sesión
                </Button>
              </div>
            </div>
          </header>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="relative container mx-auto px-6 py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center text-white space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                La plataforma profesional para organizar rifas
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Organiza rifas de manera <span className="text-white drop-shadow-lg">profesional</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Gestiona boletos, pagos y participantes en una plataforma diseñada para convertir. Sin complicaciones.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button href="/signup" size="lg" className="h-14 px-8 rounded-full text-base bg-white text-primary hover:bg-white/90 shadow-xl">
                  Comenzar <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button href="/demo" variant="outline" size="lg" className="h-14 px-8 rounded-full text-base bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                  Ver Demo en Vivo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Todo lo que necesitas</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Herramientas profesionales para organizadores exigentes</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Zap className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl">Gestión Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Crea sorteos en segundos. Controla el inventario de boletos y ventas en tiempo real desde tu dashboard.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl">Pagos Seguros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Integración directa con WhatsApp para confirmar pagos y mantener el contacto directo con tus participantes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Users className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl">Perfil Público</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Tu propia página profesional donde tus seguidores pueden ver todos tus sorteos activos y pasados.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Diseñado para el éxito
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  NaoLite te da todas las herramientas para organizar rifas profesionales que generen confianza y vendan más.
                </p>
                <div className="space-y-4">
                  {[
                    "Dashboard intuitivo y fácil de usar",
                    "Páginas públicas profesionales",
                    "Gestión de boletos en tiempo real",
                    "Integración con WhatsApp"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                      <span className="text-gray-700 text-lg">{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button href="/signup" size="lg" className="mt-4 rounded-full px-8">
                  Comenzar Ahora <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/phone-mockup.png"
                    alt="NaoLite app en smartphone"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl mb-4 text-gray-900">
            <Ticket className="w-6 h-6 text-primary" />
            <span>NaoLite</span>
          </div>
          <p className="text-gray-600 mb-4">
            © 2024 NaoLite. Todos los derechos reservados.
          </p>
          <div className="flex justify-center">
            <Link href="/admin" className="text-xs text-gray-300 hover:text-gray-500 transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
