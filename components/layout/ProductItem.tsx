import { TCard } from "@/db"
import Image from "next/image"

export default function ProductItem(props: TCard) {
  return (
    <div className='border rounded p-4 shadow-sm flex flex-col '>
      <Image src={props.images[0]} alt={props.name} width={200} height={200} />
      <div className='mt-4 flex-1 flex flex-col justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>{props.name}</h2>
          <p className='text-gray-600'>{props.description}</p>
        </div>
        <div className='mt-2 text-xl font-bold'>${props.price}₽</div>
      </div>
    </div>
  )
}
