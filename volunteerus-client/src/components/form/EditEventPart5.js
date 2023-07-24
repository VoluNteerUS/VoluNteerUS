import { XMarkIcon, ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function EditEventPart5({ details, setDetails, error, setError, setPage, handleSubmit }) {
  const handleBack = () => {
    setError("");
    setPage(2);
  }

  const groupingQuestions = [
    { index: 0,
      question: "Grouping needed for this event?", 
      options: ["No", "Yes"] },
    { index: 1,
      question: "Grouping type?",
      options: ["-", "Random", "With friends"]},
    { index: 2,
      question: "Grouping size?",
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
  ];

  const handleChange = (e, question) => {
    // if grouping is not needed, reset grouping type and size to default
    setError("");
    if ((question.index === 0 && e.target.value === "No") || (details.groupSettings[0] == "No" && e.target.value != "Yes")) {
      if (question.index === 1) {
        setError("Grouping type cannot be selected since no grouping is needed");
      } else if (question.index === 2) {
        setError("Grouping size cannot be more than 1 since no grouping is needed");
      }
      let newGroupDetails = ["No", "-", 1];
      setDetails({ ...details, groupSettings: newGroupDetails })
    } else {
      let newGroupDetails = details.groupSettings;
      newGroupDetails[question.index] = e.target.value;
      setDetails({ ...details, groupSettings: newGroupDetails });
    }
    console.log(details)
  }

  return (
    <div className="flex items-center justify-center py-4"> 
      <div className="bg-white pb-5 rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 flex flex-col px-3"> 
        <div className="flex flex-row justify-between">
          <button onClick={ handleBack } className="p-3 mt-3 mx-3">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <Link to="/" className="p-3 mt-3 mx-3 rounded-full bg-white/70 hover:bg-slate-500 self-end">
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-4"> 
          <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4 flex flex-col"> 
            <h1 className="font-bold font-serif tracking-tight leading-none text-darkblue-900 sm:text-xl md:text-2xl xl:text-3xl mb-10">Groupings</h1> 
            {/* form progress bar */}
            <ol className="flex justify-center">
              <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                <span className="flex items-center justify-center w-10 h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                  <p className="text-white">1</p>
                </span>
              </li>
              <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                <span className="flex items-center justify-center w-10 h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                  <p className="text-white">2</p>
                </span>
              </li>
              <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                  <p className="text-white">3</p>
                </span>
              </li>
              <li className="flex items-center w-1/6 after:content-[''] after:w-full after:h-1 after:border-b after:border-pink-400 after:border-4 after:inline-block">
                  <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                      <p className="text-white">4</p>
                  </span>
              </li>
              <li className="flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-pink-400 rounded-full lg:h-12 lg:w-12 shrink-0">
                      <p className="text-white">5</p>
                  </span>
              </li>
            </ol>
            {/* Grouping details */}
            <p className="mt-10 border-l-4 px-2 border-pink-100 text-grey-800 text-justify sm:text-base text-sm">
              Note that this grouping feature is for us to help you group volunteers into your desired group size.
              If the chosen grouping type is "With friends", we will add an additional question that allows volunteers to select
              who they want to be grouped with into the sign up form. If you have included such questions in part 4 of the form, kindly
              remove it to avoid having repetitive questions. Thank you. 
            </p>
            <form onSubmit={ handleSubmit } className="mt-16 space-y-5">
              {groupingQuestions.map((question) => (
                <>
                  <div className="grid sm:grid-cols-4"> 
                    <label className="col-span-3 tracking-wide">{ question.question }</label>
                    <select value={details.groupSettings[question.index]} onChange={(e) => handleChange(e, question) } className="border border-grey-600 p-1 rounded-lg">
                      {question.options.map((option) => (
                        <option value={ option }>
                          { option }
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ))}
              { error !== "" ? <div className="border border-grey-600 text-pink-400 text-sm px-2 py-1 rounded relative flex space-x-3" role="alert">
                <ExclamationTriangleIcon className="w-5 h-5"/>
                <p>{ error }</p>
              </div> : "" }
              <div className="grid sm:grid-cols-4 py-10">
                <button type="submit" className="bg-pink-400 text-white rounded-lg px-3 py-1 col-start-4">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditEventPart5;