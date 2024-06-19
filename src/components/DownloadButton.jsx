export function DownloadButton({ handleClick, disabled, children }) {
  return <button className="btn-block btn-large" onClick={handleClick} disabled={disabled}>{children}</button>
}