import Navbar from "../../components/navigation/Navbar"; 
import imageCross from "../../assets/images/cross.png" 
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../actions/eventActions";

 
function EventSignup() { 
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const eventReducer = useSelector((state) => state.events);
  const event = eventReducer?.event;

  const [questions, setQuestions] = useState([]);
  
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user;
  const user_id = user?.id;

  const [response, setResponse] = useState({ "user": user_id });

  useEffect(() => {
    // check if user has submitted a response
    const getResponse = async () => {
      try {
        const responseURL = new URL(`/responses`, process.env.REACT_APP_BACKEND_API);
        const res = await axios.get(responseURL);
        const response = res.data;
        // user has submitted a response, go back to homepage
        const userResponse = response.filter(response => response.user === user_id);
        const submittedResponse = userResponse.filter(response => response.event === id);
        if (submittedResponse.length > 0) {
          console.log(submittedResponse);
          navigate('/');
        }
      } catch (err) {
        console.log({ err });
      }
    }
    const getEvent = async () => {
      try {
          const eventURL = new URL(`/events/${id}`, process.env.REACT_APP_BACKEND_API);
          const res = await axios.get(eventURL);
          const event = res.data;
          dispatch(setEvent(event));
          setResponse({ ...response, event: event._id })
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
        const finalQuestions = Object.values(questions).filter(q => q.length > 2 && q[1] !== "" && q !== questionId);
        setQuestions(finalQuestions);
      } catch (err) {
        console.error({ err });
      }
    }
    getResponse();
    getEvent();
    getQuestions();
  }, [id]);

  const handleChange = (e,question) => {
    let newResponse = { ...response };
    newResponse[`${ question[0] }`] = e.target.value;
    setResponse({ ...newResponse });
  }

  function inputType(question) {
    if (question[2] === "Open-ended") {
      return (
        <textarea className="border border-black p-1" 
          required
          onChange={ (e) => handleChange(e, question) }                 
        /> 
      )
    } else if (question[2] === "Yes / No") {
      return (
        <select required className="border rounded-lg mt-2 md:w-1/2 py-1" onChange={ (e) => handleChange(e, question)} >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      )
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send request to server
    const requestBody = response;

    // Endpoint for responses
    const responsesURL = new URL("/responses", process.env.REACT_APP_BACKEND_API);

    await axios.post(responsesURL, requestBody).then((response) => {
      navigate('/');
    }).catch((error) => {
      console.log(error);
    })
  }

  return ( 
    <> 
      <Navbar /> 
      <div className="bg-pink-100"> 
        <div className="flex items-center h-screen justify-center"> 
          <div className="bg-white rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 px-3"> 
            <button onClick={ () => navigate(-1) }>
              <img src={ imageCross } alt="cross" className="h-10 w-10 m-3 fill-pink-400"/> 
            </button>
            <div className="grid grid-cols-12 gap-4"> 
              <form onSubmit={ handleSubmit } className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4">
                <h1 className="font-bold tracking-tight leading-none text-darkblue-900 sm:text-2xl md:text-3xl xl:text-4xl text-center mb-10">Volunteer for { event?.title }</h1> 
                {/* form questions */}
                {questions.map((question) => (
                  <div className="flex flex-col mb-10" key={ question[0] }> 
                    <label className="">{ question[1] }</label> 
                    { inputType(question) }
                  </div> 
                ))}
                <div className="flex flex-row space-x-2 mb-10"> 
                  <input className="w-8 h-8" 
                    required  
                    type="checkbox"              
                  /> 
                  <label className="font-semibold">Confirm attendance</label> 
                </div> 
                <div className="flex justify-end"> 
                  <button type="submit" className="bg-pink-400 rounded-md text-white py-1 px-3 mb-10">Submit</button> 
                </div> 
              </form> 
            </div> 
          </div> 
        </div> 
      </div> 
    </> 
  ) 
} 
 
export default EventSignup;
