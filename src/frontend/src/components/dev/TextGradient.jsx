const TextGradient = (props) => {
  const from = props.from || 'from-orange-700'
  const via = props.via || 'via-blue-500'
  const to = props.to || 'to-green-400'

  return (
    <span
      className={`bg-gradient-to-r ${from} ${via} ${to} text-transparent bg-clip-text bg-300% animate-gradient`}
    >
      {props.text}
    </span>
  )
}