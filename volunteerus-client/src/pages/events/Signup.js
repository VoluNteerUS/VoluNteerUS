import Navbar from "../../components/navigation/Navbar"; 
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../actions/eventActions";
import { setResponses } from "../../actions/responsesActions";
import SignUpForm from "../../components/SignUpForm";
 
function EventSignup() { 
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const eventReducer = useSelector((state) => state.events);
  const event = eventReducer?.event;

  const [questions, setQuestions] = useState([]);
  
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";
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
          alert("You have already submitted a response.")
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
          console.log(event)
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send request to server
    const requestBody = { ...response, submitted_on: Date.now() };

    // Endpoint for responses
    const responsesURL = new URL(`/responses?role=${user.role}`, process.env.REACT_APP_BACKEND_API);

    await axios.post(responsesURL, requestBody).then((response) => {
      console.log(response.data);
      // User is not logged in -> redirect to login page
      if (!response.data) {
        navigate('/login');
      } else {
        // Send GET request to get updated responses
        const allResponsesURL = new URL(`/responses`, process.env.REACT_APP_BACKEND_API);
        const updatedResponses = axios.get(allResponsesURL).then((res) => res.data);

        // Update responses in redux store
        dispatch(setResponses(updatedResponses));

        navigate('/');
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  return ( 
    <> 
      <Navbar /> 
      <SignUpForm
        questions={ questions }
        response={ response }
        event={ event }
        handleSubmit={ handleSubmit }
        handleChange={ handleChange }
        action="Submit"
      />
    </> 
  ) 
} 
 
export default EventSignup;
