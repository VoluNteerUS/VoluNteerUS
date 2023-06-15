import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import imageCross from "../../assets/images/cross.png" 
import { useSelector, useDispatch } from "react-redux";
import { setResponses } from "../../actions/responsesActions";

function EditResponse() {
  const { id } = useParams();
  const [response, setResponse] = useState({});
  const [questions, setQuestions] = useState({});
  const [event, setEvent] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";

  const getResponseAndQuestionAndEvent = async () => {
    try {
      const responseURL = new URL(`/responses/${ id }`, process.env.REACT_APP_BACKEND_API);
      const responseRes = await axios.get(responseURL);
      const responses = responseRes.data;
      setResponse(responses);

      const event_id = responses.event;
      const eventURL = new URL(`/events/${ event_id }`, process.env.REACT_APP_BACKEND_API);
      const eventRes = await axios.get(eventURL);
      const event = eventRes.data;
      setEvent(event);

      const question_id = event.questions;
      const questionsURL = new URL(`/questions/${ question_id }`, process.env.REACT_APP_BACKEND_API);
      const questionsRes = await axios.get(questionsURL);
      const question = questionsRes.data;
      setQuestions(question);
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getResponseAndQuestionAndEvent();
  }, [])

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
          value={response[`${question[0]}`]}
          onChange={ (e) => handleChange(e, question) }                 
        /> 
      )
    } else if (question[2] === "Yes / No") {
      return (
        <select required value={response[`${question[0]}`]} className="border rounded-lg mt-2 md:w-1/2 py-1" onChange={ (e) => handleChange(e, question)} >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send request to server
    const requestBody = { ...response, submitted_on: Date.now() };

    // Endpoint for responses
    const responsesURL = new URL(`/responses/${ id }?role=${user.role}`, process.env.REACT_APP_BACKEND_API);

    // Send PATCH request to update response
    await axios.patch(responsesURL, requestBody).then((res) => {
      console.log(res);
      if (!res.data) {
        alert('You do not have permission to edit.');
        navigate('/');
      }
    }).catch((err) => {
      console.error(err);
    });
            
    // Send GET request to get updated responses
    const allResponsesURL = new URL(`/responses`, process.env.REACT_APP_BACKEND_API);
    const updatedResponses = axios.get(allResponsesURL).then((res) => res.data);

    // Update responses in redux store
    dispatch(setResponses(updatedResponses));

    navigate(-1);
    alert(`Response for ${event.title} successfully updated`);
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
                {Object.values(questions).filter((question) => question.length > 1 && question !== event.questions).map((question) => (
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
                  <button type="submit" className="bg-pink-400 rounded-md text-white py-1 px-3 mb-10">Update</button> 
                </div> 
              </form> 
            </div> 
          </div> 
        </div> 
      </div> 
    </>
  )
}

export default EditResponse;
