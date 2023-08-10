import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvents } from "../../actions/eventActions";
import { setQuestions } from "../../actions/questionsActions";
import EditEventPart1 from "../../components/form/EditEventPart1";
import EditEventPart2 from "../../components/form/EditEventPart2";
import EditEventPart3 from "../../components/form/EditEventPart3";
import EditEventPart4 from "../../components/form/EditEventPart4";
import CommitteeMemberProtected from "../../common/protection/CommitteeMemberProtected";
import EditEventPart5 from "../../components/form/EditEventPart5";
import moment from "moment";
import { api } from "../../services/api-service";

function EditEventDetails() {
  const { id, eventId } = useParams();
  const [error, setError] =useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || 'Unknown';

  const [formQuestions, setFormQuestions] = useState({});
  const [page, setPage] = useState(1);

  const [details, setDetails] = useState(
    {
      "file": null,
      "title": "",
      "date": ["", "", "", ""],
      "location": "",
      "organized_by": "",
      "category": [],
      "description": "",
      "image_url": "",
      "signup_by": "",
      "questions": null,
      "role": user?.role,
      "groupSettings": ["", "", ""],
      "defaultHours": 0
    }
  );

  useEffect(() => {
      const getEvent = async () => {
        try {
          const event = await api.getEvent(eventId).then(res => res.data);
          // check user
          const checkCommitteeMemberRequestBody = {
            userId: user.id,  
            organizationId: id
          }
          const response = await api.checkCommitteeMember(localStorage.getItem("token"), checkCommitteeMemberRequestBody);
          setDetails(
            { ...details,
              "title": event.title,
              "date": event.date,
              "location": event.location,
              "organized_by": event.organized_by,
              "category": event.category,
              "description": event.description,
              "image_url": event.image_url,
              "signup_by": event.signup_by,
              "questions": event.questions,
              "file": event.file,
              "role": `${ response.data ? 'COMMITTEE MEMBER' : 'USER' }`,
              "groupSettings": event.groupSettings,
              "defaultHours": event.defaultHours
            }
          );
        } catch (err) {
          console.error({ err });
        }
      }
      const getQuestions = async () => {
        try {
          const event = await api.getEvent(eventId).then(res => res.data);
          const questionId = event.questions;
          const questions = await api.getQuestions(localStorage.getItem("token"), questionId).then(res => res.data);
          const finalQuestions = Object.values(questions).filter(q => q.length > 2 && q !== questionId);
          let newFormQuestions = { ...formQuestions };
          finalQuestions.forEach((question) => {
            newFormQuestions[`${ question[0] }`] = question;
          });
          setFormQuestions({ ...newFormQuestions });
        } catch (err) {
          console.error({ err });
        }
      }
      getEvent();
      getQuestions();
  }, []);

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
          
    // event details
    const duration = moment(`${details?.date[1]} ${details?.date[3]}`).diff(moment(`${details?.date[0]} ${details?.date[2]}`), 'hours', 'minutes');
    const totalDays = moment(`${ details?.date[1] } ${ details?.date[3] }`).diff(moment(`${ details?.date[0] } ${ details?.date[2] }`), 'days') + 1;
    let newDefaultHours = [];
    newDefaultHours.length = totalDays;
    newDefaultHours.fill(duration);

    const eventData = new FormData();
    eventData.append('title', details.title);
    eventData.append('date', details.date);
    eventData.append('location', details.location);
    eventData.append('category', details.category);
    eventData.append('signup_by', details.signup_by);
    eventData.append('description', details.description);
    eventData.append('image_url', details.image_url);
    eventData.append('file', details.file);
    eventData.append('questions', details.questions);
    eventData.append('groupSettings', details.groupSettings);
    eventData.append('defaultHours', newDefaultHours);

    // event sign up form questions 
    const eventQuestions = Object.values(formQuestions).filter(question => question[1] !== "");
    const questionObject = {};
    for (const q of eventQuestions) {
      questionObject[`${ q[0] }`] = q; 
    }

    // Send request to server
    const requestBody = questionObject;

    // Send PATCH request to update event and sign up form questions
    await api.updateEvent(localStorage.getItem("token"), eventId, eventData, details.role)
      .then((res) => {
        console.log(res);
        if (!res.data) {
          alert('You do not have permission to edit.');
          navigate('/');
        }
      })
      .catch((err) => console.error(err));

    await api.updateQuestion(localStorage.getItem("token"), details.questions, requestBody, details.role)
      .then(res => res.data)
      .catch(err => console.error(err));

    const updatedDetails = await api.getAllEvents().then(res => res.data);
    const updatedQuestions = await api.getAllQuestions(localStorage.getItem("token")).then(res => res.data);

    // Update event details and sign up form questions in redux store
    dispatch(setEvents(updatedDetails));
    dispatch(setQuestions(updatedQuestions));

    navigate('/');
  }

  return ( 
    <CommitteeMemberProtected user={user} organization_id={id}>
      <div className="bg-pink-100 min-h-screen">
        { page === 1 
            ? <EditEventPart1
            details={ details }
            setDetails={ setDetails }
            error={ error }
            setError={ setError }
            setPage={ setPage }
          />
          : page === 2 
            ? <EditEventPart2
              details={ details }
              setDetails={ setDetails }
              error={ error }
              setError={ setError }
              setPage={ setPage }
            />
            : page === 3
              ? <EditEventPart3
                details={ details }
                setDetails={ setDetails }
                error={ error }
                setError={ setError }
                setPage={ setPage }
              />
              : page === 4
                ? <EditEventPart4
                  formQuestions={ formQuestions }
                  setFormQuestions={ setFormQuestions }
                  error={ error }
                  setError={ setError }
                  setPage={ setPage } 
                />
                : <EditEventPart5
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

export default EditEventDetails;