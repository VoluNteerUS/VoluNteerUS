import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResponses } from "../../actions/responsesActions";
import SignUpPart2 from "../../components/form/SignUpPart2";
import SignUpPart1 from "../../components/form/SignUpPart1";
import { api } from "../../services/api-service";

function EditResponse() {
  const { id } = useParams();
  const [response, setResponse] = useState({});
  const [questions, setQuestions] = useState([]);
  const [event, setEvent] = useState({});
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";

  const getResponseAndQuestionAndEvent = async () => {
    try {
      const responseRes = await api.getResponse(localStorage.getItem("token"), id);
      const responses = responseRes.data;
      setResponse(responses);

      const event_id = responses.event;
      const eventRes = await api.getEvent(event_id);
      const event = eventRes.data;
      setEvent(event);

      const question_id = event.questions;
      const questionsRes = await api.getQuestions(localStorage.getItem("token"), question_id);
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

    // Send PATCH request to update response
    await api.updateResponse(localStorage.getItem("token"), id, requestBody, user.role).then((res) => {
      console.log(res);
      if (!res.data) {
        alert('You do not have permission to edit.');
        navigate('/');
      }
    }).catch((err) => {
      console.error(err);
    });
            
    // Send GET request to get updated responses
    const updatedResponses = await api.getResponses(localStorage.getItem("token"));

    // Update responses in redux store
    dispatch(setResponses(updatedResponses));

    navigate(-1);
    alert(`Response for ${event.title} successfully updated`);
  }

  return (
    <>
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