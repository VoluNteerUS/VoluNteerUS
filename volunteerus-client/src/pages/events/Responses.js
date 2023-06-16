import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { Disclosure, Tab } from "@headlessui/react";
import { ChevronDownIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import SignUpForm from "../../components/SignUpForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Responses() {
  const { id } = useParams();
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || 'Unknown';
  const [event, setEvent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [questionsAndResponses, setQuestionsAndResponses] = useState({});
  const tabs = ["Accepted", "Pending", "Rejected"];

  const getResponseInformation = async () => {
    try {
      const eventURL = new URL(`/events/${id}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      const eventRes = await axios.get(eventURL);
      const event = eventRes.data;
      setEvent(event);

      const questionsURL = new URL(`/questions/${event.questions}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      const questionsRes = await axios.get(questionsURL);
      const questions = questionsRes.data;
      setQuestions(questions);

      const responsesURL = new URL(`/responses?event_id=${id}&role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      const responsesRes = await axios.get(responsesURL);
      const responses = responsesRes.data;
      setResponses(responses);
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getResponseInformation();
  }, [])

  useEffect(() => {
    setQuestionsAndResponses({questions: questions, responses: responses});
  }, [responses, questions])

  const handleSubmit = () => {

  }
  
  const handleChange = (e, response) => {

  }

  const handleAccept = (e, response) => {

  }

  const handleReject = (e, response) => {

  }

  const body = (response) => {
    console.log(response.user["full_name"])
    return (
      <div key={response?._id}>
        <div className="text-sm grid grid-cols-6 border-b items-center">
          <div className="px-6 py-4 text-sm md:text-base text-neutral-600 font-bold col-span-2">{response?.user["full_name"]}</div>
          <div className="px-6 py-4 text-xs md:text-sm text-neutral-500 font-light col-span-2">~ {moment(`${response?.submitted_on}`).format('Do MMMM YYYY, h:mm A')}</div>
          <div className="px-6 py-4 text-sm md:text-base text-neutral-600 font-medium col-span-1">
            <button type="button" onClick={ e => handleAccept(e, response) } className="text-primary-600 hover:text-primary-800">
              Accept
            </button>
            <span className="px-2">|</span>
            <button type="button" onClick={ e => handleReject(e, response) } className="text-primary-600 hover:text-primary-800">
              Reject
            </button>
          </div>
          <Disclosure>
            <Disclosure.Button className="justify-self-end mr-5">
              <ChevronDownIcon width={25} height={25}/>
            </Disclosure.Button>
            <Disclosure.Panel className="col-span-6">
            <SignUpForm
              questions={ Object.values(questions).filter((question) => question.length > 1 && question != event.questions) }
              response={ response }
              event={ event }
              handleSubmit={ handleSubmit }
              handleChange={ handleChange }
              action="View"
            />
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-screen lg:w-5/6 block mx-auto">
        <div className="text-2xl my-10 font-bold flex space-x-3">
          <h1>{ event?.title } responses</h1>
          <ClipboardDocumentListIcon width={25} height={25} />
        </div>
        {/* tab heading */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 justify-center bg-grey-100 rounded-lg">
          {tabs.map((tab) => (
            <Tab
              key={ tab }
              className={({ selected }) => 
                classNames(
                  'rounded-lg py-2 font-medium text-sm focus:outline-none w-full',
                  selected ? 'bg-pink-400 text-white' : 'bg-grey-100 hover:bg-pink-100' 
                )
              }
            >
              { tab }
            </Tab>
            ))}
          </Tab.List>
          {/* list of events for each tab */}
          <Tab.Panels className="mt-5 bg-grey-100 rounded-lg py-1">
            {/* Tab for accepted responses */}
            <Tab.Panel>
              {responses.filter((response) => response?.status === "Accepted").map((response) => {
                return body(response);
              })}
            </Tab.Panel>
            {/* Tab for pending responses */}
            <Tab.Panel>
              {responses.filter((response) => response?.status === "Pending").map((response) => {
                return body(response);
              })}
            </Tab.Panel>
            {/* Tab for rejected responses */}
            <Tab.Panel>
              {responses.filter((response) => response?.status === "Rejected").map((response) => {
                return body(response);
              })}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  )
}

export default Responses;
