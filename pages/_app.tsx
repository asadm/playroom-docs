import { TooltipProvider } from '@/components/ui/tooltip';
import PromptForAi from '@/components/PromptForAi';
import '../styles/global.css'; // Adjust the path according to where you placed your global CSS file
import { Toaster } from 'sonner';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <PromptForAi />
      <TooltipProvider>
      <Toaster richColors position="top-right" />
        <Component {...pageProps} />
      </TooltipProvider>
    </>
  )
}