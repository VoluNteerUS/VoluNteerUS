import Navbar from "../../components/navigation/Navbar"; 
import { useLocation, useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from "../../actions/eventActions";
import { setQuestions } from "../../actions/questionsActions";
import CreateEventPart1 from "../../components/form/CreateEventPart1";
import CreateEventPart2 from "../../components/form/CreateEventPart2";

function CreateEvent() { 
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || 'Unknown';

  const [details, setDetails] = useState(
    {
      "title": "",
      "date": ["", "", "", ""],
      "location": "",
      "organized_by": "",
      "category": [],
      "description": "",
      "image_url": "",
      "file": null,
      "signup_by": "",
      "role": user?.role
    }
  )

  // get organization id from previous page
  let id = null;
  const location = useLocation();
  if (location?.state?.id) {
    id = location.state.id;
  }

  const checkUser = async () => {
    const checkCommitteeMemberURL = new URL(`/organizations/checkCommitteeMember`, process.env.REACT_APP_BACKEND_API);
    const checkCommitteeMemberRequestBody = {
      userId: user.id,
      organizationId: id
    }

    const response = await axios.post(checkCommitteeMemberURL, checkCommitteeMemberRequestBody);
    
    if (response.data) {
      setDetails({ ...details, role: "COMMITTEE MEMBER" });
    }
  }

  useEffect(() => {
    checkUser();

    setDetails({ 
      ...details, 
      organized_by: id 
    });
  }, []);
  
  // [question number, question, question type, choices] : [int, string, string, { "1" : "first choice", ... }]
  const[formQuestions, setFormQuestions] = useState({
    "1": [1, "", "Open-ended", { "1" : "" }],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // create event
    try {
      // Update user role if is a committee member

      // event sign up form questions 
      const eventQuestions = Object.values(formQuestions).filter(question => question[1] !== "");
      const questionObject = {};
      for (const q of eventQuestions) {
        questionObject[`${ q[0] }`] = q; 
      }

      // Send request to server
      const requestBody = questionObject;

      // Endpoint for event questions
      let questionsURL = new URL(`/questions?role=${details.role}`, process.env.REACT_APP_BACKEND_API);

      await axios.post(questionsURL, requestBody).then((response) => {
          console.log(response.data);

          if (!response.data) {
            alert('You do not have permission to create an event.');
            navigate('/');
          }
          
          // event details
          const eventData = new FormData();
          eventData.append('title', details.title);
          eventData.append('date', details.date);
          eventData.append('location', details.location);
          eventData.append('organized_by', id);
          eventData.append('category', details.category);
          eventData.append('signup_by', details.signup_by);
          eventData.append('description', details.description);
          eventData.append('image_url', details.image_url);
          eventData.append('file', details.file);
          eventData.append('questions', response.data._id);

          let eventsURL = new URL(`/events?role=${details.role}`, process.env.REACT_APP_BACKEND_API);
          eventsURL = new URL(`/events?role=${"COMMITTEE MEMBER"}`, process.env.REACT_APP_BACKEND_API);
          
          axios.post(eventsURL, eventData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          // Send GET request to get updated event details and sign up form questions
          const updatedDetails = axios.get(eventsURL).then((res) => res.data);
          const updatedQuestions = axios.get(questionsURL).then((res) => res.data);

          // Update event details and sign up form questions in redux store
          dispatch(setEvents(updatedDetails));
          dispatch(setQuestions(updatedQuestions));

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
      { page === 1 
        ? <CreateEventPart1
            details={ details }
            setDetails={ setDetails }
            error={ error }
            setError={ setError }
            setPage={ setPage }
          />
        : <CreateEventPart2
            formQuestions={ formQuestions }
            setFormQuestions={ setFormQuestions }
            error={ error }
            setError={ setError }
            setPage={ setPage }
            handleSubmit={ handleSubmit }
          />
      }
    </div> 
  ) 
} 
 
export default CreateEvent;
