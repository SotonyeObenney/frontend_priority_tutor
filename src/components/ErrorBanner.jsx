const ErrorBanner = ({ errorMessage, errorType, positive }) => {
  return (
    <div
      className="flex items-center gap-3 p-4 mb-5 text-sm text-red-800 border border-red-200 rounded-lg bg-red-50"
      role="alert"
      aria-live="assertive"
    >
      {/* <!-- Warning Icon --> */}

      <svg
        className="shrink-0 inline w-5 h-5"
        aria-hidden="true"
        xmlns="http://w3.org"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {/* Get lucide react here  */}
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div>
        <span className="font-semibold">{errorType} failed: </span>
        {errorMessage}
      </div>
    </div>
  );
};

// This shoudl be an alert banner instead of error banner
export default ErrorBanner;
