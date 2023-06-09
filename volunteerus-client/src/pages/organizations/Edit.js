import Navbar from "../../components/navigation/Navbar";
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import defaultOrganizationImage from "../../assets/images/organization-icon.png";
import { MinusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { setOrganizations, setCurrentOrganization } from "../../actions/organizationActions";

function EditOrganizationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";
  const organizationsReducer = useSelector((state) => state.organizations);
  const organization = organizationsReducer.currentOrganization;
  const [profilePicture, setProfilePicture] = useState(organization?.image_url || defaultOrganizationImage);
  const [profile, setProfile] = useState(
    {
      name: organization?.name,
      description: organization?.description,
      file: null,
    }
  );
  const [contacts, setContacts] = useState(
    {
      email: organization?.contact?.email || "",
      social_media: organization?.contact?.social_media || [],
    }
  );
  
  const dispatch = useDispatch();

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    setProfile({ ...profile, file: file });
    setProfilePicture(URL.createObjectURL(file));
  }

  const handleSaveProfileChanges = async (event) => {
    event.preventDefault();

    // Form Data for multi-part form
    const formData = new FormData();
    formData.append("file", profile.file);
    formData.append("name", profile.name);
    formData.append("description", profile.description);

    // Send PATCH request to update organization
    const organizationURL = new URL(`/organizations/${id}?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
    await axios.patch(organizationURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res);
      if (!res.data) {
        alert('You do not have permission to update profile.');
        navigate('/');
      }
    }).catch((err) => {
      console.error(err);
    });
    
    // Send GET request to get updated organization
    const updatedOrganization = await axios.get(organizationURL).then((res) => res.data);
    const organizationsURL = new URL("/organizations", process.env.REACT_APP_BACKEND_API);
    const organizations = await axios.get(organizationsURL).then((res) => res.data);

    // Update organization in redux store
    dispatch(setOrganizations(organizations));
    dispatch(setCurrentOrganization(updatedOrganization));
  }

  const handleAddSocialMedia = () => {
    console.log("Add social media");
    setContacts({ ...contacts, social_media: [...contacts.social_media, { platform: "", url: "" }] });
  }

  const handleRemoveSocialMedia = (index) => {
    console.log("Remove social media");
    setContacts({ ...contacts, social_media: [...contacts.social_media.slice(0, index), ...contacts.social_media.slice(index + 1)] });
  }

  const handleSocialMediaPlatformChange = (index, value) => {
    console.log("Social media platform change");
    const newSocialMedia = [...contacts.social_media];
    setContacts({ ...contacts, social_media: [...newSocialMedia.slice(0, index), { ...newSocialMedia[index], platform: value }, ...newSocialMedia.slice(index + 1)] });
  }

  const handleSocialMediaURLChange = (index, value) => {
    console.log("Social media url change");
    const newSocialMedia = [...contacts.social_media];
    setContacts({ ...contacts, social_media: [...newSocialMedia.slice(0, index), { ...newSocialMedia[index], url: value }, ...newSocialMedia.slice(index + 1)] });
  }

  const handleSaveContactChanges = async (event) => {
    event.preventDefault();

    if (organization?.contact === null) {
      // Send POST request to create contact
      const organizationContactsURL = new URL(`/organizations/${id}/contacts?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      await axios.post(organizationContactsURL, contacts).then((res) => {
        console.log(res);
        if (!res.data) {
          alert('You do not have permission to create contact.');
          navigate('/');
        }
      }).catch((err) => {
        console.error(err);
      });
    } else {
      // Send PATCH request to update organization
      const organizationContactsURL = new URL(`/organizations/${id}/contacts?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
      await axios.patch(organizationContactsURL, contacts).then((res) => {
        console.log(res);
        if (!res.data) {
          alert('You do not have permission to update contacts.')
        }
      }).catch((err) => {
        console.error(err);
      });
    }

    // Send GET request to get updated organization
    const organizationURL = new URL(`/organizations/${id}`, process.env.REACT_APP_BACKEND_API);
    const organizationsURL = new URL("/organizations", process.env.REACT_APP_BACKEND_API);
    const updatedOrganization = await axios.get(organizationURL).then((res) => res.data);
    const organizations = await axios.get(organizationsURL).then((res) => res.data);

    // Update organization in redux store
    dispatch(setOrganizations(organizations));
    dispatch(setCurrentOrganization(updatedOrganization));
  }

  return (
    <>
      <Navbar />
      <div className="bg-pink-300 py-4 px-4 md:px-0">
        {/*  Organizational Profile */}
        <div className="bg-neutral-100 rounded-lg shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2 block mx-auto">
          {/* Allow for edit of profile picture */}
          <div className="p-8">
            <img src={ profilePicture } alt="organization-image" className="w-32 h-32 rounded-full mx-auto" />
            {/* Button to edit profile picture */}
            <label htmlFor="profile-picture-upload" className="bg-pink-500 hover:bg-pink-700 text-white text-center font-bold py-2 px-4 rounded-full block mx-auto mt-4 w-52">
              Edit Profile Picture
            </label>
            <input id="profile-picture-upload" type="file" accept="image/*" className="hidden" onChange={handleProfilePictureUpload} />
          </div>
          {/* Form to edit organization name and description */}
          <form className="p-8" onSubmit={handleSaveProfileChanges}>
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
                  value={ profile.name }
                  onChange={(event) => setProfile({ ...profile, name: event.target.value })}
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
                  value={ profile.description }
                  onChange={(event) => setProfile({ ...profile, description: event.target.value })}
                />
              </div>
              <div className="col-span-2">
                <button className="bg-pink-500 hover:bg-pink-700 text-white text-center font-semibold py-2 px-6 rounded-lg block ml-auto">
                  Save Profile Changes
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* Spacer */}
        <div className="h-4 md:h-6"></div>
        {/* Another card for contacts */}
        <div className="bg-neutral-100 rounded-lg shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2 block mx-auto">
          {/* Form to update contacts */}
          <div className="px-8 py-4 lg:py-8">
            <h3 className="text-xl font-bold pb-4">Organization Contacts</h3>
            <form onSubmit={ handleSaveContactChanges }>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="description">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Organization Email"
                    value={contacts.email}
                    onChange={(event) => setContacts({ ...contacts, email: event.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="description">
                    Social Media Platforms
                  </label>
                  {
                    contacts?.social_media?.map((item, index) => {
                      return (
                        <div key={index}>
                          <div className="flex justify-between gap-4 pb-4">
                            <div className="flex-none">
                              <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="social-media">
                                Type
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="social-media"
                                type="text"
                                placeholder="Social Media"
                                value={item.platform}
                                onChange={(event) => handleSocialMediaPlatformChange(index, event.target.value)}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="social-media-url">
                                URL
                              </label>
                              <input
                                className="shadow appearance-none border rounded w-full h-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="social-media-url"
                                type="text"
                                placeholder="Social Media"
                                value={item.url}
                                onChange={(event) => handleSocialMediaURLChange(index, event.target.value)}
                              />
                            </div>
                            <div className="flex-none mt-auto">
                              <Link 
                                className="flex items-center w-10 h-10 rounded-full bg-danger-600 text-white ml-auto" 
                                onClick={() => handleRemoveSocialMedia(index)}
                              >
                                <MinusIcon className="h-5 w-5 text-white mx-auto block" aria-hidden="true" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                  <div className="flex flex-row gap-2 ml-auto my-2">
                    {/* Add Social Media */}
                    <Link 
                      className="bg-white hover:bg-secondary-600 
                      border-gray-600 border-2 hover:border-white
                      hover:text-white text-gray-600 
                      ml-auto py-2 px-6 rounded-lg block" 
                      onClick={ handleAddSocialMedia }
                    >
                      Add Social Media
                    </Link>
                    {/* Save Changes */}
                    <button className="bg-pink-500 hover:bg-pink-700 text-white text-center font-semibold py-2 px-6 rounded-lg block">
                      Save Contacts
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditOrganizationPage;