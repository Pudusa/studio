import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find((img) => img.id === 'about-us-image');
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About Apex</h1>
          <p className="mt-4 text-lg text-muted-foreground">Making your life easier, one click at a time.</p>
        </div>
        
        {aboutImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image 
                    src={aboutImage.imageUrl} 
                    alt={aboutImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={aboutImage.imageHint}
                />
            </div>
        )}

        <div className="prose prose-lg mx-auto max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:font-bold">
            <h2>Our Mission</h2>
            <p>
              We were born with a simple mission: to make your life easier. We believe that shopping online should be fast, secure, and accessible. That's why we bring together millions of products from the best brands and sellers in one place. 
            </p>
            <p>
              From the most innovative gadgets to everyday essentials, we work to help you find exactly what you're looking for, at the best price and with the convenience you deserve. Thank you for trusting us to be a part of your life.
            </p>
        </div>
      </div>
    </div>
  );
}
