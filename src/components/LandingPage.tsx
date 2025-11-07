import Header from './Header';

const sampleImages = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg',
  '/5.jpg',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIoSzXpE7iapBtjPRMzH07x5YEkq4AuGWn1Xa6U',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIoLrlJJjDkPdahpOwDiQg5k0utWyoNV7eSl31r',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIoXi0GP3M4Hw2sSobTMzfWpVnUGCthx18IikZe',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIoBczIi5AxYRGILgFlJXEodZ8CW1yD2AVHMfz0',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIoKYshpQqFUQP5Zlc1mHO2G7uxavjnRpksM63X',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIo8XQjB6R3HV7o150XhtyuEx2gTSLAFDYbGUNO',
  'https://drcs03sg3y.ufs.sh/f/xFtfuwZ01cIo1nLgRvKBhzdrpbSo5Was2kGEtgTZyH9AmVRw',
];

interface LandingPageProps {
  onGoViral?: () => void;
  onSignIn?: () => void;
}

export default function LandingPage({ onGoViral, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Arial, sans-serif' }}>
      <div className="flex flex-col items-center w-full">
        <Header onSignIn={onSignIn || (() => {})} />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-black leading-tight mb-4" style={{ letterSpacing: '-0.01em' }}>
          Auto-insert <span className="text-[#0071e3] underline decoration-4 decoration-[#0071e3]">viral text</span> into your images
        </h1>
        <p className="mt-4 text-sm sm:text-base text-center text-[#6e6e73] max-w-2xl font-medium">
          Create POV-style YouTube thumbnails and social media posts that grab attention and blow up your feed.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            className="bg-[#0071e3] hover:bg-[#005bb5] text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors"
            onClick={onSignIn}
            type="button"
          >
            Try it now
          </button>
          <a
            href="https://youtu.be/aB65HsrbZos?si=zyH_WSxMc0bdVWRV"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-[#0071e3] text-[#0071e3] px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors hover:bg-[#f0f8ff] flex items-center justify-center"
            style={{ textDecoration: 'none' }}
          >
            Watch Demo
          </a>
        </div>
      </section>
      {/* Gallery Section */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 mt-8 px-4 w-full max-w-7xl mb-16">
        {sampleImages.map((img, idx) => (
          <div key={idx} className="mb-6 break-inside-avoid">
            <img
              src={img}
              alt={`Sample ${idx + 1}`}
              className="rounded-2xl object-cover w-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
} 
