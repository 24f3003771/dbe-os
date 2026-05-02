import MatchForgeClient from "./MatchForgeClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "MatchForge | DBE OS",
  description: "Connect with co-founders and teammates in the IIM Bangalore DBE community.",
};

export default function MatchForgePage() {
  return <MatchForgeClient />;
}
