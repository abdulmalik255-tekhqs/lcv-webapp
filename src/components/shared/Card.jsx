import clsx from 'clsx'

const Card = ({ children, className, onClick, ...rest }) => (
  <div 
    className={clsx('rounded-[7px] border border-[] bg-[#FFF] p-6 shadow-[0_0_30px_rgba(0,0,0,0.08)]', className)}
    onClick={onClick}
    {...rest}
  >
    {children}
  </div>
)

export default Card

