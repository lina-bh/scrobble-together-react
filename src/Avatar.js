import "./Avatar.css"

export default function Avatar({ alt, src, className, ...props }) {
  const classes = "Avatar " + className
  return src ? (
    <img className={classes} alt={alt} src={src} {...props} />
  ) : (
    <div className={classes}></div>
  )
}
