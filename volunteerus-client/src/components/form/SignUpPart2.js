import { useNavigate } from "react-router-dom"
import { XMarkIcon } from "@heroicons/react/24/outline";
import imageCross from "../../assets/images/cross.png" 

function SignUpPart2({ questions, response, event, handleSubmit, handleChange, handleCheck, action, setPage }) {
  const navigate = useNavigate();

  function inputType(question) {
    if (question[2] === "Open-ended") {
      return (
        <textarea 
          className="block w-full rounded-md border border-gray-800 p-1" 
          rows={3}
          required
          value={response[`${question[0]}`]}
          onChange={ (e) => handleChange(e, question) }  
          disabled={action === "View"}               
        /> 
      )
    } else if (question[2] === "MCQ") {
      return (
        <select 
          required 
          value={response[`${question[0]}`]}
          className="border rounded-lg mt-2 py-1" 
          onChange={ (e) => handleChange(e, question) } 
          disabled={action === "View"}  
        >
          { Object.keys(question[3]).filter((key) => question[3][key] !== "").map((key) => (
            <option value={ question[3][key] }>{ question[3][key] }</option>
          )) }
        </select>
      )
    } else if (question[2] === "MRQ") { 
      return (
        Object.keys(question[3]).filter((key) => question[3][key] !== "").map((key) => (
          <>
            <div className="flex space-x-3">
              <input
                disabled={action==="View"}
                checked={ response[`${question[0]}`] === undefined ? false : response[`${question[0]}`][key - 1] }
                type="checkbox"
                onChange={ (e) => handleCheck(e, key, question) } 
              />
              <label className="font-thin">{ question[3][key] }</label>
            </div>
          </>
        ))
      )
    }
  }

  return (
    action !== "View" 
      ? <div className="bg-pink-100"> 
      <div className="flex items-center min-h-screen justify-center"> 
        <div className="bg-white rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 px-3">
          <div className="flex flex-row justify-end items-center py-2">
            <button className="rounded-full bg-gray-200 hover:bg-gray-500 p-3" onClick={ () => navigate(-1) }>
              <img src={ imageCross } alt="cross" className="h-8 w-8 fill-pink-400"/> 
            </button>
          </div>
          <div className="grid grid-cols-12 gap-4"> 
            <form onSubmit={ handleSubmit } className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4">
              <h1 className="font-bold tracking-tight leading-none text-darkblue-900 sm:text-2xl md:text-3xl xl:text-4xl text-center mb-10 text-xl">Volunteer for { event?.title }</h1> 
              {/* form questions */}
              {questions.map((question) => (
                <div className="flex flex-col mb-10" key={ question[0] }> 
                  <label className="font-semibold">{ question[1] }</label> 
                  { inputType(question) }
                </div> 
              ))}
              <div className="flex flex-row items-center space-x-3 mb-8"> 
                <input 
                  className="w-8 h-8 rounded border border-gray-800 p-1" 
                  required  
                  type="checkbox"              
                /> 
                <label className="font-semibold">Confirm submission</label> 
              </div> 
              <div className="flex justify-end"> 
                  <button type="submit" className="bg-pink-500 hover:bg-pink-700 text-white text-center font-semibold py-2 px-6 rounded-lg block ml-auto my-10">{ action }</button> 
              </div> 
            </form> 
          </div> 
        </div> 
      </div> 
    </div>     
      : <div className="flex items-center justify-center"> 
        <div className="bg-white rounded-lg px-3 pt-10"> 
          <div className="grid grid-cols-12 gap-4"> 
            <form onSubmit={ handleSubmit } className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4">
              {/* form questions */}
              {questions.map((question) => (
                <div className="flex flex-col mb-10" key={ question[0] }> 
                  <label className="font-semibold">{ question[1] }</label> 
                  { inputType(question) }
                </div> 
            ))}
            </form> 
          </div> 
        </div> 
      </div>   
  )
}

export default SignUpPart2;
