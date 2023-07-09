import Navbar from "../../components/navigation/Navbar"; 
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEvent } from "../../actions/eventActions";
import { setResponses } from "../../actions/responsesActions";
import SignUpPart1 from "../../components/form/SignUpPart1";
import SignUpPart2 from "../../components/form/SignUpPart2";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";

const FormSubmittedMessage = ({event, submission}) => {
  return (
    <div className="block mx-auto lg:w-3/4 p-4 md:p-8">
      <div className="bg-yellow-100 border border-yellow-500 text-yellow-700 px-4 py-3 rounded-md flex items-center" role="alert">
        <ExclamationCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />
        <p className="text-sm md:text-base">You have already submitted the sign-up form.</p>
      </div>
      <div className="bg-white my-4 p-6 md:p-8 rounded-lg">
        <div className="font-semibold text-neutral-800 text-lg lg:text-xl">Submission recieved for {event.title}!</div>
        <p>Submitted on: {moment(`${submission.submitted_on}`).format('dddd, DD MMMM YYYY, HH:MM A')}</p>
        <div className="flex flex-col items-center p-2 md:p-6 lg:p-8">
          <CheckCircleIcon className="w-28 h-28 text-green-500 mr-2" aria-hidden="true" />
          <div className="font-bold text-xl lg:text-2xl text-center">Thank you for your response!</div>
          <div className="font-semibold text-lg text-center">You will be notified if you are selected to volunteer for this event.</div>
          <Link to="/events" className="mt-4 px-4 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-500">Return to events</Link>
        </div>
      </div>
    </div>
  )
}
 
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

  const [response, setResponse] = useState({ "user": user_id, selected_users: [] });
  const [page, setPage] = useState(1);

  const [submitted, setSubmitted] = useState(false);
  const [submission, setSubmission] = useState({});

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
          // console.log(submittedResponse);
          setSubmitted(true);
          setSubmission(submittedResponse[0]);
          // alert("You have already submitted a response.")
          // navigate('/');
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

  const handleChange = (e, question) => {
    let newResponse = { ...response };
    if (!newResponse[`${ question[0] }`]) {
      newResponse[`${ question[0] }`] = [""];
    }
    newResponse[`${ question[0] }`][0] = e.target.value;
    setResponse({ ...newResponse });
  }

  const handleCheck = (e, key, question) => {
    let newResponse = { ...response };
    const numOfOptions = Object.values(question[3]).filter((option) => option !== "").length;
    if (!newResponse[`${ question[0] }`]) {
      newResponse[`${ question[0] }`] = new Array(numOfOptions).fill(false);
    }
    newResponse[`${ question[0] }`][key - 1] = e.target.checked;
    setResponse({ ...newResponse });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check that at least one checkbox has been checked for MRQ
    let toAlert = false;
    questions.filter((question) => question[2] === "MRQ").forEach((question) => {
      if (!response[`${ question[0] }`]) {
        toAlert = true;
      } else if (response[`${ question[0] }`].filter((checked) => checked === true).length === 0) {
        toAlert = true;
      } 
    })

    // alert if MRQ has no checkboxes checked
    if (toAlert) {
      alert("Please choose at least one option for every question.");
      return;
    }

    // Send request to server
    const requestBody = { ...response, submitted_on: Date.now() };
    // set value for mcqs to be first choice if no changed detected
    questions.filter((question) => question[2] === "MCQ").forEach((question) => {
      if (response[`${ question[0] }`] === undefined) {
        requestBody[`${ question[0] }`] = question[3]["1"];
      }
    })

    // Endpoint for responses
    const responsesURL = new URL(`/responses?role=${user.role}`, process.env.REACT_APP_BACKEND_API);

    await axios.post(responsesURL, requestBody).then((response) => {
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
  if (submitted) {
    return (
      <div className="bg-pink-100 min-h-screen">
        <Navbar />
        <FormSubmittedMessage event={event} submission={submission}/>
      </div>
    )
  } else {
    return ( 
      <> 
        <Navbar />
        { event?.groupSettings[1] === "With friends"
          ? page === 1
            ? <SignUpPart1
                response={ response }
                setResponse={ setResponse }
                event={ event }
                handleSubmit={ handleSubmit }
                action="Submit"
                setPage={ setPage }
              />
            : <SignUpPart2
              questions={ questions }
              response={ response }
              event={ event }
              handleSubmit={ handleSubmit }
              handleChange={ handleChange }
              handleCheck={ handleCheck }
              action="Submit"
              setPage={ setPage }
            />
          : <SignUpPart2
            questions={ questions }
            response={ response }
            event={ event }
            handleSubmit={ handleSubmit }
            handleChange={ handleChange }
            handleCheck={ handleCheck }
            action="Submit"
            setPage={ setPage }
          />
        } 
      </> 
    )
  } 
} 
 
export default EventSignup;
