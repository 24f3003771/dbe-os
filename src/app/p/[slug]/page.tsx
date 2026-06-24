import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Target, Briefcase, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return {
    title: `${title} | DBE OS`,
    description: `Access the ultimate resources, guides, and tools for ${title} exclusively on DBE OS - the premier student platform for IIM Bangalore BBA DBE.`,
    alternates: {
      canonical: `/p/${slug}`
    }
  };
}

export default async function ProgrammaticLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-[#FF5F56]/10 px-4 py-2 rounded-full text-[#FF5F56] font-black text-xs tracking-widest uppercase mb-4 border border-[#FF5F56]/20">
          <Zap className="w-4 h-4" /> Exclusive DBE Resource
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-on-surface leading-tight">
          Looking for <br/> <span className="text-[#FF5F56] italic">{title}</span>?
        </h1>
        
        <p className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-2xl mx-auto">
          You've found the right place. DBE OS is the ultimate student-built operating system for the IIM Bangalore BBA DBE program. We have everything you need to master your degree.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 text-left">
            <BookOpen className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-black text-lg mb-2 text-on-surface">Comprehensive Notes</h3>
            <p className="text-sm text-on-surface-variant">Access top-tier student notes for every single semester and subject.</p>
          </div>
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 text-left">
            <Target className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-black text-lg mb-2 text-on-surface">Quiz & Exam Bank</h3>
            <p className="text-sm text-on-surface-variant">Prepare with past year questions, mock tests, and verified quiz answers.</p>
          </div>
          <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 text-left">
            <Briefcase className="w-8 h-8 text-[#FF9056] mb-4" />
            <h3 className="font-black text-lg mb-2 text-on-surface">Career Roadmaps</h3>
            <p className="text-sm text-on-surface-variant">Get step-by-step guides for consulting, product management, and startups.</p>
          </div>
        </div>

        <div className="pt-12">
          <Link href="/register">
            <button className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto group">
              Unlock DBE OS Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <p className="text-xs font-bold text-on-surface-variant mt-4">Join hundreds of other IIMB BBA DBE scholars.</p>
        </div>
      </div>
    </div>
  );
}
