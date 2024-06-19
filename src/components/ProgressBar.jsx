export function ProgressBar({value, label, info}) {
  return (
      <div>
          <div className="w3-grey">
              <div className="w3-container w3-green" style={{width: `${value}%`, boxSizing:"border-box"}}>{`${value}%`}</div>
          </div>
          <div>{label}</div>
          <div style={{whiteSpace:"pre-line"}}>{info}</div>
      </div>
  )
}