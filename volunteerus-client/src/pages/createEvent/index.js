import Navbar from "../../components/navigation/Navbar"; 
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useEffect, useState } from "react";

function CreateEvent() { 
  const navigate = useNavigate()
  const [details, setDetails] = useState(
    {
      "title": "",
      "date": ["", "", "", ""],
      "location": "",
      "organized_by": "",
      "category": [],
      "description": "",
      "image_url": "",
      "signup_by": ""
    }
  )

  // get details from previous page
  const location = useLocation();
  let det = null;
  let questions = null;
  if (location.state) {
    det = location.state.det;
    questions = location.state.form;
  }
  
  
  // restore form details if any
  useEffect(() => {
    if (det != null) {
      setDetails(det);
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/create-event/2", { state: {det: details, form: questions } });
  }

  return ( 
    <div> 
      <Navbar /> 
      <div className="bg-pink-100 py-10"> 
        <div className="flex items-center h-screen justify-center"> 
          <div className="bg-white pb-5 rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 flex flex-col"> 
            <Link to="/" className="p-3 mt-3 mx-3 rounded-full bg-white/70 hover:bg-slate-500 self-end">
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </Link>
            <div className="grid grid-cols-12 gap-4"> 
              <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col"> 
                <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 sm:text-xl md:text-2xl xl:text-3xl mb-10">Create new event</h1> 
                {/* form progress bar */}
                <ol className="flex justify-center">
                  <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-grey-800 after:border-4 after:inline-block">
                    <span className="flex items-center justify-center w-10 h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                      <p className="text-white">1</p>
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="flex items-center justify-center w-10 h-10 bg-grey-800 rounded-full lg:h-12 lg:w-12 shrink-0">
                      <p className="text-white">2</p>
                    </span>
                  </li>
                </ol>
                {/* form questions */}
                <form onSubmit={ handleSubmit } className="flex flex-col my-5 space-y-5">
                  <div className="flex flex-row space-x-10">
                    <div className="w-1/2 flex flex-col justify-evenly">
                      <label className="font-semibold">Event title</label>
                      <input required type="text" value={ details.title } placeholder="Event title" className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, title: e.target.value}); }} />
                      <label className="font-semibold">Description</label>
                      <textarea required rows={8} value={ details.description } placeholder="Description" className="p-1 border border-grey-600 rounded-md" onChange={ e => {setDetails({...details, description: e.target.value}); }} />
                      <label className="font-semibold">Location</label>
                      <input required type="text" value={ details.location } placeholder="Location of Event" className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, location: e.target.value}); }}/>
                      <label className="font-semibold">Organization</label>
                      <select required defaultValue={ details.organization } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, organized_by: e.target.value}); }}>
                        <option value="NUS Rotaract Club">NUS Rotaract Club</option>
                        <option value="NUS Students' Community Service Club">NUS Students' Community Service Club</option>
                      </select>
                    </div>
                    <div className="w-1/2 flex flex-col justify-evenly">
                      <label className="font-semibold">Category (select all that applies)</label>
                      <select required multiple={ true } value={ details.category } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, category: [e.target.value]}); }}>
                        <option value="Elderly">Elderly</option>
                        <option value="Migrant Workers">Migrant Workers</option>
                        <option value="Patients">Patients</option>
                        <option value="PWID">PWID</option>
                        <option value="Youth">Youth</option>
                        <option value="Local">Local</option>
                        <option value="Overseas">Overseas</option>
                        <option value="Special project">Special project</option>
                        <option value="Regular project">Regular project</option>
                      </select>
                      <div className="flex space-x-2">
                        <div className="flex flex-col w-1/2">
                          <label className="font-semibold">Start date</label>
                          <input required type="date" value={ details.date[0] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [e.target.value, details.date[1], details.date[2], details.date[3]]}); }} />
                        </div>
                        <div className="flex flex-col w-1/2">
                          <label className="font-semibold">End date</label>
                          <input required type="date" value={ details.date[1] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [details.date[0], e.target.value, details.date[2], details.date[3]]}); }} />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex flex-col w-1/2">
                          <label className="font-semibold">Start time</label>
                          <input required type="time" value={ details.date[2] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [details.date[0], details.date[1], e.target.value, details.date[3]]}); }} />
                        </div>
                        <div className="flex flex-col w-1/2">
                          <label className="font-semibold">End time</label>
                          <input required type="time" value={ details.date[3] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [details.date[0], details.date[1], details.date[2], e.target.value]}); }} />
                        </div>
                      </div>
                      <label className="font-semibold">Form closing date</label>
                      <input required type="date" value={ details.signup_by } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, signup_by: e.target.value}); }} />
                      <label className="font-semibold">Thumbnail image</label>
                      <input required type="file" className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, image_url: e.target.value}); }}/>
                    </div>
                  </div>
                  <button type="submit" className="bg-pink-400 rounded-lg px-6 py-1 self-end text-white">
                    Next
                  </button>
                </form>
              </div>  
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ) 
} 
 
export default CreateEvent;