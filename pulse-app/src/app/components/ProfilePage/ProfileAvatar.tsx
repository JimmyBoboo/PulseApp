type Props = { name: string; size?: number }

export const ProfileAvatar = ({ name, size = 72 }: Props) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
  const color = ['bg-red-300','bg-blue-300','bg-green-300','bg-yellow-300'][Math.floor(Math.random() * 4)]
  return (
    <div className={`flex items-center justify-center rounded-full ${color} text-gray-800 font-bold`}
      style={{ width: size, height: size }}>
      {initials}
    </div>
  )
}
