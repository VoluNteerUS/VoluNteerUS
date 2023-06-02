import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

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
  
  const[questions, setQuestions] = useState([{
    "id": 1,
    "question": "",
    "type": "Open-ended",
  }]);

  // restore form details if any
  useEffect(() => {
    if (form  != null) {
      setQuestions(form);
    }
  }, [])

  const handleAddQuestion = () => {
    let length = questions.length;
    setQuestions([...questions, { id: length + 1, question: "", type: "Open-ended" }])
  }

  const handleRemoveQuestion = (e, question) => {
    let backQuestions = questions.slice(question.id);
    let newBackQuestion = backQuestions.map(q => { return { id: q.id - 1, question: q.question, type: q.type } });
    setQuestions([
      ...questions.slice(0, question.id - 1),
      ...newBackQuestion
    ]);
  }

  const handleQuestionChange = (e, question) => {
    setQuestions([
      ...questions.slice(0, question.id - 1),
      { id: question.id, question: e.target.value, type: question.type },
      ...questions.slice(question.id)
    ]);
  }

  const handleTypeChange = (e, question) => {
    setQuestions([
      ...questions.slice(0, question.id - 1),
      { id: question.id, question: question.question, type: e.target.value },
      ...questions.slice(question.id)
    ]);
  }

  const handleBack = () => {
    navigate("/create-event", { state: {det: details, form: questions } });
  }

  const handleSubmit = () => {
    return;
  }

  return ( 
    <div> 
      <Navbar /> 
      <div className="bg-pink-100 py-10"> 
        <div className="flex items-center h-screen justify-center"> 
          <div className="bg-white pb-5 rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 flex flex-col"> 
            <div className="flex flex-row justify-between">
              <button onClick={ handleBack } to="/create-event" className="p-3 mt-3 mx-3">
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
                  {questions.map(question => ( 
                    <div key={question.id} className="flex space-x-3">
                      <input type="text" value={question.question} onChange={ e => handleQuestionChange(e, question) } placeholder="Question" className="border border-grey-600 p-1 rounded-lg w-2/3"/>
                      <select value={question.type} onChange={ e => handleTypeChange(e, question) } className="border border-grey-600 p-1 rounded-lg">
                        <option value="Open-ended">Open-ended</option>
                        <option value="Yes / No">Yes / No</option>
                      </select>
                      <button type="button" onClick={ e => handleRemoveQuestion(e, question) } className="bg-red-700 text-white rounded-lg px-2">Remove</button>
                    </div>
                  ))}
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