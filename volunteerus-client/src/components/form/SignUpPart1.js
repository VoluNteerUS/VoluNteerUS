import { useNavigate } from "react-router-dom";
import imageCross from "../../assets/images/cross.png"; 
import TagInput from "../TagInput";
import axios from "axios";

function SignUpPart1({ response, setResponse, event, handleSubmit, action, setPage }) {
  const navigate = useNavigate();

  const searchUsers = async (search) => {
    const usersURL = new URL(`/users/search?query=${search}`, process.env.REACT_APP_BACKEND_API);
    let users = await axios.get(usersURL).then((res) => res.data);
    return users;
  }

  const getSelectedUsers = () => {
    return response?.selected_users;
  }

  const handleChildData = (data) => {
    setResponse({ ...response, selected_users: data });
    setPage(2);
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
          <div className="grid grid-cols-12 gap-4 pb-3"> 
            <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4">
              <h1 className="font-bold tracking-tight leading-none text-darkblue-900 sm:text-2xl md:text-3xl xl:text-4xl text-center mb-10 text-xl">Volunteer for { event?.title }</h1> 
              {/* form questions */}
              <p className="font-semibold text-sm">Select the users that you want to be grouped with by searching for their name or email below</p>
              <TagInput
                onChildData = { handleChildData }
                searchCallback={ searchUsers }
                getTag={ (item) => `${item.full_name} <${item.email}>` }
                getData={ (item) => item._id }
                populateDataCallback = { getSelectedUsers }
                buttonLabel="Next"
              />
            </div> 
          </div> 
        </div> 
      </div> 
    </div>     
      : <div className="flex items-center justify-center"> 
        <div className="bg-white rounded-lg px-3 pt-10"> 
          <div className="grid grid-cols-12 gap-4"> 
            <form onSubmit={ handleSubmit } className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4">
              {/* form questions */}
              
            </form> 
          </div> 
        </div> 
      </div>   
  )
}

export default SignUpPart1;
