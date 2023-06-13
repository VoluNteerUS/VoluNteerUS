import { useEffect, useState } from "react";
import Navbar from "../../components/navigation/Navbar";
import { Tab } from "@headlessui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment"; 
import { useSelector } from "react-redux";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Submissions() {
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";
  const userId = user?.id;
  const tabs = ["Accepted", "Pending", "Rejected"];

  const [responseAndEvent, setResponseAndEvent] = useState([]);
  const [events, setEvents] = useState([]);
  const [responses, setResponses] = useState([]);

  const heading = () => {
    return (
      <thead>
        <tr className="text-sm grid grid-cols-4 text-left border-b">
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start date & time</th>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End date & time</th>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
    );
  }

  const body = (obj) => {
    return (
      <tbody>
        <tr key={obj?.response?._id} className="text-sm grid grid-cols-4 border-b">
          <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{obj?.event?.title.length > 20 ? obj?.event?.title.slice(0, 20) + '...' : obj?.event?.title}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${obj?.event?.date[0]} ${obj?.event?.date[2]}`).format('Do MMMM YYYY, h:mm A')}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${obj?.event?.date[1]} ${obj?.event?.date[3]}`).format('Do MMMM YYYY, h:mm A')}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
            <Link to={`/responses/${obj?.response?._id}/edit`} className="text-primary-600 hover:text-primary-800">
              Edit
            </Link>
            <span className="px-2">|</span>
            <button type="button" onClick={ e => handleDelete(e, obj) } className="text-primary-600 hover:text-primary-800">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    );
  }

  const getEventByResponse = async (responseForEvent) => {
    try {
      const eventURL = new URL(`/events/${ responseForEvent.event }`, process.env.REACT_APP_BACKEND_API);
      const res = await axios.get(eventURL);
      const event = res.data;
      return event
    } catch (err) {
      console.error({ err });
    }
  }

  const getResponsesByUser = async () => {
    try {
      const responsesByUserURL = new URL(`/responses?user_id=${ userId }`, process.env.REACT_APP_BACKEND_API);
      const res = await axios.get(responsesByUserURL);
      const responses = res.data;
      setResponses(responses);
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getResponsesByUser();
    console.log(responses);
  }, []);

  useEffect(() => {
    const responseEvents = Promise.all(responses.map((response) => 
      getEventByResponse(response)
    )).then((eventResults) => {
      setEvents(eventResults);
    })
  }, [responses]);

  useEffect(() => {
    let currResponseAndEvent = [];
    for (let i = 0; i < responses.length; i++) {
      currResponseAndEvent = [...currResponseAndEvent, { response: responses[i], event: events[i] }];
    }
    setResponseAndEvent(currResponseAndEvent);
  }, [events, responses]);  

  const handleDelete = () => {

  }

  return (
    <>
      <Navbar />
      <div className="w-screen lg:w-3/4 block mx-auto">
        <div className="text-2xl my-10 font-bold flex space-x-3">
          <h1>My Submissions</h1>
          <PaperAirplaneIcon width={25} height={25} />
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
            {/* Tab for accepted events */}
            <Tab.Panel>
              <table className="flex flex-col space-y-1">
                { heading() }
                {events.length === 0
                  ? <tbody>
                    <tr className="text-sm flex justify-evenly font-mono">
                      <td>No accepted events</td>  
                    </tr>
                  </tbody>
                  : responseAndEvent.map((obj) => {
                    return (
                      body(obj)
                    );
                })}
              </table>
            </Tab.Panel>
            {/* Tab for pending events */}
            <Tab.Panel className="overflow-x-auto">
              <table className="flex flex-col space-y-1">
                { heading() }
                {responseAndEvent.length === 0
                  ? <tbody>
                    <tr className="text-sm flex justify-evenly font-mono">
                      <td>No pending events</td>  
                    </tr>
                  </tbody>
                  : responseAndEvent.map((obj) => {
                    return (
                      body(obj)
                    );
                  })
                }
              </table>
            </Tab.Panel>
            {/* Tab for rejected events */}
            <Tab.Panel>
              <table className="flex flex-col space-y-1">
                { heading() }
                {responseAndEvent.length === 0
                  ? <tbody>
                    <tr className="text-sm flex justify-evenly font-mono">
                      <td>No rejected events</td>  
                    </tr>
                  </tbody>
                  : responseAndEvent.map((obj) => {
                    return (
                      body(obj)
                    );
                  })}
              </table>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  )
}

export default Submissions;
