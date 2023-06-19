import { useNavigate } from "react-router-dom"
import imageCross from "../../assets/images/cross.png" 

function SignUpForm({ questions, response, event, handleSubmit, handleChange, handleCheck, action }) {
  const navigate = useNavigate();

  function inputType(question) {
    if (question[2] === "Open-ended") {
      return (
        <textarea className="border border-black p-1" 
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
      <div className="flex items-center h-screen justify-center"> 
        <div className="bg-white rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2 px-3"> 
          <button onClick={ () => navigate(-1) }>
            <img src={ imageCross } alt="cross" className="h-10 w-10 m-3 fill-pink-400"/> 
          </button>
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
            <div className="flex flex-row space-x-2 mb-10"> 
              <input className="w-8 h-8" 
                required  
                type="checkbox"              
              /> 
              <label className="font-semibold">Confirm attendance</label> 
            </div> 
            <div className="flex justify-end"> 
                <button type="submit" className="bg-pink-400 rounded-md text-white py-1 px-3 mb-10">{ action }</button> 
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

export default SignUpForm;
