const Badge = ({children, style={}, ...props}) => {
    return (
        <span style={{
            fontSize: "65%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "0.5rem",
            padding: "0.15rem 0.5rem",
            background: "#fff",
            color: "#000",
            borderRadius: "1rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            ...(style || {})
          }}
          {...props}
          >{children}</span>
    )
}

export default Badge;