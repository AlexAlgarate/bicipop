import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - BiciPop',
  description: 'Read the terms and conditions of using BiciPop marketplace.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

      <div className="space-y-8 text-muted-foreground">
        <p className="text-lg">
          Welcome to BiciPop. By accessing and using our platform, you agree to be bound
          by these terms and conditions. Please read them carefully.
        </p>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By using BiciPop, you acknowledge that you have read, understood, and agree to
            be bound by these Terms of Service. If you do not agree to these terms, please
            do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            2. User Accounts
          </h2>
          <p>
            To use certain features of BiciPop, you must create an account. You are
            responsible for maintaining the confidentiality of your account credentials
            and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            3. Listing and Selling
          </h2>
          <p>
            When listing a bicycle for sale on BiciPop, you agree to provide accurate and
            complete information about the item. You are responsible for the accuracy of
            your listings and must have the right to sell the items you list.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            4. Prohibited Items
          </h2>
          <p>The following items are prohibited from being listed on BiciPop:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Stolen or illegally obtained bicycles</li>
            <li>Items with altered or removed serial numbers</li>
            <li>Counterfeit or replica bicycles presented as authentic</li>
            <li>Any items that violate applicable laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Transactions</h2>
          <p>
            All transactions on BiciPop are between buyers and sellers. BiciPop acts as a
            platform to facilitate these transactions but does not guarantee the quality,
            safety, or legality of listed items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Post false, misleading, or fraudulent listings</li>
            <li>Engage in any illegal activity</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Impersonate any person or entity</li>
            <li>Attempt to circumvent any security measures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            7. Intellectual Property
          </h2>
          <p>
            All content on BiciPop, including logos, designs, and software, is the
            property of BiciPop or its licensors. You may not copy, modify, or distribute
            any content from our platform without our written consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            8. Disclaimer of Warranties
          </h2>
          <p>
            BiciPop is provided &quot;as is&quot; and &quot;as available&quot; without
            warranties of any kind, either express or implied. We do not warrant that the
            platform will be uninterrupted or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            9. Limitation of Liability
          </h2>
          <p>
            BiciPop shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            10. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of
            BiciPop after any changes indicates your acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            11. Contact Information
          </h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:hello@bicipop.com" className="text-primary hover:underline">
              hello@bicipop.com
            </a>
          </p>
        </section>

        <p className="pt-4 text-sm">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
