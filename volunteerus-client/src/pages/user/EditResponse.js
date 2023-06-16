import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import SignUpForm from "../../components/SignUpForm";
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
      <SignUpForm
        questions={ Object.values(questions).filter((question) => question.length > 1 && question !== event.questions) }
        response={ response }
        event={ event }
        handleSubmit={ handleSubmit }
        handleChange={ handleChange }
        action="Update"
      />
    </>
  )
}

export default EditResponse;
