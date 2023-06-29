import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Disclosure, Tab } from "@headlessui/react";
import { ChevronDownIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import SignUpForm from "../../components/form/SignUpForm";
import { setResponses as updateResponses } from "../../actions/responsesActions";
import AppDialog from "../../components/AppDialog";
import Pagination from "../../components/navigation/Pagination";
import CommitteeMemberProtected from "../../common/protection/CommitteeMemberProtected";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Responses() {
  const { id, eventId } = useParams();
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || 'Unknown';
  const [event, setEvent] = useState({});
  const [questions, setQuestions] = useState([]);
  const [acceptedResponses, setAcceptedResponses] = useState([]);
  const [pendingResponses, setPendingResponses] = useState([]);
  const [rejectedResponses, setRejectedResponses] = useState([]);
  const [action, setAction] = useState("");
  const tabs = ["Accepted", "Pending", "Rejected"];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [responseToUpdate, setResponseToUpdate] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paginationState, setPaginationState] = useState({
    accepted: {
      currentPage: 1,
      limit: 5,
      totalItems: 0,
      totalPages: 0,
    },
    pending: {
      currentPage: 1,
      limit: 5,
      totalItems: 0,
      totalPages: 0,
    },
    rejected: {
      currentPage: 1,
      limit: 5,
      totalItems: 0,
      totalPages: 0,
    }
  });

  const getResponseInformation = async () => {
    try {
      const eventURL = new URL(`/events/${eventId}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      const eventRes = await axios.get(eventURL);
      const event = eventRes.data;
      setEvent(event);

      const questionsURL = new URL(`/questions/${event.questions}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      const questionsRes = await axios.get(questionsURL);
      const questions = questionsRes.data;
      setQuestions(questions);

      const acceptedResponsesURL = new URL(`/responses/accepted?event_id=${eventId}&page=${paginationState.accepted.currentPage}&limit=${paginationState.accepted.limit}`, process.env.REACT_APP_BACKEND_API);
      const acceptedResponsesRes = await axios.get(acceptedResponsesURL);
      const paginatedAcceptedResponses = { ...acceptedResponsesRes.data };
      setAcceptedResponses(paginatedAcceptedResponses.result);

      const rejectedResponsesURL = new URL(`/responses/rejected?event_id=${eventId}&page=${paginationState.rejected.currentPage}&limit=${paginationState.rejected.limit}`, process.env.REACT_APP_BACKEND_API);
      const rejectedResponsesRes = await axios.get(rejectedResponsesURL);
      const paginatedRejectedResponses = { ...rejectedResponsesRes.data };
      setRejectedResponses(paginatedRejectedResponses.result);

      const pendingResponsesURL = new URL(`/responses/pending?event_id=${eventId}&page=${paginationState.pending.currentPage}&limit=${paginationState.pending.limit}`, process.env.REACT_APP_BACKEND_API);
      const pendingResponsesRes = await axios.get(pendingResponsesURL);
      const paginatedPendingResponses = { ...pendingResponsesRes.data };
      setPendingResponses(paginatedPendingResponses.result);
      setPaginationState({
        accepted: {
          ...paginationState.accepted,
          totalItems: paginatedAcceptedResponses.totalItems,
          totalPages: paginatedAcceptedResponses.totalPages,
        },
        rejected: {
          ...paginationState.rejected,
          totalItems: paginatedRejectedResponses.totalItems,
          totalPages: paginatedRejectedResponses.totalPages,
        },
        pending: {
          ...paginationState.pending,
          totalItems: paginatedPendingResponses.totalItems,
          totalPages: paginatedPendingResponses.totalPages,
        }
      })
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getResponseInformation();
  }, [])

  const handleSubmit = () => {

  }
  
  const handleChange = (e, response) => {

  }

  const handleCheck = (e, key, question) => {

  }

  const handleAction = (e, response, action) => {
    e.preventDefault();
    setResponseToUpdate(response);
    setAction(action);
    setIsDialogOpen(true);
  };

  const handleCancelUpdate = () => {
    setResponseToUpdate({});
    setAction("");
    setIsDialogOpen(false);
  };

  const handleConfirmUpdate = async () => {
    // Send request to server
    const requestBody = { ...responseToUpdate, status: `${ action }ed` };

    // Endpoint for responses
    const responsesURL = new URL(`/responses/${ responseToUpdate?._id }?role=${user.role}`, process.env.REACT_APP_BACKEND_API);

    // Send PATCH request to update response
    await axios.patch(responsesURL, requestBody).then((res) => {
      console.log(res);
      if (!res.data) {
        alert(`You do not have permission to ${ action }.`);
        navigate('/');
      }
    }).catch((err) => {
      console.error(err);
    });

    setResponseToUpdate({});
    setIsDialogOpen(false);
            
    // Send GET request to get updated responses
    const allResponsesURL = new URL(`/responses`, process.env.REACT_APP_BACKEND_API);
    const updatedResponses = axios.get(allResponsesURL).then((res) => res.data);

    // Update responses in redux store
    dispatch(updateResponses(updatedResponses));

    window.location.reload();
  }

  const handleAcceptedResponsesPageChange = (page) => {
    setPaginationState({
      ...paginationState,
      accepted: {
        ...paginationState.accepted,
        currentPage: page
      }
    });
  }

  const handleAcceptedResponsesNextPage = () => {
    setPaginationState({ 
      ...paginationState, 
      accepted: {
        ...paginationState.accepted,
        currentPage: paginationState.accepted.currentPage + 1
      }
    });
  }

  const handleAcceptedResponsesPrevPage = () => {
    setPaginationState({ 
      ...paginationState, 
      accepted: {
        ...paginationState.accepted,
        currentPage: paginationState.accepted.currentPage - 1
      }
    });
  }

  const handlePendingResponsesPageChange = (page) => {
    setPaginationState({
      ...paginationState,
      pending: {
        ...paginationState.pending,
        currentPage: page
      }
    });
  }

  const handlePendingResponsesNextPage = () => {
    setPaginationState({ 
      ...paginationState, 
      pending: {
        ...paginationState.pending,
        currentPage: paginationState.pending.currentPage + 1
      }
    });
  }

  const handlePendingResponsesPrevPage = () => {
    setPaginationState({ 
      ...paginationState, 
      pending: {
        ...paginationState.pending,
        currentPage: paginationState.pending.currentPage - 1
      }
    });
  }

  const handleRejectedResponsesPageChange = (page) => {
    setPaginationState({
      ...paginationState,
      rejected: {
        ...paginationState.rejected,
        currentPage: page
      }
    });
  }

  const handleRejectedResponsesNextPage = () => {
    setPaginationState({ 
      ...paginationState, 
      rejected: {
        ...paginationState.rejected,
        currentPage: paginationState.rejected.currentPage + 1
      }
    });
  }

  const handleRejectedResponsesPrevPage = () => {
    setPaginationState({ 
      ...paginationState, 
      accepted: {
        ...paginationState.rejected,
        currentPage: paginationState.rejected.currentPage - 1
      }
    });
  }

  const body = (response) => {
    return (
      <div key={response?._id}>
        <div className="text-sm grid grid-cols-6 border-b items-center">
          <div className="px-6 py-4 text-sm md:text-base text-neutral-600 font-bold col-span-2">{response?.user["full_name"]}</div>
          <div className="px-6 py-4 text-xs md:text-sm text-neutral-500 font-light col-span-2">~ {moment(`${response?.submitted_on}`).format('Do MMMM YYYY, h:mm A')}</div>
          <div className="px-6 py-4 text-sm md:text-base text-neutral-600 font-medium col-span-1">
            <button type="button" onClick={ e => handleAction(e, response, "Accept") } className="text-primary-600 hover:text-primary-800">
              Accept
            </button>
            <span className="px-2">|</span>
            <button type="button" onClick={ e => handleAction(e, response, "Reject") } className="text-primary-600 hover:text-primary-800">
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
              handleCheck={ handleCheck }
              action="View"
            />
            </Disclosure.Panel>
          </Disclosure>
        </div>
      </div>
    );
  }

  return (
    <CommitteeMemberProtected user={user} organization_id={id}>
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
              {acceptedResponses.filter((response) => response?.status === "Accepted").map((response) => {
                return body(response);
              })}
              {/* Pagination */}
              <Pagination
                currentPage={paginationState?.accepted?.currentPage}
                limit={paginationState?.accepted?.limit}
                totalItems={paginationState?.accepted?.totalItems}
                totalPages={paginationState?.accepted?.totalPages}
                handlePageChange={handleAcceptedResponsesPageChange}
                handleNextPage={handleAcceptedResponsesNextPage}
                handlePrevPage={handleAcceptedResponsesPrevPage}
              />
            </Tab.Panel>
            {/* Tab for pending responses */}
            <Tab.Panel>
              {pendingResponses.filter((response) => response?.status === "Pending").map((response) => {
                return body(response);
              })}
              <Pagination
                currentPage={paginationState?.pending?.currentPage}
                limit={paginationState?.pending?.limit}
                totalItems={paginationState?.pending?.totalItems}
                totalPages={paginationState?.pending?.totalPages}
                handlePageChange={handlePendingResponsesPageChange}
                handleNextPage={handlePendingResponsesNextPage}
                handlePrevPage={handlePendingResponsesPrevPage}
              />
            </Tab.Panel>
            {/* Tab for rejected responses */}
            <Tab.Panel>
              {rejectedResponses.filter((response) => response?.status === "Rejected").map((response) => {
                return body(response);
              })}
              <Pagination
                currentPage={paginationState?.rejected?.currentPage}
                limit={paginationState?.rejected?.limit}
                totalItems={paginationState?.rejected?.totalItems}
                totalPages={paginationState?.rejected?.totalPages}
                handlePageChange={handleRejectedResponsesPageChange}
                handleNextPage={handleRejectedResponsesNextPage}
                handlePrevPage={handleRejectedResponsesPrevPage}
              />  
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      {isDialogOpen && (
        <AppDialog
          isOpen={isDialogOpen}
          title={`Confirm ${ action }`}
          description={`Are you sure you want to ${ action.toLowerCase() } this response?`}
          warningMessage=""
          actionName={`${action}`}
          handleAction={handleConfirmUpdate}
          handleClose={handleCancelUpdate}
        />
      )}
    </CommitteeMemberProtected>
  )
}

export default Responses;
