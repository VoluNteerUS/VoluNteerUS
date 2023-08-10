import { useParams, useNavigate, Link } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Disclosure, Tab } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon, UserGroupIcon, PencilSquareIcon, XMarkIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { setResponses as updateResponses } from "../../actions/responsesActions";
import AppDialog from "../../components/AppDialog";
import Pagination from "../../components/navigation/Pagination";
import CommitteeMemberProtected from "../../common/protection/CommitteeMemberProtected";
import SignUpPart2 from "../../components/form/SignUpPart2";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import Alert from "../../components/Alert";
import SelectInput from "../../components/SelectInput";
import { exportExcel } from "../../helpers/excelExport";
import { api } from "../../services/api-service";

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
  // dialog for update of default hours
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessages, setAlertMessages] = useState([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [error, setError] = useState('');
  // dialog for update of custom hours
  const [customHoursDialogOpen, setCustomHoursDialogOpen] = useState(false);
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);

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

  // Shifts State
  const [shiftEnabled, setShiftEnabled] = useState(false);
  const [shiftDate, setShiftDate] = useState(moment().format('YYYY-MM-DD'));
  // number of days between shift date and event start date
  const [shiftNumberOfDays, setShiftNumberOfDays] = useState(-1);
  const [isValidShiftDate, setIsValidShiftDate] = useState(false);
  const [shiftPaginationState, setShiftPaginationState] = useState({
    currentPage: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
    result: []
  });

  // Attendance State 
  const [attendanceDate, setAttendanceDate] = useState(moment().format('YYYY-MM-DD'));
  // number of days between attendance date and event start date
  const [attendanceNumberOfDays, setAttendanceNumberOfDays] = useState(-1);
  const [isValidAttendanceDate, setIsValidAttendanceDate] = useState(false);
  const [attendancePaginationState, setAttendancePaginationState] = useState({
    currentPage: 1,
    limit: 12,
    totalItems: 0,
    totalPages: 0,
    result: []
  });

  const getResponseInformation = async () => {
    try {
      const acceptedResponsesRes = await api.getAcceptedResponsesByEvent(localStorage.getItem("token"), eventId, paginationState.accepted.currentPage, paginationState.accepted.limit);
      const paginatedAcceptedResponses = { ...acceptedResponsesRes.data };
      setAcceptedResponses(paginatedAcceptedResponses.result);

      const rejectedResponsesRes = await api.getRejectedResponsesByEvent(localStorage.getItem("token"), eventId, paginationState.rejected.currentPage, paginationState.rejected.limit);
      const paginatedRejectedResponses = { ...rejectedResponsesRes.data };
      setRejectedResponses(paginatedRejectedResponses.result);

      const pendingResponsesRes = await api.getPendingResponsesByEvent(localStorage.getItem("token"), eventId, paginationState.pending.currentPage, paginationState.pending.limit);
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
  }, [paginationState.accepted.currentPage, paginationState.rejected.currentPage, paginationState.pending.currentPage])

  const getShiftInformation = async () => {
    try {
      const acceptedResponsesRes = await api.getAcceptedResponsesByEvent(localStorage.getItem("token"), eventId, shiftPaginationState.currentPage, shiftPaginationState.limit);
      const paginatedAcceptedResponses = { ...acceptedResponsesRes.data };
      setShiftPaginationState({
        ...shiftPaginationState,
        totalItems: paginatedAcceptedResponses.totalItems,
        totalPages: paginatedAcceptedResponses.totalPages,
        result: paginatedAcceptedResponses.result
      });
    } catch (err) {
      console.error({ err });
    }
  }

  useEffect(() => {
    getShiftInformation();
  }, [shiftPaginationState.currentPage, shiftPaginationState.result, acceptedResponses])

  const getAttendanceInformation = async () => {
    try {
      const acceptedResponsesRes = await api.getAttendanceForEvent(localStorage.getItem("token"), eventId, attendanceNumberOfDays, attendancePaginationState.currentPage, attendancePaginationState.limit);
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
  }, [attendancePaginationState.currentPage, attendanceNumberOfDays, acceptedResponses])

  const getEventDetails = async () => {
    const event = await api.getEvent(eventId).then(res => res.data);
    setEvent(event);
    setGroupingEnabled(event?.groupSettings[0] === 'Yes' ? true : false);
    setGroupingType(event?.groupSettings[1]);
    setGroupSize(event?.groupSettings[2]);
    setGroups(event.groups);
    // Event takes place over multiple days
    if (event.date[0] !== event.date[1]) {
      setShiftEnabled(true);
      const diff = moment(`${ moment().format('YYYY-MM-DD') }`).diff(moment(`${ event.date[0] } `), 'days');
      setShiftNumberOfDays(diff);
      setAttendanceNumberOfDays(diff);
      // Current date is the start or end date of the event
      if (moment() === moment(`${ event?.date[1] }`) || moment() === moment(`${ event?.date[0] }`)) {
        setIsValidShiftDate(true);
        setIsValidAttendanceDate(true);
        const h = Math.floor(event?.defaultHours[diff] / 1);
        const m = Math.round(event?.defaultHours[diff] % 1 * 60);
        setHours(h);
        setMinutes(m);
      // Current date is between the start and end date of the event
      } else if (moment(`${ event?.date[1] }`).isAfter(moment()) && moment(`${ event?.date[0] }`).isBefore(moment())) {
        setIsValidShiftDate(true);
        setIsValidAttendanceDate(true);  
        const h = Math.floor(event?.defaultHours[diff] / 1);
        const m = Math.round(event?.defaultHours[diff] % 1 * 60);
        setHours(h);
        setMinutes(m);
      // Current date is before or after the event period
      } else {
        setIsValidShiftDate(false);
        setIsValidAttendanceDate(false);
        setHours(0);
        setMinutes(0);
      }
    // Event takes place on only one day
    } else {
      setIsValidAttendanceDate(true);
      setAttendanceNumberOfDays(0);
      const h = Math.floor(event?.defaultHours[0] / 1);
      const m = Math.round(event?.defaultHours[0] % 1 * 60);
      setHours(h);
      setMinutes(m);
    }

    const questions = await api.getQuestions(localStorage.getItem("token"), event?.questions).then(res => res.data);
    setQuestions(questions);

    // Check if user is a committee member
    const checkCommitteeMemberRequestBody = {
      userId: user.id,
      organizationId: id
    }

    const response = await api.checkCommitteeMember(localStorage.getItem("token"), checkCommitteeMemberRequestBody);
    if (response.data) {
      setRole('COMMITTEE MEMBER');
    }
  }

  useEffect(() => {
    getEventDetails();
  }, []);

  const handleSubmit = () => {

  }
  
  const handleChange = (e, response) => {

  }

  const handleCheck = (e, key, question) => {

  }

  const handleDialogOpen = () => {
      setDialogOpen(true);
  }

  const handleDialogClose = () => {
      setDialogOpen(false);
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
    let newShifts = [];
    const totalDays = moment(`${ event.date[1] } ${ event.date[3] }`).diff(moment(`${ event.date[0] } ${ event.date[2] }`), 'days') + 1;
    newShifts.length = totalDays;
    let newAttendance = [];
    newAttendance.length = totalDays;
    if (totalDays === 1) {
      newShifts.fill(true);
      newAttendance.fill("Present");
    } else {
      newShifts.fill(false);
      newAttendance.fill("Not applicable");
    }
    let newHours = [];
    newHours.length = totalDays;
    if (action === "Accept") {
      // use default event hours if hours for response is -1
      requestBody = { ...responseToUpdate, status: `Accepted`, attendance: newAttendance, hours: newHours.fill(-1), shifts: newShifts };
    } else {
      requestBody = { ...responseToUpdate, status: `Rejected`, attendance: newAttendance, hours: newHours.fill(0), shifts: newShifts };
    }

    await api.updateResponse(localStorage.getItem("token"), responseToUpdate?._id, requestBody, role).then(res => {
      console.log(res);
      if (!res.data) {
        alert(`You do not have permission to ${ action }.`);
        navigate('/');
      }
    }).catch(err => console.error(err));

    setResponseToUpdate({});
    setIsDialogOpen(false);

    const updatedResponses = await api.getResponses(localStorage.getItem("token")).then(res => res.data);

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
      rejected: {
        ...paginationState.rejected,
        currentPage: paginationState.rejected.currentPage - 1
      }
    });
  }

  const handleShiftPageChange = (page) => {
    setShiftPaginationState({ 
      ...shiftPaginationState, 
      currentPage: page
    });
  }

  const handleShiftPrevPage = () => {
    setShiftPaginationState({ 
      ...shiftPaginationState, 
      currentPage: shiftPaginationState.currentPage - 1
    });
  }

  const handleShiftNextPage = () => {
    setShiftPaginationState({ 
      ...shiftPaginationState, 
      currentPage: shiftPaginationState.currentPage + 1
    });
  }

  const handleAttendancePageChange = (page) => {
    setAttendancePaginationState({ 
      ...attendancePaginationState, 
      currentPage: page
    });
  }

  const handleAttendancePrevPage = () => {
    setAttendancePaginationState({ 
      ...attendancePaginationState, 
      currentPage: attendancePaginationState.currentPage - 1
    });
  }

  const handleAttendanceNextPage = () => {
    setAttendancePaginationState({ 
      ...attendancePaginationState, 
      currentPage: attendancePaginationState.currentPage + 1
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
    // const groupingURL = new URL(`/events/groupings/create?role=${role}`, process.env.REACT_APP_BACKEND_API);
    const body = { 
      eventId: eventId,
      groupSize: groupSize,
      groupingType: groupingType 
    };
    await api.createEventGrouping(localStorage.getItem('token'), body, role).then((res) => {
      console.log(res);
      // Call event endpoint to get updated event
      api.getEvent(eventId)
        .then((res) => {
          setEvent(res.data);
          window.location.reload();
        })
        .catch((err) => console.error(err));
    }).catch((err) => {
      console.error(err);
    });
  }

  const handleLate = (e, response) => {
    e.preventDefault();

    setCustomHoursDialogOpen(true);
    setResponseToUpdate(response);
  }

  const handleSaveCustomHours = (e) => {
    e.preventDefault();
    setError('');

    if (customHours < 0 || customMinutes < 0) {
      setError("Hours and minutes cannot be negative");
      return;
    } else if (customMinutes > 60) {
      setError("The maximum minutes you can set is 60");
      return;
    }

    if (customHours === "") {
      setCustomHours(0);
    }
    if (customMinutes === "") {
      setCustomMinutes(0);
    }

    handleAttendance(e, responseToUpdate, "Late");
    setResponseToUpdate({});
    setCustomHoursDialogOpen(false);
  }

  const handleAttendance = async (e, response, attendance) => {
    e.preventDefault();

    // Send request to server
    const hours = customHours + (customMinutes / 60);
    const newAttendance = [ ...response?.attendance ];
    newAttendance[attendanceNumberOfDays] = `${ attendance }`
    const newHours = [ ...response?.hours ];
    newHours[attendanceNumberOfDays] = attendance === "Present" ? -1 : attendance === "Absent" ? 0 : hours;
    const requestBody = { ...response, attendance: newAttendance, hours: newHours };

    // Endpoint for responses
    // const responsesURL = new URL(`/responses/${ response?._id }?role=${role}`, process.env.REACT_APP_BACKEND_API);

    // Send PATCH request to update response
    await api.updateResponse(localStorage.getItem("token"), response?._id, requestBody, role).then((res) => {
      if (!res.data) {
        alert(`You do not have permission to ${ action }.`);
        navigate('/');
      }
    }).catch((err) => console.error(err));

    setResponseToUpdate({});
    setIsDialogOpen(false);
            
    // Send GET request to get updated responses
    const updatedResponses = api.getResponses(localStorage.getItem("token")).then((res) => res.data);

    // Update responses in redux store
    dispatch(updateResponses(updatedResponses));
  }

  const handleSaveDefaultHours = (e) => {
    e.preventDefault();
    setError('');

    if (hours < 0 || minutes < 0) {
      setError("Hours and minutes cannot be negative");
      return;
    } else if (minutes > 60) {
      setError("The maximum minutes you can set is 60");
      return;
    }

    if (hours === "") {
      setHours(0);
    }
    if (minutes === "") {
      setMinutes(0);
    }

    const newHours = hours + (minutes === 0 ? 0 : minutes / 60);
    let newDefaultHours = event.defaultHours;
    newDefaultHours[attendanceNumberOfDays] = newHours
    api.updateEvent(localStorage.getItem('token'), event?._id, { defaultHours: newDefaultHours }, role).then((response) => {
      setAlertMessages([
        {
          type: "success",
          message: "Event default hours updated successfully!"
        }
      ]);
    }).catch((error) => {
      console.log(error)
      setAlertMessages([
        {
          type: "error",
          message: "Event default hours update failed!"
        }
      ]);
    });
    handleDialogClose();
  }

  const handleMinutesChange = (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(e.target.value)) {
      setMinutes(parseInt(e.target.value));
    } else {
      setMinutes("");
    }
  }

  const handleHoursChange = (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(e.target.value)) {
      setHours(parseInt(e.target.value));
    } else {
      setHours("");
    }
  }

  const handleCustomeMinutesChange = (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(e.target.value)) {
      setCustomMinutes(parseInt(e.target.value));
    } else {
      setCustomMinutes("");
    }
  }

  const handleCustomHoursChange = (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(e.target.value)) {
      setCustomHours(parseInt(e.target.value));
    } else {
      setCustomHours("");
    }
  }

  const handleShiftDateChange = (date) => {
    setShiftDate(date);
    const diff = moment(`${ date }`).diff(moment(`${ event?.date[0] }`), 'days');
    setShiftNumberOfDays(diff);
    if (date === event?.date[1] || date === event?.date[0]) {
      setIsValidShiftDate(true);
    } else {
      setIsValidShiftDate(moment(`${ event?.date[1] }`).isAfter(moment(`${ date }`)) && moment(`${ event?.date[0] }`).isBefore(moment(`${ date }`)));
    }
  }

  const handleAttendanceDateChange = (date) => {
    setAttendanceDate(date);
    const diff = moment(`${ date }`).diff(moment(`${ event?.date[0] }`), 'days');
    setAttendanceNumberOfDays(diff);
    if (date === event?.date[1] || date === event?.date[0] || moment(`${ event?.date[1] }`).isAfter(moment(`${ date }`)) && moment(`${ event?.date[0] }`).isBefore(moment(`${ date }`))) {
      setIsValidAttendanceDate(true);
      const h = Math.floor(event?.defaultHours[diff] / 1);
      const m = Math.round(event?.defaultHours[diff] % 1 * 60);
      setHours(h);
      setMinutes(m);
    } else {
      setIsValidAttendanceDate(false) ;  
      setHours(0);
      setMinutes(0);
    }
  }

  const handleSelect = async (e, response) => {
    e.preventDefault();
    const newShifts = [ ...response?.shifts ];
    newShifts[shiftNumberOfDays] = !response?.shifts[shiftNumberOfDays];
    let newAttendance = [ ...response?.attendance ];
    if (!response?.shifts[shiftNumberOfDays]) {
      newAttendance[shiftNumberOfDays] = "Present";
    } else {
      newAttendance[shiftNumberOfDays] = "Not applicable";
    }
    // Send request to server
    const requestBody = { ...response, shifts: newShifts, attendance: newAttendance };

    // Endpoint for responses
    // const responsesURL = new URL(`/responses/${ response?._id }?role=${role}`, process.env.REACT_APP_BACKEND_API);

    // Send PATCH request to update response
    await api.updateResponse(localStorage.getItem("token"), response?._id, requestBody, role).then((res) => {
      if (!res.data) {
        alert(`You do not have permission to ${ action }.`);
        navigate('/');
      }
    }).catch((err) => console.error(err));
            
    // Send GET request to get updated responses
    const updatedResponses = api.getResponses(localStorage.getItem("token")).then((res) => res.data);

    // Update responses in redux store
    dispatch(updateResponses(updatedResponses));
  }

  const handleSelectAll = async (e) => {
    e.preventDefault();

    const requestBody = {};
    requestBody[`shifts.${shiftNumberOfDays}`] = true;
    requestBody[`attendance.${shiftNumberOfDays}`] = "Present";

    // Endpoint for responses
    // const responsesURL = new URL(`/responses?role=${role}`, process.env.REACT_APP_BACKEND_API);

    // Send PATCH request to update response
    await api.updateResponses(localStorage.getItem("token"), requestBody, role).then((res) => {
      console.log(res);
      if (!res.data) {
        alert(`You do not have permission to ${ action }.`);
        navigate('/');
      }
    }).catch((err) => console.error(err));

    const updatedResponses = api.getResponses(localStorage.getItem("token")).then((res) => res.data);

    // Update responses in redux store
    dispatch(updateResponses(updatedResponses));
  }

  const handleExportToExcel = (e) => {
    e.preventDefault();
    console.log(groups)
    exportExcel(groups, event?.title);
  }

  return (
    <CommitteeMemberProtected user={user} organization_id={id}>
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
        {/* Groupings */}
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
                <SelectInput selectedValue={groupingType} setSelectedValue={setGroupingType} options={groupingOptions} width={"w-40"} />
              </div>
              <div className="flex flex-row">
                <label className="flex items-center me-2">
                  Grouping Size:
                </label>
                <SelectInput selectedValue={groupSize} setSelectedValue={setGroupSize} options={groupSizeOptions} width={"w-24"} />
              </div>
            </div>
            <div className="flex">
              <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded-lg" onClick={(e) => handleGroupings(e) }>Generate Groupings</button>
            </div>
          </div>
          {/* Need to check if group has been made */}
          { groups.length > 0 ? (
            <>
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
              {/* Export to Excel */}
              <div className="flex justify-end mt-3">
                <button className="bg-secondary-600 hover:bg-secondary-500 text-white font-bold py-2 px-4 rounded-lg" onClick={handleExportToExcel}>Export to Excel</button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm font-extralight mb-10">No groupings have been made yet.</p>
            </div>
          )}
        </div>
        )}
        {/* Shifts */}
        { shiftEnabled && (
        <div className="my-10">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <div className="text-2xl font-bold flex space-x-3">
                <h1>Shifts</h1>
                <CalendarDaysIcon width={25} height={25} />
              </div>
              <div className="flex flex-row">
                <label className="flex items-center me-2">
                  Date:
                </label>
                <input 
                  value={ shiftDate }
                  onChange={ (e) => handleShiftDateChange(e.target.value) }
                  type= "date"
                  className="p-1 border border-grey-600 rounded-md mb-2"
                />
              </div>
            </div>
            <div className="flex">
              <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded-lg" onClick={ handleSelectAll }>Select all</button>
            </div>
          </div>

          <div className="pb-3 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 rounded-lg bg-grey-100">
            { !isValidShiftDate
              ? <div className="text-center md:col-span-4 sm:col-span-3 col-span-2">
                  <p className="text-sm font-extralight my-2">No shifts available before or after event period.</p>
                </div>
              : shiftPaginationState.result.map((response) => {
              return (
                <div className="max-w-sm flex flex-col border py-5 justify-center text-center m-3 rounded-lg bg-white shadow-md">
                    <img className="h-14 w-14 rounded-full m-auto" src={ response?.user["profile_picture"] === "" ? `https://ui-avatars.com/api/?name=${response?.user["full_name"]}&background=0D8ABC&color=fff` : response?.user["profile_picture"] } alt="Profile Picture" />
                    <p className="my-3">{ response?.user["full_name"] }</p>
                    <div className="space-x-3 mt-2">
                      <button onClick={ (e) => handleSelect(e, response) } className={ response?.shifts[shiftNumberOfDays]
                        ? 'w-10 h-10 rounded-full p-2 border bg-green-500 border-green-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }><CheckIcon /></button>
                    </div>
                </div>
            )})}
            { isValidShiftDate && <div className="md:col-span-4 sm:col-span-3 col-span-2">
              <Pagination
                currentPage={shiftPaginationState?.currentPage}
                limit={shiftPaginationState?.limit}
                totalItems={shiftPaginationState?.totalItems}
                totalPages={shiftPaginationState?.totalPages}
                handlePageChange={handleShiftPageChange}
                handleNextPage={handleShiftNextPage}
                handlePrevPage={handleShiftPrevPage}
              />
            </div>
            }    
          </div>
        </div>
        )}
        {/* Attendance */}
        <div className="flex flex-row justify-between mt-20 mb-3 items-center">
          <div className="flex flex-col">
            <div className="text-2xl font-bold flex space-x-3">
              <h1>Attendance</h1>
              <ClipboardDocumentCheckIcon width={25} height={25} />
            </div>
            { shiftEnabled && <div className="flex flex-row">
              <label className="flex items-center me-2">
                Date:
              </label>
              <input 
                value={ attendanceDate }
                onChange={ (e) => handleAttendanceDateChange(e.target.value) }
                type= "date"
                className="p-1 border border-grey-600 rounded-md mb-2"
              />
            </div> }
          </div>
          <div className="bg-grey-100 rounded-lg p-2 shadow">
            <div>
              <p className="text-xs md:text-sm tracking-wider text-left">Default hours:</p>
              <div className="flex items-center space-x-2">
                <p className="text-base md:text-lg font-semibold text-pink-400 tracking-wider">{ hours }h { minutes }m</p>
                <button type="button" onClick={ handleDialogOpen }>
                  <PencilSquareIcon width={20} height={20}/>
                </button>
              </div>
            </div>
          </div>
        </div>
          {/* Alert */}
          {
            alertMessages.length > 0 && alertMessages.map((alertMessage, index) => (
              <Alert key={index} type={alertMessage.type} message={alertMessage.message} />
            ))
          }
          <div className="pb-3 grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 rounded-lg bg-grey-100">
          { !isValidAttendanceDate
              ? <div className="text-center md:col-span-4 sm:col-span-3 col-span-2">
                  <p className="text-sm font-extralight my-2">No attendance available before or after event period.</p>
                </div>
              : attendancePaginationState?.result.filter((response) => response?.shifts[attendanceNumberOfDays]).map((response) => {
                return (
                  <div className="max-w-sm flex flex-col border py-5 justify-center text-center m-3 rounded-lg bg-white shadow-md">
                    <img className="h-14 w-14 rounded-full m-auto" src={ response?.user["profile_picture"] === "" ? `https://ui-avatars.com/api/?name=${response?.user["full_name"]}&background=0D8ABC&color=fff` : response?.user["profile_picture"] } alt="Profile Picture" />
                    <p className="my-3">{ response?.user["full_name"] }</p>
                    <div className="space-x-3 mt-2">
                      <button onClick={ (e) => handleAttendance(e, response, "Present") } className={ response?.attendance[attendanceNumberOfDays] === "Present"
                        ? 'w-10 h-10 rounded-full p-2 border bg-green-500 border-green-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }>P</button>
                      <button onClick={ (e) => handleAttendance(e, response, "Absent") } className={ response?.attendance[attendanceNumberOfDays] === "Absent"
                        ? 'w-10 h-10 rounded-full p-2 border bg-red-500 border-red-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }>A</button>
                      <button onClick={ (e) => handleLate(e, response) } className={ response?.attendance[attendanceNumberOfDays] === "Late"
                        ? 'w-10 h-10 rounded-full p-2 border bg-yellow-500 border-yellow-900 text-white'
                        : 'w-10 h-10 rounded-full p-2 border bg-grey-100' 
                        }>L</button>
                    </div>
                    { response?.attendance[attendanceNumberOfDays] === "Late" 
                      ? <p className="text-xs md:text-sm tracking-wider text-grey-800 mt-5">Custom hours: { Math.floor(response?.hours[attendanceNumberOfDays] / 1) }h { Math.round(response?.hours[attendanceNumberOfDays] % 1 * 60) }m</p>
                      : <p className="text-xs md:text-sm tracking-wider text-grey-800 mt-5">-</p>
                    }
                  </div>
                )
              })} 
              { isValidAttendanceDate && <div className="md:col-span-4 sm:col-span-3 col-span-2">
              <Pagination
                currentPage={attendancePaginationState?.currentPage}
                limit={attendancePaginationState?.limit}
                totalItems={attendancePaginationState?.totalItems}
                totalPages={attendancePaginationState?.totalPages}
                handlePageChange={handleAttendancePageChange}
                handleNextPage={handleAttendanceNextPage}
                handlePrevPage={handleAttendancePrevPage}
              />
            </div>
            }    
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
      {/* Edit event default hours */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
          {/* Overlay */}
          {dialogOpen && (
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          )}
          {/* Panel */}
          <div className="fixed inset-0 flex items-center justify-center">
              <Dialog.Panel className="bg-white rounded-lg w-full mx-4 md:mx-0 md:w-2/3 lg:w-1/2 p-8 overflow-y-auto">
                  <Dialog.Title className="text-2xl font-semibold">Edit event default hours</Dialog.Title>
                  <div className="h-4"></div>
                  <div className="flex md:flex-row flex-col md:space-x-3 space-x-0">
                    <div className="flex flex-row space-x-2 items-end">
                      <input 
                        required
                        type="number" 
                        value={hours} 
                        onChange={ handleHoursChange } 
                        className="border border-neutral-200 rounded-md px-3 py-2 mt-1" 
                      />
                      <label className="block text-xl font-medium text-neutral-600">h</label>
                    </div>
                    <div className="flex flex-row space-x-2 items-end">
                      <input 
                        required
                        type="number" 
                        value={minutes} 
                        onChange={ handleMinutesChange } 
                        className="border border-neutral-200 rounded-md px-3 py-2 mt-1" 
                      />
                      <label className="block text-xl font-medium text-neutral-600">m</label>
                    </div>
                  </div>
                  { error === '' ? "" 
                    : <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded relative mt-5" role="alert">
                      { error }
                    </div>
                  }                       
                  <div className="h-4"></div>
                  <div className="flex justify-end">
                      <button type="submit"
                          className="bg-primary-600 text-white text-center hover:bg-primary-500 
                                        px-8 py-2 font-medium rounded-md transition duration-150 ease-in-out"
                          onClick={handleSaveDefaultHours}
                      >
                          Save
                      </button>
                  </div>
              </Dialog.Panel>
          </div>
      </Dialog>
      {/* Customise user hours */}
      <Dialog open={customHoursDialogOpen} onClose={ () => setCustomHoursDialogOpen(false) }>
          {/* Overlay */}
          {customHoursDialogOpen && (
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          )}
          {/* Panel */}
          <div className="fixed inset-0 flex items-center justify-center">
              <Dialog.Panel className="bg-white rounded-lg w-full mx-4 md:mx-0 md:w-2/3 lg:w-1/2 p-8 overflow-y-auto">
                  <Dialog.Title className="text-2xl font-semibold">Customise user hours</Dialog.Title>
                  <div className="h-4"></div>
                  <div className="flex md:flex-row flex-col md:space-x-3 space-x-0">
                    <div className="flex flex-row space-x-2 items-end">
                      <input 
                        required
                        type="number" 
                        value={ customHours } 
                        onChange={ handleCustomHoursChange } 
                        className="border border-neutral-200 rounded-md px-3 py-2 mt-1" 
                      />
                      <label className="block text-xl font-medium text-neutral-600">h</label>
                    </div>
                    <div className="flex flex-row space-x-2 items-end">
                      <input 
                        required
                        type="number" 
                        value={ customMinutes } 
                        onChange={ handleCustomeMinutesChange } 
                        className="border border-neutral-200 rounded-md px-3 py-2 mt-1" 
                      />
                      <label className="block text-xl font-medium text-neutral-600">m</label>
                    </div>
                  </div>
                  { error === '' ? "" 
                    : <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded relative mt-5" role="alert">
                      { error }
                    </div>
                  }                       
                  <div className="h-4"></div>
                  <div className="flex justify-end">
                      <button type="submit"
                          className="bg-primary-600 text-white text-center hover:bg-primary-500 
                                        px-8 py-2 font-medium rounded-md transition duration-150 ease-in-out"
                          onClick={handleSaveCustomHours}
                      >
                          Save
                      </button>
                  </div>
              </Dialog.Panel>
          </div>
      </Dialog>
    </CommitteeMemberProtected>
  )
}

export default Responses;
