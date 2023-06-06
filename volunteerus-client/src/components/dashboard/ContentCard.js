export default function ContentCard({ title, children }) {
  return (
    <div className="flex flex-col bg-neutral-100 rounded-lg">
      <div className="bg-primary-600 rounded-t-lg px-3 py-1 flex justify-between">
        <div className="font-bold text-white uppercase">{ title }</div>
      </div>
      <div>
        { children }
      </div>
    </div>
  )
}