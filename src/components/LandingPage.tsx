import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BrainCircuit, BarChart3, Briefcase, Globe, ShieldAlert, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const AgoraLogo = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <g filter="url(#shadow)">
      {/* Right Circle */}
      <path d="M110 50 A 50 50 0 1 1 110 150 L 110 130 A 30 30 0 1 0 110 70 Z" fill="white" />
      {/* Vertical Line */}
      <rect x="90" y="45" width="12" height="110" fill="white" />
    </g>
    
    {/* Red Semi-circle */}
    <path d="M85 70 A 30 30 0 0 0 85 130 Z" fill="#FF3B00" />
    
    {/* Radiating Lines */}
    <line x1="40" y1="65" x2="75" y2="85" stroke="#00B050" strokeWidth="12" strokeLinecap="round" />
    <line x1="30" y1="100" x2="70" y2="100" stroke="#111827" strokeWidth="12" strokeLinecap="round" />
    <line x1="40" y1="135" x2="75" y2="115" stroke="#FFC000" strokeWidth="12" strokeLinecap="round" />

    <defs>
      <filter id="shadow" x="-20" y="-20" width="240" height="240" filterUnits="userSpaceOnUse">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" floodColor="#000" />
      </filter>
    </defs>
  </svg>
);

export function LandingPage({ onStart }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-zinc-300 font-sans overflow-hidden relative selection:bg-[#00B050]/30">
      {/* Dynamic Background Effects with Brand Colors */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#00B050] blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -50, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#FF3B00] blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.05, 0.15, 0.05],
          x: [0, 30, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-[#FFC000] blur-[150px] pointer-events-none" 
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-100 pointer-events-none" />

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <AgoraLogo className="w-10 h-10" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">Agora</span>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onClick={onStart}
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          Acessar Motor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto w-full"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 mb-8 backdrop-blur-sm shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#00B050] animate-pulse shadow-[0_0_10px_rgba(0,176,80,0.8)]" />
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Sistema Online • v2.0</span>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] transform hover:scale-105 transition-transform duration-500">
              <AgoraLogo className="w-20 h-20 sm:w-28 sm:h-28" />
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
            Agora News <br className="hidden sm:block" /> Analytics
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transforme notícias globais e locais em inteligência estratégica acionável. 
            Construído para executivos que operam em mercados complexos e de alto risco.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] group text-lg"
            >
              Iniciar Motor de Análise
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6 text-[#FF3B00]" />}
            title="Quantificação de Impacto"
            description="Não fazemos apenas resumos. Pontuamos o impacto econômico, financeiro e de negócios de -10 a +10, oferecendo clareza imediata."
            delay={0.1}
            borderColor="group-hover:border-[#FF3B00]/50"
            glowColor="group-hover:bg-[#FF3B00]/10"
          />
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-[#00B050]" />}
            title="Críticos Ultra Avançados"
            description="Críticos de IA especializados por setor analisam as notícias para encontrar oportunidades ocultas e formular estratégias de Oceano Azul."
            delay={0.3}
            borderColor="group-hover:border-[#00B050]/50"
            glowColor="group-hover:bg-[#00B050]/10"
          />
          <FeatureCard 
            icon={<Briefcase className="w-6 h-6 text-[#FFC000]" />}
            title="Planos de Ação Personalizados"
            description="Insira o tamanho e a receita da sua empresa para gerar um plano tático de mitigação e crescimento de 30 dias sob medida."
            delay={0.5}
            borderColor="group-hover:border-[#FFC000]/50"
            glowColor="group-hover:bg-[#FFC000]/10"
          />
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay, borderColor, glowColor }: { icon: React.ReactNode, title: string, description: string, delay: number, borderColor: string, glowColor: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-8 transition-all duration-500 group relative overflow-hidden ${borderColor}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-colors duration-500 opacity-0 group-hover:opacity-100 ${glowColor}`} />
      <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative z-10 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-3 relative z-10">{title}</h3>
      <p className="text-zinc-400 leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
}
