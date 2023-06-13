import Navbar from "../../components/navigation/Navbar";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from "../../actions/eventActions";
import axios from "axios";
import { setQuestions } from "../../actions/questionsActions";
import moment from "moment";

function EditEventDetails() {
  const { id } = useParams();
  const [error, setError] =useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || 'Unknown';

  const [formQuestions, setFormQuestions] = useState({});
  const [page, setPage] = useState(1);

  const [details, setDetails] = useState(
    {
      "file": null,
      "title": "",
      "date": ["", "", "", ""],
      "location": "",
      "organized_by": "",
      "category": [],
      "description": "",
      "image_url": "",
      "signup_by": "",
      "questions": null
    }
  );

  useEffect(() => {
      const getEvent = async () => {
        try {
          const eventURL = new URL(`/events/${id}`, process.env.REACT_APP_BACKEND_API);
          const res = await axios.get(eventURL);
          const event = res.data;
          setDetails(
            { ...details,
              "title": event.title,
              "date": event.date,
              "location": event.location,
              "organized_by": event.organized_by,
              "category": event.category,
              "description": event.description,
              "image_url": event.image_url,
              "signup_by": event.signup_by,
              "questions": event.questions,
              "file": event.file
            }
          );
        } catch (err) {
          console.error({ err });
        }
      }
      const getQuestions = async () => {
        try {
          const eventURL = new URL(`/events/${id}`, process.env.REACT_APP_BACKEND_API);
          const res = await axios.get(eventURL);
          const event = res.data;
          const questionId = event.questions;
          const questionsURL = new URL(`/questions/${questionId}`, process.env.REACT_APP_BACKEND_API);
          const response = await axios.get(questionsURL);
          const questions = response.data;
          const finalQuestions = Object.values(questions).filter(q => q.length > 2 && q !== questionId);
          let newFormQuestions = { ...formQuestions };
          finalQuestions.forEach((question) => {
            newFormQuestions[`${ question[0] }`] = question;
          });
          setFormQuestions({ ...newFormQuestions });
        } catch (err) {
          console.error({ err });
        }
      }
      getEvent();
      getQuestions();
  }, [id]);

  const handleNext = (event) => {
    event.preventDefault();
    setError("");
    if (new Date(details.date[0]).getTime() > new Date(details.date[1]).getTime()) {
      setError("Start date cannot be later than End date");
    } else {
      setPage(2);
    }
  }

  const handleAddQuestion = () => {
    setError("");
    let length = Object.keys(formQuestions).length;
    if (length > 5) {
      setError("Maximum number of questions reached!");
    } else {
      let newQuestions = { ...formQuestions };
      newQuestions[`${ length + 1 }`] = [length + 1, "", "Open-ended"];
      setFormQuestions({ ...newQuestions });
    }
  }

  const handleRemoveQuestion = (e, question) => {
    setError("");
    let newQuestions = { ...formQuestions };
    let length = Object.keys(formQuestions).length;
    let start = question[0] + 1;
    delete newQuestions[`${ question[0] }`];
    while (start <= length) {
      // assign new key = old key - 1
      Object.defineProperty(newQuestions, `${ start - 1 }`, Object.getOwnPropertyDescriptor(newQuestions, `${ start }`));
      delete newQuestions[`${ start }`];
      newQuestions[`${ start - 1 }`][0] = start - 1; 
      start = start + 1;
    }

    setFormQuestions({ ...newQuestions });
  }

  const handleQuestionChange = (e, question) => {
    setError("");
    let newQuestions = { ...formQuestions };
    newQuestions[`${ question[0] }`][1] = e.target.value
    setFormQuestions({ ...newQuestions });
  }

  const handleTypeChange = (e, question) => {
    setError("");
    let newQuestions = { ...formQuestions };
    newQuestions[`${ question[0] }`][2] = e.target.value
    setFormQuestions({ ...newQuestions });
  }

  const handleBack = () => {
    setError("");
    setPage(1);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
          
    // event details
    const eventData = new FormData();
    eventData.append('title', details.title);
    eventData.append('date', details.date);
    eventData.append('location', details.location);
    eventData.append('organized_by', details.organized_by);
    eventData.append('category', details.category);
    eventData.append('signup_by', details.signup_by);
    eventData.append('description', details.description);
    eventData.append('image_url', details.image_url);
    eventData.append('file', details.file);
    eventData.append('questions', details.questions);

    let length = Object.keys(formQuestions).length;
    let requestBody = formQuestions;
    for (let i = length + 1; i < 7; i++) {
      requestBody[`${ i }`] = [];
    }

    // Send PATCH request to update event and sign up form questions
    const eventURL = new URL(`/events/${id}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
    const questionURL = new URL(`/questions/${details.questions}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
    await axios.patch(eventURL, eventData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res);
      if (!res.data) {
        alert('You do not have permission to edit.');
        navigate('/');
      }
    }).catch((err) => {
      console.error(err);
    });
    console.log(formQuestions);
    await axios.patch(questionURL, requestBody).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
            
    // Send GET request to get updated event details and sign up form questions
    const eventsURL = new URL("/events", process.env.REACT_APP_BACKEND_API);
    const questionsURL = new URL("/questions", process.env.REACT_APP_BACKEND_API);
    const updatedDetails = axios.get(eventsURL).then((res) => res.data);
    const updatedQuestions = axios.get(questionsURL).then((res) => res.data);

    // Update event details and sign up form questions in redux store
    dispatch(setEvents(updatedDetails));
    dispatch(setQuestions(updatedQuestions));

    navigate('/');
  }
  
  const handleExit = () => {
    navigate('/');
  }

  return ( 
    <div> 
      <Navbar /> 
      { page == 1 
        ? <div className="bg-pink-100 py-10"> 
          <div className="flex items-center h-screen justify-center"> 
            <div className="bg-white pb-5 rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 flex flex-col px-3"> 
              <Link to="/" className="p-3 mt-3 mx-3 rounded-full bg-white/70 hover:bg-slate-500 self-end">
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </Link>
              <div className="grid grid-cols-12 gap-4"> 
                <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col"> 
                  <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 sm:text-xl md:text-2xl xl:text-3xl mb-10">Edit event details</h1> 
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
                  {/* Event details questions */}
                  <form onSubmit={ handleNext } className="flex flex-col my-5 space-y-5">
                    <div className="flex flex-row space-x-10">
                      <div className="w-1/2 flex flex-col justify-evenly">
                        <label className="font-semibold">Event title</label>
                        <input required type="text" value={ details?.title } placeholder="Event title" className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, title: e.target.value}); }} />
                        <label className="font-semibold">Description</label>
                        <textarea required rows={8} value={ details?.description } placeholder="Description" className="p-1 border border-grey-600 rounded-md" onChange={ e => {setDetails({...details, description: e.target.value}); }} />
                        <label className="font-semibold">Location</label>
                        <input required type="text" value={ details?.location } placeholder="Location of Event" className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, location: e.target.value}); }}/>
                      </div>
                      <div className="w-1/2 flex flex-col justify-evenly">
                        <label className="font-semibold">Category (select all that applies)</label>
                        <select required multiple={ true } value={ details?.category } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {
                          const options = [...e.target.selectedOptions];
                          const values = options.map(option => option.value);
                          setDetails({...details, category: values}); }}
                        >
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
                            <input required type="date" value={ details?.date[0] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [e.target.value, details.date[1], details.date[2], details.date[3]]}); }} />
                          </div>
                          <div className="flex flex-col w-1/2">
                            <label className="font-semibold">End date</label>
                            <input required type="date" value={ details?.date[1] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [details.date[0], e.target.value, details.date[2], details.date[3]]}); }} />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="flex flex-col w-1/2">
                            <label className="font-semibold">Start time</label>
                            <input required type="time" value={ details?.date[2] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [details.date[0], details.date[1], e.target.value, details.date[3]]}); }} />
                          </div>
                          <div className="flex flex-col w-1/2">
                            <label className="font-semibold">End time</label>
                            <input required type="time" value={ details?.date[3] } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, date: [details.date[0], details.date[1], details.date[2], e.target.value]}); }} />
                          </div>
                        </div>
                        <label className="font-semibold">Form closing date</label>
                        <input required type="date" value={ moment(`${details.signup_by}`).format('yyyy-MM-DD')  } className="p-1 border border-grey-600 rounded-md mb-2" onChange={ e => {setDetails({...details, signup_by: e.target.value}); }} />
                        <label className="font-semibold">Thumbnail image</label>
                        <input required type="file" accept="image/*" className="p-1 border border-grey-600 rounded-md mb-2" onChange={e => {setDetails({...details, file: e.target.files[0]}); }} />
                        <p className="text-red-600 text-xs">{ error }</p>
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
        : <div className="bg-pink-100 py-10"> 
          <div className="flex items-center h-screen justify-center"> 
            <div className="bg-white pb-5 rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 flex flex-col px-3"> 
              <div className="flex flex-row justify-between">
                <button onClick={ handleBack } className="p-3 mt-3 mx-3">
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <button onClick={ handleExit } className="p-3 mt-3 mx-3 rounded-full bg-white/70 hover:bg-slate-500 self-end">
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              <div className="grid grid-cols-12 gap-4"> 
                <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col"> 
                  <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 sm:text-xl md:text-2xl xl:text-3xl mb-10">Edit event sign up form questions</h1> 
                  {/* form progress bar */}
                  <ol className="flex justify-center">
                    <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                      <span className="flex items-center justify-center w-10 h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                        <p className="text-white">1</p>
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="flex items-center justify-center w-10 h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                        <p className="text-white">2</p>
                      </span>
                    </li>
                  </ol>
                  {/* Event sign up form questions */}
                  <h1 className="font-bold my-5">Sign Up Form Questions</h1>
                  <form onSubmit={ handleSubmit } className="flex flex-col space-y-5">
                    {Object.values(formQuestions).map((question) => ( 
                      <div key={ question[0] } className="flex space-x-3">
                        <input type="text" value={ question[1] } onChange={ e => handleQuestionChange(e, question) } placeholder={`Question ${ question[0] }`} className="border border-grey-600 p-1 rounded-lg w-2/3"/>
                        <select value={ question[2] } onChange={ e => handleTypeChange(e, question) } className="border border-grey-600 p-1 rounded-lg">
                          <option value="Open-ended">Open-ended</option>
                          <option value="Yes / No">Yes / No</option>
                        </select>
                        <button type="button" onClick={ e => handleRemoveQuestion(e, question) } className="bg-red-700 text-white rounded-lg px-2">Remove</button>
                      </div>
                    ))}
                    <p className="text-red-700">{ error }</p>
                    <div className="flex space-x-2 justify-end py-10">
                      <button type="button" onClick={ handleAddQuestion } className="bg-grey-800 text-white rounded-lg px-2 py-1">Add Question</button>
                      <button type="submit" className="bg-pink-400 text-white rounded-lg px-3 py-1">Update</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div> 
  ) 
}

export default EditEventDetails;