import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/navigation/Navbar";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Disclosure, Tab } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { setResponses as updateResponses } from "../../actions/responsesActions";
import AppDialog from "../../components/AppDialog";
import Pagination from "../../components/navigation/Pagination";
import CommitteeMemberProtected from "../../common/protection/CommitteeMemberProtected";
import SignUpPart2 from "../../components/form/SignUpPart2";
import { Listbox, Transition } from "@headlessui/react";

const groupingOptions = [
  "Random",
  "With friends",
];

const groupSizeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Responses() {
  const { id, eventId } = useParams();
  const persistedUserState = useSelector((state) => state?.user);
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
  const [role, setRole] = useState(user.role);
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
  // Grouping State
  const [groupingEnabled, setGroupingEnabled] = useState(false);
  const [groupingType, setGroupingType] = useState("Random");
  const [groupSize, setGroupSize] = useState(1);
  const [groups, setGroups] = useState([]);

  // Attendance State 
  const [attendancePaginationState, setAttendancePaginationState] = useState({
    currentPage: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
    result: []
  });

  const getResponseInformation = async () => {
    try {
      const eventURL = new URL(`/events/${eventId}?role=${user?.role}`, process.env.REACT_APP_BACKEND_API);
      const eventRes = await axios.get(eventURL);
      const event = eventRes.data;
      setEvent(event);
      setGroupingEnabled(event?.groupSettings[0] === 'Yes' ? true : false);
      setGroupingType(event?.groupSettings[1]);
      setGroupSize(event?.groupSettings[2]);
      setGroups(event.groups)

      const questionsURL = new URL(`/questions/${event?.questions}?role=${user?.role}`, process.env.REACT_APP_BACKEND_API);
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

      // Check if user is a committee member
      const checkCommitteeMemberURL = new URL(`/organizations/checkCommitteeMember`, process.env.REACT_APP_BACKEND_API);
      const checkCommitteeMemberRequestBody = {
        userId: user.id,
        organizationId: id
      }

      const response = await axios.post(checkCommitteeMemberURL, checkCommitteeMemberRequestBody);
      if (response.data) {
        setRole('COMMITTEE MEMBER');
      }
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getResponseInformation();
  }, [paginationState.accepted.currentPage, paginationState.rejected.currentPage, paginationState.pending.currentPage])

  const getAttendanceInformation = async () => {
    try {
      const acceptedResponsesURL = new URL(`/responses/accepted?event_id=${eventId}&page=${attendancePaginationState.currentPage}&limit=${attendancePaginationState.limit}`, process.env.REACT_APP_BACKEND_API);
      const acceptedResponsesRes = await axios.get(acceptedResponsesURL);
      const paginatedAcceptedResponses = { ...acceptedResponsesRes.data };
      setAttendancePaginationState({
        ...attendancePaginationState,
        totalItems: paginatedAcceptedResponses.totalItems,
        totalPages: paginatedAcceptedResponses.totalPages,
        result: paginatedAcceptedResponses.result
      });
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getAttendanceInformation();
  }, [attendancePaginationState.currentPage])

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
    let requestBody;
    if (action === "Accept") {
      requestBody = { ...responseToUpdate, status: `Accepted`, attendance: "Present" };
    } else {
      requestBody = { ...responseToUpdate, status: `Rejected`, attendance: "Not applicable" };
    }
    
    // Endpoint for responses
    const responsesURL = new URL(`/responses/${ responseToUpdate?._id }?role=${role}`, process.env.REACT_APP_BACKEND_API);

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
          <div className="px-6 py-4 text-sm md:text-base text-neutral-600 font-bold col-span-2">
            <Link to={`/users/${response?.user["_id"]}`} className="hover:text-neutral-500">
              {response?.user["full_name"]}
            </Link>
          </div>
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
            <SignUpPart2
              questions={ Object.values(questions).filter((question) => question.length > 1 && question !== event.questions) }
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

  const handleGroupings = async (event) => {
    event.preventDefault();
    const groupingURL = new URL(`/events/groupings/create?role=${role}`, process.env.REACT_APP_BACKEND_API);
    const body = { 
      eventId: eventId,
      groupSize: groupSize,
      groupingType: groupingType 
    };
    await axios.post(groupingURL, body).then((res) => {
      console.log(res);
      // Call event endpoint to get updated event
      const eventURL = new URL(`/events/${eventId}?role=${role}`, process.env.REACT_APP_BACKEND_API);
      axios.get(eventURL).then((res) => {
        console.log(res);
        setEvent(res.data);
        window.location.reload();
      }).catch((err) => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  const handleAttendance = async (e, response, attendance) => {
    e.preventDefault();

    // Send request to server
    const requestBody = { ...response, attendance: `${attendance}`};

    // Endpoint for responses
    const responsesURL = new URL(`/responses/${ response?._id }?role=${role}`, process.env.REACT_APP_BACKEND_API);

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
  }

  return (
    <CommitteeMemberProtected user={user} organization_id={id}>
      <Navbar />
      <div className="w-screen lg:w-5/6 p-3 block mx-auto">
        <div>
          <h1 className="font-bold text-3xl mt-6">{ event?.title } </h1>
        </div>
        <div className="text-2xl my-10 font-bold flex space-x-3">
          <h1>Responses</h1>
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
        { groupingEnabled && (
        <div className="my-10">
          <div className="text-2xl font-bold flex space-x-3">
            <h1>Groupings</h1>
            <UserGroupIcon width={25} height={25} />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-4">
              <div className="flex flex-row">
                <label className="flex items-center me-2">
                  Grouping Type:
                </label>
                <Listbox value={groupingType} onChange={setGroupingType} className="w-40">
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 sm:text-sm">
                      <span className="block truncate">{groupingType}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {groupingOptions.map((option) => (
                          <Listbox.Option
                            key={option}
                            className={({ active }) =>
                              classNames(
                                active ? 'text-white bg-pink-400' : 'text-gray-900',
                                'cursor-default select-none relative py-2 pl-10 pr-4'
                              )
                            }
                            value={option}
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                  {option}
                                </span>
                                {selected ? (
                                  <span className={classNames(active ? 'text-white' : 'text-pink-400', 'absolute inset-y-0 left-0 flex items-center pl-3')}>
                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div className="flex flex-row">
                <label className="flex items-center me-2">
                  Grouping Size:
                </label>
                <Listbox value={groupSize} onChange={setGroupSize} className="w-24">
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-pink-400 sm:text-sm">
                      <span className="block truncate">{groupSize}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {groupSizeOptions.map((option) => (
                          <Listbox.Option
                            key={option.toString()}
                            className={({ active }) =>
                              classNames(
                                active ? 'text-white bg-pink-400' : 'text-gray-900',
                                'cursor-default select-none relative py-2 pl-10 pr-4'
                              )
                            }
                            value={option.toString()}
                          >
                            {({ selected, active }) => (
                              <>
                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                  {option.toString()}
                                </span>
                                {selected ? (
                                  <span className={classNames(active ? 'text-white' : 'text-pink-400', 'absolute inset-y-0 left-0 flex items-center pl-3')}>
                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
            <div className="flex">
              <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded-lg" onClick={(e) => handleGroupings(e) }>Generate Groupings</button>
            </div>
          </div>
          {/* Need to check if group has been made */}
          { groups.length > 0 ? (
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 bg-grey-100 rounded-lg p-6 mt-3">
              {groups.map((group) => {
                return (
                  <div className="bg-white rounded p-3">
                    <h3 className="font-bold text-neutral-700 text-lg">Group { group.number }</h3>
                    {
                      group.members.map((member) => {
                        if (member !== null) {
                          return (
                            <div className="flex flex-row bg-neutral-100 rounded p-2 my-2">
                              <img 
                                className="h-12 w-12 rounded-full me-4" 
                                src={ member?.profile_picture === "" ? `https://ui-avatars.com/api/?name=${member?.full_name}&background=0D8ABC&color=fff` : member?.profile_picture } alt="Profile Picture" />
                              <p className="flex items-center">{ member?.full_name }</p>
                            </div>
                          )
                        }
                      })
                    }
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-extralight mb-10">No groupings have been made yet.</p>
            </div>
          )}
        </div>
        )}
        <div>
          <div className="text-2xl mt-10 font-bold flex space-x-3">
            <h1>Attendance</h1>
            <ClipboardDocumentCheckIcon width={25} height={25} />
          </div>
          <p className="text-sm font-extralight mb-10">P: Present, A: Absent, L: Late</p>
          <div className="mb-10 rounded-lg bg-grey-100">
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2">
              {attendancePaginationState.result.map((response) => {
                return (
                  <div className="max-w-sm flex flex-col border py-5 justify-center text-center m-3 rounded-lg bg-white shadow-md">
                    <img className="h-14 w-14 rounded-full m-auto" src={ response?.user["profile_picture"] === "" ? `https://ui-avatars.com/api/?name=${response?.user["full_name"]}&background=0D8ABC&color=fff` : response?.user["profile_picture"] } alt="Profile Picture" />
                    <p className="my-3">{ response?.user["full_name"] }</p>
                    <div className="space-x-3 mt-2">
                      <button onClick={ (e) => handleAttendance(e, response, "Present") } className={ response?.attendance === "Present"
                        ? 'w-10 h-10 rounded-full p-2 border bg-green-500 border-green-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }>P</button>
                      <button onClick={ (e) => handleAttendance(e, response, "Absent") } className={ response?.attendance === "Absent"
                        ? 'w-10 h-10 rounded-full p-2 border bg-red-500 border-red-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }>A</button>
                      <button onClick={ (e) => handleAttendance(e, response, "Late") } className={ response?.attendance === "Late"
                        ? 'w-10 h-10 rounded-full p-2 border bg-yellow-500 border-yellow-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }>L</button>
                    </div>
                  </div>
                )
              })}
            </div>
            <Pagination
              currentPage={attendancePaginationState?.currentPage}
              limit={attendancePaginationState?.limit}
              totalItems={attendancePaginationState?.totalItems}
              totalPages={attendancePaginationState?.totalPages}
              handlePageChange={handleRejectedResponsesPageChange}
              handleNextPage={handleRejectedResponsesNextPage}
              handlePrevPage={handleRejectedResponsesPrevPage}
            />
          </div>
        </div>
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
