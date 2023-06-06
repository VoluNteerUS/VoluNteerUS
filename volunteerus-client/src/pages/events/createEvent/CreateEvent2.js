import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../../components/navigation/Navbar";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";

function CreateEvent2() {
  // get details from previous page
  const location = useLocation();
  let details = null;
  let form = null;
  if (location.state) {
    details = location.state.det;
    form = location.state.form;
  }

  const navigate = useNavigate();
  const [error, setError] = useState("");

  // questions[][question number, question, question type]
  const[questions, setQuestions] = useState({
    "1": [1, "", "Open-ended"],
  });

  // restore form details if any
  useEffect(() => {
    if (form !== null) {
      setQuestions(form);
    }
  }, [])

  const handleAddQuestion = () => {
    setError("");
    let length = Object.keys(questions).length;
    if (length > 5) {
      setError("Maximum number of questions reached!")
    } else {
      let newQuestions = { ...questions };
      newQuestions[`${ length + 1 }`] = [length + 1, "", "Open-ended"];
      setQuestions({ ...newQuestions });
    }
  }

  const handleRemoveQuestion = (e, question) => {
    setError("");
    let newQuestions = { ...questions };
    let length = Object.keys(questions).length;
    let start = question[0] + 1;
    delete newQuestions[`${ question[0] }`];
    while (start <= length) {
      // assign new key = old key - 1
      Object.defineProperty(newQuestions, `${ start - 1 }`, Object.getOwnPropertyDescriptor(newQuestions, `${ start }`));
      delete newQuestions[`${ start }`];
      newQuestions[`${ start - 1 }`][0] = start - 1; 
      start = start + 1;
    }
    setQuestions({ ...newQuestions });
  }

  const handleQuestionChange = (e, question) => {
    setError("");
    let newQuestions = { ...questions };
    newQuestions[`${ question[0] }`][1] = e.target.value
    setQuestions({ ...newQuestions });
  }

  const handleTypeChange = (e, question) => {
    setError("");
    let newQuestions = { ...questions };
    newQuestions[`${ question[0] }`][2] = e.target.value
    setQuestions({ ...newQuestions });
  }

  const handleBack = () => {
    setError("");
    navigate("/events/create", { state: { det: details, form: questions } });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // create event
    try {
      // event sign up form questions
      const eventQuestions = Object.values(questions).filter(question => question[1] !== "");
      const questionObject = {};
      for (const q of eventQuestions) {
        questionObject[`${ q[0] }`] = q; 
      }

      // Send request to server
      const requestBody = questionObject;

      // Endpoint for event questions
      const questionsURL = new URL("/questions", process.env.REACT_APP_BACKEND_API);

      await axios.post(questionsURL, requestBody).then((response) => {
          console.log(response.data);
          
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
          eventData.append('questions', response.data._id);

          const eventsURL = new URL("/events", process.env.REACT_APP_BACKEND_API);
          axios.post(eventsURL, eventData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          navigate('/');
      }).catch((error) => {
          console.log(error);
      })
    } catch(err) {
      console.log(err);
    }
  }

  return ( 
    <div> 
      <Navbar /> 
      <div className="bg-pink-100 py-10"> 
        <div className="flex items-center h-screen justify-center"> 
          <div className="bg-white pb-5 rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 flex flex-col px-3"> 
            <div className="flex flex-row justify-between">
              <button onClick={ handleBack } className="p-3 mt-3 mx-3">
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <Link to="/" className="p-3 mt-3 mx-3 rounded-full bg-white/70 hover:bg-slate-500 self-end">
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </Link>
            </div>
            <div className="grid grid-cols-12 gap-4"> 
              <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col"> 
                <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 sm:text-xl md:text-2xl xl:text-3xl mb-10">Create sign up form for event</h1> 
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
                {/* form questions */}
                <h1 className="font-bold my-5">Sign Up Form Questions</h1>
                <form onSubmit={ handleSubmit } className="flex flex-col space-y-5">
                  {Object.values(questions).map((question) => ( 
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
                    <button type="submit" className="bg-pink-400 text-white rounded-lg px-3 py-1">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent2;