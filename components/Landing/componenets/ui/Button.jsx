
const Button = ({children,className}) => {
  return (
    <button  
   className={`box text-black mt-6 gradientBtn  rounded-full p-6 px-16  text-[1.2rem] md:text-[1.3rem] font-[500] ${className}`}>{children}</button>
  )
}

export default Button