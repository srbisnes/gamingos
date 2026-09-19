'use client';

import {
  Brain,
  Shield,
  Wallet,
  BarChart3,
  Zap,
  Lock,
  CheckCircle2,
  ArrowRight,
  Bot,
  LineChart,
  Layers,
  Globe,
  Server,
  MessageSquare,
} from 'lucide-react';
import WalletConnect from '@/components/WalletConnect';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GamingOS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#modules" className="hover:text-white transition">Módulos</a>
            <a href="#intelligence" className="hover:text-white transition">Intelligence</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#architecture" className="hover:text-white transition">Arquitectura</a>
          </div>
          <div className="flex items-center gap-3">
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-8">
            <Zap className="w-4 h-4" />
            Software operacional · No custodiamos fondos · Stellar ready
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            El sistema operativo<br />
            <span className="bg-gradient-to-r from-brand-400 to-cyan-300 bg-clip-text text-transparent">
              impulsado por IA
            </span>
            <br />para operadores de iGaming
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Gestiona riesgo, tesorería, compliance, soporte y analítica desde una única interfaz.
            GamingOS se integra con tu infraestructura existente y redes como Stellar.
            <span className="text-slate-200 font-medium"> El dinero siempre es tuyo.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 font-semibold text-lg transition shadow-lg shadow-brand-600/25"
            >
              Agendar demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#modules"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-lg transition border border-slate-700"
            >
              Ver módulos
            </a>
          </div>

          {/* Network badge */}
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Testnet
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Mainnet
            </span>
            <span className="text-slate-700">|</span>
            <span>Conectá tu wallet Stellar</span>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Lock className="w-6 h-6" />,
              title: 'Sin custodia',
              desc: 'Nunca tocamos el dinero de tus jugadores. Tú controlas los fondos, nosotros te damos inteligencia.',
            },
            {
              icon: <Bot className="w-6 h-6" />,
              title: 'IA Operacional',
              desc: 'Risk Engine, Treasury Engine y Support Copilot que trabajan 24/7 reduciendo costes y errores.',
            },
            {
              icon: <LineChart className="w-6 h-6" />,
              title: 'Visibilidad total',
              desc: 'Benchmarks y BI en tiempo real. Pregunta “¿dónde estoy perdiendo dinero?” y recibe respuestas accionables.',
            },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-5">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Módulos modulares. Empieza con lo esencial y escala con Premium.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Brain />, title: 'AI Operations Center', desc: 'Centro de mando inteligente para todas las operaciones del casino.' },
              { icon: <MessageSquare />, title: 'AI Support Copilot', desc: 'Resuelve tickets de soporte más rápido y reduce carga del equipo.' },
              { icon: <Shield />, title: 'AI Risk Engine', desc: 'Detección de fraude, límites y comportamiento anómalo en tiempo real.' },
              { icon: <Wallet />, title: 'AI Treasury Engine', desc: 'Optimización de liquidez, flujos de pago y proyecciones de caja.' },
              { icon: <Lock />, title: 'Compliance Center', desc: 'KYC, AML y reportes regulatorios automatizados.' },
              { icon: <BarChart3 />, title: 'Analytics Intelligence', desc: 'BI + Benchmarks. Resúmenes de 24h, márgenes, top países y alertas.' },
              { icon: <Layers />, title: 'Operator Memory', desc: 'Contexto histórico del operador para recomendaciones personalizadas.' },
              { icon: <Server />, title: 'Reporting Engine', desc: 'Reportes automáticos listos para management y reguladores.' },
              { icon: <Globe />, title: 'API Platform + Stellar', desc: 'Integraciones con PSPs y settlement layer sobre Stellar (infraestructura).' },
            ].map((mod, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-800 group-hover:bg-brand-500/20 flex items-center justify-center text-brand-400 mb-4 transition">
                  {mod.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{mod.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligence Highlight */}
      <section id="intelligence" className="py-24 px-6 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">GamingOS Intelligence</h2>
            <p className="text-slate-400 text-lg">
              No vendemos software. Vendemos respuestas a preguntas de negocio.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 md:p-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">OP</span>
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-none px-5 py-3 max-w-lg">
                  <p className="text-slate-200">¿Dónde estoy perdiendo dinero?</p>
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <div className="bg-brand-600/20 border border-brand-500/30 rounded-2xl rounded-tr-none px-5 py-4 max-w-xl">
                  <p className="text-brand-100 mb-3">
                    <strong>31%</strong> de las consultas de soporte provienen de retiros pendientes.
                  </p>
                  <p className="text-brand-200 text-sm">
                    Recomendación: automatizar validación KYC en el flujo de retiro.
                    Impacto estimado: −18% en tickets de soporte y +2.4 puntos de margen.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-slate-700 grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-400">$245k</div>
                <div className="text-sm text-slate-400 mt-1">Ingresos 24h</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400">78%</div>
                <div className="text-sm text-slate-400 mt-1">Margen</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-400">7</div>
                <div className="text-sm text-slate-400 mt-1">Alertas activas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pricing transparente</h2>
            <p className="text-slate-400 text-lg">Suscripción + Setup + Módulos Premium</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '499',
                desc: 'Para operadores que empiezan',
                features: ['AI Operations Center', 'Analytics básico', 'Dashboard', 'Soporte email', '1 integración PSP'],
              },
              {
                name: 'Pro',
                price: '1.999',
                desc: 'El más elegido',
                popular: true,
                features: [
                  'Todo Starter',
                  'AI Risk Engine',
                  'AI Support Copilot',
                  'Compliance Center',
                  'Operator Memory',
                  'Soporte prioritario',
                ],
              },
              {
                name: 'Enterprise',
                price: '5.000+',
                desc: 'Para operadores grandes',
                features: [
                  'Todo Pro',
                  'AI Treasury Engine',
                  'White Label',
                  'SLA dedicado',
                  'Integraciones custom',
                  'Account Manager',
                ],
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl border ${
                  plan.popular
                    ? 'border-brand-500 bg-slate-900 shadow-xl shadow-brand-500/10'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-600 text-xs font-semibold">
                    Más popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="text-slate-400">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center py-3 rounded-lg font-medium transition ${
                    plan.popular
                      ? 'bg-brand-600 hover:bg-brand-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  Empezar
                </a>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center text-slate-400 text-sm">
            + Setup / Implementación: $5.000 – $50.000 según complejidad · Módulos Premium desde $999/mes
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-24 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Arquitectura</h2>
          <p className="text-slate-400 mb-12">Stellar es infraestructura. El producto es inteligencia operacional.</p>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 text-left font-mono text-sm md:text-base leading-relaxed">
            <pre className="text-slate-300 whitespace-pre-wrap">{`GamingOS
├── AI Operations Center
├── AI Support Copilot
├── AI Risk Engine
├── AI Treasury Engine
├── Compliance Center
├── Analytics Intelligence
├── Operator Memory
├── Reporting Engine
├── API Platform
└── Stellar Settlement Layer`}</pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Listo para operar con inteligencia</h2>
          <p className="text-slate-400 text-lg mb-10">
            GamingOS es software. Tú sigues siendo el operador. Nosotros te damos el cerebro.
          </p>
          <a
            href="mailto:hello@gamingos.io"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-brand-600 hover:bg-brand-500 font-semibold text-lg transition shadow-lg shadow-brand-600/25"
          >
            Solicitar acceso / Demo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-300">GamingOS</span>
          </div>
          <p>Empresa de software operacional para iGaming impulsada por IA.</p>
          <p className="mt-2">Stellar es infraestructura · El dinero siempre es del operador</p>
        </div>
      </footer>
    </div>
  );
}
