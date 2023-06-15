import { Link } from "react-router-dom";

export default function StatCard({ title, value, route }) {
  return (
    <Link to={route} className='col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-3 bg-neutral-100 rounded-lg'>
      <div className="flex flex-row h-full">
        <div className="bg-primary-600 w-3 rounded-l-lg">
        </div>
        <div className="flex flex-col px-4 py-3">
          <div className="uppercase font-bold text-primary-600 text-sm pb-2">{ title }</div>
          <div className="capitalize font-bold text-xl">{ value }</div>
        </div>
      </div>
    </Link>
  );
}