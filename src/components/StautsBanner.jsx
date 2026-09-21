const StatusBanner = ({
  errorMessage,
  errorType,
  positive,
  successMessage,
}) => {
  // Define dynamic styles based on the positive prop
  const containerStyles = positive
    ? "text-green-800 border-green-200 bg-green-50"
    : "text-red-800 border-red-200 bg-red-50";

  return (
    <div
      className={`flex items-center gap-3 p-4 mb-5 text-sm border rounded-lg ${containerStyles}`}
      role="alert"
      aria-live={positive ? "polite" : "assertive"}
    >
      {positive ? (
        /* Success Checkmark Icon */
        <svg
          className="shrink-0 inline w-5 h-5"
          aria-hidden="true"
          xmlns="http://w3.org"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      ) : (
        /* Error Warning Icon */
        <svg
          className="shrink-0 inline w-5 h-5"
          aria-hidden="true"
          xmlns="http://w3.org"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
      )}

      <div>
        {positive ? (
          <>
            <span className="font-semibold">Success: </span>
            {successMessage}
          </>
        ) : (
          <>
            <span className="font-semibold">
              {errorType || "Action"} failed:{" "}
            </span>
            {errorMessage || "An unknown error occurred."}
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBanner;
