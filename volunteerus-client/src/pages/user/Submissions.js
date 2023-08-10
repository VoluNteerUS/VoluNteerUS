import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment"; 
import { useDispatch, useSelector } from "react-redux";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { setResponses as updateResponses } from "../../actions/responsesActions";
import AppDialog from "../../components/AppDialog";
import Pagination from "../../components/navigation/Pagination";
import { api } from "../../services/api-service";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Submissions() {
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";
  const userId = user?.id;
  const tabs = ["Accepted", "Pending", "Rejected"];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [responseAndEvent, setResponseAndEvent] = useState([]);
  const [responseToDelete, setResponseToDelete] = useState({});
  const [events, setEvents] = useState([]);
  const [responses, setResponses] = useState([]);
  const [acceptedResponses, setAcceptedResponses] = useState([]);
  const [pendingResponses, setPendingResponses] = useState([]);
  const [rejectedResponses, setRejectedResponses] = useState([]);

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

  const table = (status) => {
    return (
      <table className="min-w-full divide-y divide-neutral-200">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Event Name</th>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Start date & time</th>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">End date & time</th>
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Submitted on</th>
          { `${status}` === "Accepted" && <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Shifts</th> }
          <th className="px-6 py-3 text-left text-xs md:text-sm font-semibold text-neutral-800 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200">
        {
          responseAndEvent?.filter(obj => obj?.response?.status === `${status}`).length === 0 ? (
            <tr>
              <td className="px-6 py-4 text-sm md:text-base text-neutral-600 lowercase text-center" colSpan="6">No {status} submissions</td>
            </tr>
          ) : (responseAndEvent.filter((obj) => obj?.response?.status === `${status}`).map((obj) => (
            <tr key={obj?.event?._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium hover:text-neutral-400"><Link to={`/events/${obj?.event?._id}`}>{obj?.event?.title}</Link></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${obj?.event?.date[0]} ${obj?.event?.date[2]}`).format('Do MMMM YYYY, h:mm A')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${obj?.event?.date[1]} ${obj?.event?.date[3]}`).format('Do MMMM YYYY, h:mm A')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">{moment(`${obj?.response?.submitted_on}`).format('Do MMMM YYYY, h:mm A')}</td>
              { `${status}` === "Accepted" && <td className="px-6 py-4 space-y-1">{obj?.response?.shifts?.map((shift, index) => shift ? index : -1).filter(days => days !== -1).map((days) => ( 
                <p className="whitespace-nowrap bg-primary-600 text-white text-sm px-3 rounded-full text-center">{ moment(`${obj?.event?.date[0]}`).add(days, 'days').format('DD MMMM YYYY') }</p>
              ))}</td> }
              <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base text-neutral-600 font-medium">
                {
                  (obj?.response?.status === "Pending") ? (
                    <>
                      <button onClick={ e => navigate(`/${obj?.response?._id}/edit`)} disabled={ obj?.response?.status !== "Pending" } className="text-primary-600 hover:text-primary-800">
                        Edit
                      </button>
                      <span className="px-2">|</span>
                    </>
                  ) : null
                }
                <button type="button" onClick={ e => handleDelete(e, obj) } className="text-primary-600 hover:text-primary-800">
                  Delete
                </button>
              </td>
            </tr>
          )))
        }
      </tbody>
    </table>
    )
  }

  const getEventByResponse = async (responseForEvent) => {
    try {
      const event = await api.getEvent(responseForEvent.event).then(res => res.data);
      return event
    } catch (err) {
      console.error({ err });
    }
  }

  const getResponsesByUser = async () => {
    try {
      const responses = await api.getResponsesByUser(localStorage.getItem("token"), userId).then(res => res.data);
      setResponses(responses);

      const acceptedResponsesRes = await api.getAcceptedResponsesByUser(
        localStorage.getItem("token"), 
        userId, 
        paginationState.accepted.currentPage, 
        paginationState.accepted.limit
      );
      const paginatedAcceptedResponses = { ...acceptedResponsesRes.data };
      setAcceptedResponses(paginatedAcceptedResponses.result);

      const rejectedResponsesRes = await api.getRejectedResponsesByUser(
        localStorage.getItem("token"),
        userId,
        paginationState.rejected.currentPage,
        paginationState.rejected.limit
      );
      const paginatedRejectedResponses = { ...rejectedResponsesRes.data };
      setRejectedResponses(paginatedRejectedResponses.result);

      const pendingResponsesRes = await api.getPendingResponsesByUser(
        localStorage.getItem("token"),
        userId,
        paginationState.pending.currentPage,
        paginationState.pending.limit
      );
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
    getResponsesByUser();
  }, [paginationState.accepted.currentPage, paginationState.pending.currentPage, paginationState.rejected.currentPage]);

  useEffect(() => {
    if (responses.length > 0) {
      const responseEvents = Promise.all(responses.map((response) => 
        getEventByResponse(response)
      )).then((eventResults) => {
        setEvents(eventResults);
    })
    }
  }, [responses]);

  useEffect(() => {
    let currResponseAndEvent = [];
    for (let i = 0; i < responses.length; i++) {
      currResponseAndEvent = [...currResponseAndEvent, { response: responses[i], event: events[i] }];
    }
    setResponseAndEvent(currResponseAndEvent);
  }, [events, responses]);  

  const handleDelete = (e, obj) => {
    e.preventDefault();
    setResponseToDelete(obj);
    setIsDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setResponseToDelete({});
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Send DELETE request to delete response
    await api.deleteResponse(localStorage.getItem("token"), responseToDelete?.response?._id, user.role)
    .then((res) => {
      console.log(res);
      if (!res.data) {
        alert('You do not have permission to delete.');
        navigate('/');
      }
    }).catch((err) => {
      console.error(err);
    });

    setResponseToDelete({});
    setIsDialogOpen(false);
            
    // Send GET request to get updated responses
    const updatedResponses = api.getResponses(localStorage.getItem("token")).then((res) => res.data);

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

  return (
    <>
      <div className="w-screen lg:w-5/6 block mx-auto">
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
              <div className="overflow-x-auto">
              {table("Accepted")}
              </div>
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
            {/* Tab for pending events */}
            <Tab.Panel>
              <div className="overflow-x-auto">
                {table("Pending")}
              </div>
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
            {/* Tab for rejected events */}
            <Tab.Panel>
              <div className="overflow-x-auto">
                {table("Rejected")}
              </div>
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
          title="Confirm Delete"
          description={`Are you sure you want to delete your response for "${responseToDelete?.event?.title}"?`}
          warningMessage={`This action cannot be undone.`}
          actionName="Delete"
          handleAction={handleConfirmDelete}
          handleClose={handleCancelDelete}
        />
      )}
    </>
  )
}

export default Submissions;
