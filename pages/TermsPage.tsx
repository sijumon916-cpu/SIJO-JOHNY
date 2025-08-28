
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-neutral mb-6">Terms and Conditions</h1>
      <div className="prose max-w-none text-gray-700 space-y-4">
        <h2 className="text-xl font-semibold text-neutral">1. General</h2>
        <p>
          Welcome to our network. By joining, you agree to be bound by these terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-xl font-semibold text-neutral">2. Membership</h2>
        <p>
          Membership is initiated through a valid referral code. Each member is responsible for the activities under their account.
        </p>

        <h2 className="text-xl font-semibold text-neutral">3. Earning Points</h2>
        <p>
          Points are earned by completing specific tasks as outlined in your dashboard. The company reserves the right to change task requirements and rewards. 1,000 points are equivalent to 50 AED for withdrawal purposes.
        </p>
        
        <h2 className="text-xl font-semibold text-neutral">4. Withdrawal Policy</h2>
        <p>
          The withdrawal option is activated once your account balance reaches a minimum of 500 AED. All withdrawal requests are subject to review and verification.
        </p>
        <p className="font-semibold text-primary">
          Purchase Requirement: Please be aware that a 500 AED purchase is required to be eligible for fund withdrawals. This is a one-time condition.
        </p>
        <p className="font-semibold text-accent">
          Cash Withdrawal Option: If you opt for an immediate cash withdrawal ("ready cash"), you will receive half (50%) of the withdrawal amount. The remaining balance will be forfeited. This is to cover processing and administrative fees for expedited service.
        </p>

        <h2 className="text-xl font-semibold text-neutral">5. Account Termination</h2>
        <p>
          The company reserves the right to terminate any account for fraudulent activities or violation of these terms without prior notice.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
