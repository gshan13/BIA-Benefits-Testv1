const VerifyRequestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md border border-black">
        <h2 className="text-2xl font-semibold text-center mb-6">Check your email</h2>
        <p className="text-gray-700 text-center mb-4">A sign-in link has been sent to your email address.</p>
        <img src="/img/logo_bia.png" alt="BIA Logo" className="mx-auto mb-6" />
        {/* You can add more content or customization here as needed */}
      </div>
    </div>
  );
};

export default VerifyRequestPage;
