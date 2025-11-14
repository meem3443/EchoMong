import type { Echomong } from '@/types/echomong'

export function teamSetting(props: { character: Echomong }) {
  return (
    <img className="w-full h-full" src={'background.png'}>
      <img
        className="w-full h-full object-cover"
        src={props.character.img}
      ></img>
    </img>
  )
}
