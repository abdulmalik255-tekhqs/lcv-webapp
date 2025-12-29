import clsx from 'clsx'
import Card from './Card'

const Icon = ({ src, className }) => (
  <span className={clsx("flex items-center justify-center !bg-[#FFFFFF] rounded-full p-2 border border-gray-200", className)}>
    <img src={src} alt="" className="h-6 w-6 md:h-4 md:w-4" />
  </span>
)

const CardData = ({
  label,
  value,
  icon,
  iconAlignment = 'right', // 'left' | 'right' | 'top' | 'bottom'
  labelSize = 'text-[15px] md:text-[15px]',
  valueSize = 'text-[24px] md:text-[32px]',
  fontWeight = 'font-medium',   // font-medium | font-semibold | font-bold  default font-medium 
  className,
  cardClassName,
}) => {
  const getAlignmentClasses = (alignment) => {
    switch (alignment) {
      case 'left':
        return 'flex-row'
      case 'right':
        return 'flex-row justify-between'
      case 'top':
        return 'flex-col items-start'
      case 'bottom':
        return 'flex-col-reverse items-start'
      default:
        return 'flex-row justify-between'
    }
  }

  const renderContent = () => {
    if (iconAlignment === 'right') {
      return (
        <>
          <p className={clsx("font-medium text-[#000]", labelSize, fontWeight)}>{label}</p>
          <Icon src={icon} />
        </>
      )
    } else if (iconAlignment === 'left') {
      return (
        <>
          <Icon src={icon} />
          <p className={clsx("font-medium text-[#000]", labelSize, fontWeight)}>{label}</p>
        </>
      )
    } else if (iconAlignment === 'top') {
      return (
        <>
          <Icon src={icon} />
          <p className={clsx("font-medium text-[#000]", labelSize, fontWeight)}>{label}</p>
        </>
      )
    } else if (iconAlignment === 'bottom') {
      return (
        <>
          <p className={clsx("font-medium text-[#000]", labelSize, fontWeight)}>{label}</p>
          <Icon src={icon} />
        </>
      )
    }
  }

  return (
    <Card
      className={clsx(
        "relative overflow-hidden p-3 md:!p-3 rounded-[7px] !bg-[#FAFAFC] border border-[#E5E5EA]",
        cardClassName
      )}
    >
      <div className={clsx("flex items-center mb-2", getAlignmentClasses(iconAlignment))}>
        {renderContent()}
      </div>
      <p className={clsx("font-semibold text-[#0A0A0A]", valueSize, fontWeight,     className)}>
        {value}
      </p>
    </Card>
  )
}

export default CardData

