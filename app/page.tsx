import Link from "next/link";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { FadeIn, SlideUp, StaggerContainer, ScaleIn } from "./components/ui/motion";
import { Ticket, Users, Zap, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden selection:bg-primary/20 selection:text-primary">

      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <Ticket className="w-5 h-5" />
            </div>
            <span>NaoLite</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Ver Demo
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full px-6">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 animate-pulse" />

          <div className="text-center max-w-4xl mx-auto space-y-8">
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                La nueva forma de organizar sorteos
              </div>
            </FadeIn>

            <SlideUp delay={0.3}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                Organiza rifas <br />
                <span className="text-gradient">al siguiente nivel</span>
              </h1>
            </SlideUp>

            <SlideUp delay={0.4}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Gestiona boletos, pagos y participantes en una plataforma diseñada para convertir.
                Sin hojas de cálculo, sin complicaciones.
              </p>
            </SlideUp>

            <SlideUp delay={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 rounded-full text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                  Comenzar Gratis <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-sm">
                  Ver Demo en Vivo
                </Button>
              </Link>
            </SlideUp>
          </div>

          {/* Floating UI Elements (Decorative) */}
          <div className="relative mt-24 h-[400px] w-full max-w-5xl mx-auto hidden md:block perspective-1000">
            <motion-div className="absolute left-0 top-10 w-64 glass p-4 rounded-2xl animate-float" style={{ animationDelay: '0s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">Venta Exitosa</div>
                  <div className="text-xs text-muted-foreground">Hace 2 minutos</div>
                </div>
              </div>
              <div className="text-2xl font-bold">+$50.00</div>
            </motion-div>

            <motion-div className="absolute right-0 top-20 w-64 glass p-4 rounded-2xl animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">Nuevo Participante</div>
                  <div className="text-xs text-muted-foreground">Juan Pérez</div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background" />
                ))}
              </div>
            </motion-div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Todo lo que necesitas</h2>
            <p className="text-muted-foreground">Diseñado para organizadores exigentes.</p>
          </div>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            <ScaleIn>
              <Card className="h-full bg-muted/30 border-white/5 hover:border-primary/20 transition-colors duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <CardTitle>Gestión Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Crea sorteos en segundos. Controla el inventario de boletos y ventas en tiempo real desde tu dashboard.
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>

            <ScaleIn delay={0.1}>
              <Card className="h-full bg-muted/30 border-white/5 hover:border-secondary/20 transition-colors duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <CardTitle>Pagos Seguros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Integración directa con WhatsApp para confirmar pagos y mantener el contacto directo con tus participantes.
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>

            <ScaleIn delay={0.2}>
              <Card className="h-full bg-muted/30 border-white/5 hover:border-accent/20 transition-colors duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <CardTitle>Perfil Público</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tu propia página profesional donde tus seguidores pueden ver todos tus sorteos activos y pasados.
                  </p>
                </CardContent>
              </Card>
            </ScaleIn>
          </StaggerContainer>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-muted/20 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 font-bold text-xl mb-4 text-foreground">
            <Ticket className="w-5 h-5" />
            <span>NaoLite</span>
          </div>
          <p className="text-sm">
            © 2024 NaoLite. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
