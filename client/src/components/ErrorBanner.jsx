const ErrorBanner = ({ error, setError }) => {
    return (
        <div className="error-box">
            <span>{error}</span>
            <button className="btn btn-ghost" onClick={() => setError(null)}>×</button>
        </div>
    )
}

export default ErrorBanner;
