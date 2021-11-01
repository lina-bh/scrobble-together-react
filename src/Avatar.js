import "./Avatar.css"

export default function Avatar({ alt, src, ...props }) {
  return src ? (
    <img className="Avatar" alt={alt} src={src} {...props} />
  ) : (
    <div className="Avatar"></div>
  )
}
