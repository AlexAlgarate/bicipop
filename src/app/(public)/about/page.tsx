import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - BiciPop',
  description: 'Learn more about BiciPop, the best place to buy and sell second-hand bicycles.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold text-foreground mb-8">About BiciPop</h1>

      <div className="space-y-6 text-muted-foreground">
        <p className="text-lg leading-relaxed">
          Welcome to <strong className="text-foreground">BiciPop</strong>, the premier
          marketplace for buying and selling second-hand bicycles. We connect cycling
          enthusiasts with quality pre-owned bikes in a safe and reliable platform.
        </p>

        <section className="pt-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p>
            Our mission is to promote sustainable mobility by making quality bicycles
            accessible to everyone. We believe that cycling is not just a sport or
            hobby, but a way of life that benefits both individuals and the environment.
          </p>
        </section>

        <section className="pt-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose BiciPop?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Verified sellers with transparent ratings</li>
            <li>Secure payment and transaction system</li>
            <li>Wide variety of bicycles for all levels</li>
            <li>Community of cycling enthusiasts</li>
            <li>Eco-friendly approach to cycling</li>
          </ul>
        </section>

        <section className="pt-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Join Our Community</h2>
          <p>
            Whether you&apos;re looking to sell your current bike or find your perfect
            ride, BiciPop is the place for you. Join thousands of cyclists who have already
            discovered the joy of buying and selling on our platform.
          </p>
        </section>

        <section className="pt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
          <p>
            Have questions? We&apos;d love to hear from you. Reach out to us at{' '}
            <a href="mailto:hello@bicipop.com" className="text-primary hover:underline">
              hello@bicipop.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}