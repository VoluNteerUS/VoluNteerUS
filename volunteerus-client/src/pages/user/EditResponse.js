import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setResponses } from "../../actions/responsesActions";
import SignUpPart2 from "../../components/form/SignUpPart2";
import SignUpPart1 from "../../components/form/SignUpPart1";

function EditResponse() {
  const { id } = useParams();
  const [response, setResponse] = useState({});
  const [questions, setQuestions] = useState({});
  const [event, setEvent] = useState({});
  const [page, setPage] = useState(1);
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
      const finalQuestions = Object.values(question).filter(q => q.length > 2 && q[1] !== "" && q !== question_id);
      setQuestions(finalQuestions);
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getResponseAndQuestionAndEvent();
  }, [])

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
    const numOfOptions = Object.keys(question[3]).length;
    if (newResponse[`${ question[0] }`] === "") {
      newResponse[`${ question[0] }`] = new Array(numOfOptions).fill(false);
    }
    newResponse[`${ question[0] }`][key - 1] = e.target.checked;
    setResponse({ ...newResponse });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check that at least one checkbox has been checked for MRQ
    let toAlert = false;
    Object.values(questions).filter((question) => question[2] === "MRQ").forEach((question) => {
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
      { !event?.groupSettings ? "" : event?.groupSettings[1] === "With friends"
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

export default EditResponse;
