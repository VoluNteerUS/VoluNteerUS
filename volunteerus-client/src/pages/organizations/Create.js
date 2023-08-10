import { useState } from "react";
import imageUpload from "../../assets/images/image-upload.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../../services/api-service";

function CreateOrganizationPage() {
    const persistedUserState = useSelector((state) => state.user);
    const user = persistedUserState?.user || 'Unknown';

    const [state, setState] = useState({
        profile: {
            name: '',
            description: '',
            file: null,
            errors: [],
        },
    });

    const [profilePicture, setProfilePicture] = useState(null);

    const navigate = useNavigate();

    const handleCreateOrganization = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("token");

        // Reset errors
        setState({ ...state, profile: { ...state.profile, errors: [] } });

        // Validate form
        if (!state.profile.name ) {
            setState({ ...state, profile: { ...state.profile, errors: ["Please enter a name for your organization."] } });
            return;
        }

        if (!state.profile.description) {
            setState({ ...state, profile: { ...state.profile, errors: ["Please enter a description for your organization."] } });
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append("name", state.profile.name);
        formData.append("description", state.profile.description);
        formData.append("file", state.profile.file);

        api.createOrganization(token, formData, user.role)
        // axios.post(organizationsURL, formData, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                // Redirect to organization page
                const { data } = response;
                navigate(`/organizations/${data._id}`, { replace: true });
            }
            )
            .catch((error) => {
                // Add errors to state
                if (error.response) {
                    const { data } = error.response;
                    const errors = Object.keys(data).map((key) => `${key}: ${data[key]}`);
                    setState({ ...state, profile: { ...state.profile, errors } });
                }
            }
        );
    }

    const handleProfilePictureUpload = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        // Check if file is an image
        if (!file.type.startsWith("image/")) {
            setState({ ...state, profile: { ...state.profile, errors: ["Please upload an image file."] } });
            return;
        }
        // Check if file is too large
        if (file.size > 5 * 1024 * 1024) {
            setState({ ...state, profile: { ...state.profile, errors: ["Please upload an image file smaller than 5MB."] } });
            return;
        }
        setProfilePicture(URL.createObjectURL(file));
        setState({ ...state, profile: { ...state.profile, file } });
    }

    return (
        <>
            <div className="bg-pink-300 py-4 min-h-screen h-full">
                <div className="block mx-auto md:w-3/4 lg:w-2/3 xl:w-1/2 bg-neutral-100 rounded-lg">
                    {/* Form to create organization name and description */}
                    <form className="p-8" onSubmit={handleCreateOrganization}>
                        {/* Card Title */}
                        <div className="pb-4">
                            <h1 className="text-3xl text-darkblue-900 font-bold font-serif">Create a new organization</h1>
                            <p className="text-sm">Start a brand new volunteering organization!</p>
                        </div>
                        {/* Allow uploading of picture */}
                        <div className="p-4">
                            <img src={ profilePicture || imageUpload } alt="organization-image" className="w-32 h-32 rounded-full mx-auto" />
                            {/* Button to edit profile picture */}
                            <label htmlFor="profile-picture-upload" className="bg-pink-500 hover:bg-pink-700 text-white text-center font-bold py-2 px-4 rounded-full block mx-auto mt-4 w-52">
                            Upload Profile Picture
                            </label>
                            <input id="profile-picture-upload" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="name">
                                    Organization Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    placeholder="Organization Name"
                                    value={state.profile.name}
                                    onChange={(event) => setState({ ...state, profile: { ...state.profile, name: event.target.value } })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="description">
                                    About
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-44"
                                    id="description"
                                    type="text"
                                    placeholder="Organization Description"
                                    value={state.profile.description}
                                    onChange={(event) => setState({ ...state, profile: { ...state.profile, description: event.target.value } })}
                                />
                            </div>
                            {
                                state.profile.errors.length > 0 && (
                                    <div className="col-span-2">
                                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                            <ul>
                                                {state.profile.errors.map((error, index) => <li key={index}>{error}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="col-span-2">
                                <button className="bg-pink-500 hover:bg-pink-700 text-white text-center font-semibold py-2 px-6 rounded-lg block ml-auto">
                                    Create Organization
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateOrganizationPage;