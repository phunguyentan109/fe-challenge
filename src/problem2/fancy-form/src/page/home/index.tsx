import { SwapCard } from '@/page/home/components/SwapCard';
import { backgroundIcons } from '@/page/home/const.ts';

function Home() {
  return (
    <main className="page-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(109,40,217,0.28),transparent_42%),radial-gradient(circle_at_16%_82%,rgba(30,64,175,0.16),transparent_34%),linear-gradient(135deg,#09090f,#151226_48%,#070712)] px-5 py-12 max-[780px]:px-3.5 max-[780px]:py-6">
      <div className="page-bg-icons" aria-hidden="true">
        {backgroundIcons.map(({ Component, className, label }) => (
          <Component className={className} key={label} />
        ))}
      </div>
      <SwapCard />
    </main>
  );
}

export default Home;
