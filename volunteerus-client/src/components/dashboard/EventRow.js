export default function EventRow({ event }) {
  return (
    <div className="flex flex-row px-2 py-2 items-center">
      <img className="w-14 h-14 rounded-full me-2" src={event.image_url} alt={event.title} />
      <div className="flex flex-col">
        <div className="font-semibold">{event.title}</div>
        <div className="text-sm text-gray-500">{event.organized_by.name}</div>
      </div>
    </div>
  );
}