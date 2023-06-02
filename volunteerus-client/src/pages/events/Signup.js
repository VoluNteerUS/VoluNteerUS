import Navbar from "../../components/navigation/Navbar"; 
import imageCross from "../../assets/images/cross.png" 
 
function EventSignup() { 
  return ( 
    <> 
      <Navbar /> 
      <div className="bg-pink-100"> 
        <div className="flex items-center h-screen justify-center"> 
          <div className="bg-white rounded-lg md:w-3/4 lg:w-3/5 2xl:w-1/2"> 
            <img src={imageCross} alt="cross" className="h-10 w-10 m-3 fill-pink-400"/> 
            <div className="grid grid-cols-12 gap-4"> 
              <div className="col-span-12 sm:px-12 xl:py-2 mx-0 sm:mx-4"> 
                <h1 className="font-bold tracking-tight leading-none text-darkblue-900 sm:text-2xl md:text-3xl xl:text-4xl text-center mb-10">Volunteer for Project MUSICare</h1> 
                <div className="flex flex-col mb-10"> 
                  <label className="">Do you have any music background? If yes, elaborate!</label> 
                  <textarea className="border border-black" 
                    required                 
                  /> 
                </div> 
                <div className="flex flex-col mb-10"> 
                  <label className="">What do you hope to take away from joining Project MUSICare?</label> 
                  <textarea className="border border-black" 
                    required                 
                  /> 
                </div> 
                <div className="flex flex-row space-x-2 mb-10"> 
                  <input className="w-8 h-8" 
                    required  
                    type="checkbox"              
                  /> 
                  <label className="font-semibold">Confirm attendance</label> 
                </div> 
                <div className="flex justify-end"> 
                  <button className="bg-pink-400 rounded-md text-white py-1 px-3 mb-10">Submit</button> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </> 
  ) 
} 
 
export default EventSignup;
