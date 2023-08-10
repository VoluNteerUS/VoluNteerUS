import { useLocation, useNavigate } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from "../../actions/eventActions";
import { setQuestions } from "../../actions/questionsActions";
import CreateEventPart1 from "../../components/form/CreateEventPart1";
import CreateEventPart2 from "../../components/form/CreateEventPart2";
import CreateEventPart3 from "../../components/form/CreateEventPart3";
import CreateEventPart4 from "../../components/form/CreateEventPart4";
import CommitteeMemberProtected from "../../common/protection/CommitteeMemberProtected";
import CreateEventPart5 from "../../components/form/CreateEventPart5";
import moment from "moment";
import { api } from "../../services/api-service";

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
      "role": user?.role,
      // group[yes/no, group type, group size]
      "groupSettings": ["No", "-", 1],
      "defaultHours": 0
    }
  )

  // get organization id from previous page
  let id = null;
  const location = useLocation();
  if (location?.state?.id) {
    id = location.state.id;
  }

  const checkUser = async () => {
    const checkCommitteeMemberRequestBody = {
      userId: user.id,
      organizationId: id
    }

    const response = await api.checkCommitteeMember(
      localStorage.getItem("token"),
      checkCommitteeMemberRequestBody
    );
    
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
    // validate grouping questions
    if (details.groupSettings[0] === "Yes") {
      if (details.groupSettings[1] === "-") {
        setError("Please select a grouping type");
        return;
      } else if (details.groupSettings[2] === 1) {
        setError("Group size cannot be 1");
        return;
      }
    }
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

      await api.createQuestions(localStorage.getItem("token"), requestBody, details.role).then(async (response) => {;
          console.log(response.data);

          if (!response.data) {
            alert('You do not have permission to create an event.');
            navigate('/');
          }
          const duration = moment(`${details?.date[1]} ${details?.date[3]}`).diff(moment(`${details?.date[0]} ${details?.date[2]}`), 'hours', 'minutes');
          const totalDays = moment(`${ details?.date[1] } ${ details?.date[3] }`).diff(moment(`${ details?.date[0] } ${ details?.date[2] }`), 'days') + 1;
          let newDefaultHours = [];
          newDefaultHours.length = totalDays;
          newDefaultHours.fill(duration);

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
          eventData.append('groupSettings', details.groupSettings);
          eventData.append('defaultHours', newDefaultHours);
          
          await api.createEvent(localStorage.getItem("token"), eventData, details.role);

          const updatedDetails = await api.getAllEvents().then((res) => res.data);
          const updatedQuestions = await api.getAllQuestions(localStorage.getItem("token")).then((res) => res.data);

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
    <CommitteeMemberProtected user={user} organization_id={id}>
      <div className="bg-pink-100 min-h-screen"> 
        { page === 1 
          ? <CreateEventPart1
          details={ details }
          setDetails={ setDetails }
          error={ error }
          setError={ setError }
          setPage={ setPage }
        />
        : page === 2 
          ? <CreateEventPart2
            details={ details }
            setDetails={ setDetails }
            error={ error }
            setError={ setError }
            setPage={ setPage }
          />
          : page === 3
            ? <CreateEventPart3
              details={ details }
              setDetails={ setDetails }
              error={ error }
              setError={ setError }
              setPage={ setPage }
            />
            : page === 4
              ? <CreateEventPart4
                formQuestions={ formQuestions }
                setFormQuestions={ setFormQuestions }
                error={ error }
                setError={ setError }
                setPage={ setPage }
              />
              : <CreateEventPart5
                details={ details }
                setDetails={ setDetails }
                error={ error }
                setError={ setError }
                setPage={ setPage }
                handleSubmit={ handleSubmit }
              />
      }
      </div> 
    </CommitteeMemberProtected>
  ) 
} 
 
export default CreateEvent;