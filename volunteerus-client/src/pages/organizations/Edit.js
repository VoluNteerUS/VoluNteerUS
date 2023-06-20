import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/navigation/Navbar";
import defaultOrganizationImage from "../../assets/images/organization-icon.png";
import { MinusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { setOrganizations, setCurrentOrganization } from "../../actions/organizationActions";
import TagInput from "../../components/TagInput";
import AdminVisible from "../../common/protection/AdminVisible";
import CommitteeMemberProtected from "../../common/protection/CommitteeMemberProtected";

function EditOrganizationPage() {
  const { id } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user from redux store
  const persistedUserState = useSelector((state) => state.user);
  const user = persistedUserState?.user || "Unknown";
  
  // State variables for component
  const [organization, setOrganization] = useState({});
  const [profilePicture, setProfilePicture] = useState(organization?.image_url || defaultOrganizationImage);
  const [role, setRole] = useState(user.role);
  const [state, setState] = useState({
    profile: {
      name: organization?.name,
      description: organization?.description,
      file: null,
      errors: [],
    },
    contacts: {
      email: organization?.contact?.email || "",
      social_media: organization?.contact?.social_media || [],
      errors: [],
    },
    committeeMembers: [],
  });

  const getOrganization = async () => {
    let currentOrganization;
    const organizationURL = new URL(`/organizations/${id}`, process.env.REACT_APP_BACKEND_API);
    await axios.get(organizationURL).then((res) => {
      setOrganization(res.data);
      currentOrganization = res.data;
      setProfilePicture(res.data.image_url || defaultOrganizationImage);
      setState({
        profile: {
          name: res.data.name,
          description: res.data.description,
          file: null,
          errors: [],
        },
        contacts: {
          email: res.data.contact?.email || "",
          social_media: res.data.contact?.social_media || [],
          errors: [],
        },
        committeeMembers: res.data?.committee_members || [],
      });
    }).catch((err) => {
      console.error({ err });
    });

    // Check if user is a committee member
    const checkCommitteeMemberURL = new URL(`/organizations/checkCommitteeMember`, process.env.REACT_APP_BACKEND_API);
    const checkCommitteeMemberRequestBody = {
      userId: user.id,
      organizationId: currentOrganization?._id
    }

    const response = await axios.post(checkCommitteeMemberURL, checkCommitteeMemberRequestBody);
    
    if (response.data) {
      setRole('COMMITTEE MEMBER');
    }
  }

  useEffect(() => {
    getOrganization();
  }, [id]);


  const handleProfilePictureUpload = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setProfilePicture(URL.createObjectURL(file));
    setState({
      ...state,
      profile: { ...state.profile, file: file }
    });
  }

  const handleSaveProfileChanges = async (event) => {
    event.preventDefault();

    // Reset errors
    setState({
      ...state,
      profile: {
        ...state.profile,
        errors: [],
      },
    });

    // Validate form
    if (state.profile.name === "") {
      setState({
        ...state,
        profile: {
          ...state.profile,
          errors: [
            ...state.profile.errors,
            "Please enter a name for your organization."
          ]
        }
      });

      return;
    }
    if (state.profile.description === "") {
      setState({
        ...state,
        profile: {
          ...state.profile,
          errors: [
            ...state.profile.errors,
            "Please enter a description for your organization."
          ]
        }
      });
      return;
    }

    // Form Data for multi-part form
    const formData = new FormData();
    formData.append("file", state.profile.file);
    formData.append("name", state.profile.name);
    formData.append("description", state.profile.description);

    // Send PATCH request to update organization
    const organizationURL = new URL(`/organizations/${id}?role=${role}`, process.env.REACT_APP_BACKEND_API);
    await axios.patch(organizationURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log(res);
      if (!res.data) {
        alert('You do not have permission to update profile.');
        navigate('/');
      } else {
        // Alert user of successful update
        alert("Successfully updated organization!");
      }
    }).catch((err) => {
      // Add errors to state
      if (err.response) {
        const { data } = err.response;
        const errors = Object.keys(data).map((key) => `${key}: ${data[key]}`);
        setState({ ...state, profile_errors: errors });
      }
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
    setState({
      ...state,
      contacts: {
        ...state.contacts,
        social_media: [
          ...state.contacts.social_media,
          {
            platform: "",
            url: ""
          }
        ]
      }
    });
  }

  const handleRemoveSocialMedia = (index) => {
    console.log("Remove social media");
    setState({
      ...state,
      contacts: {
        ...state.contacts,
        social_media: [
          ...state.contacts.social_media.slice(0, index),
          ...state.contacts.social_media.slice(index + 1)
        ]
      }
    });
  }

  const handleSocialMediaPlatformChange = (index, value) => {
    console.log("Social media platform change");
    const newSocialMedia = [...state.contacts.social_media];
    setState({
      ...state,
      contacts: {
        ...state.contacts,
        social_media: [
          ...newSocialMedia.slice(0, index),
          { ...newSocialMedia[index], platform: value },
          ...newSocialMedia.slice(index + 1)
        ]
      }
    });
  }

  const handleSocialMediaURLChange = (index, value) => {
    console.log("Social media url change");
    const newSocialMedia = [...state.contacts.social_media];
    setState({
      ...state,
      contacts: {
        ...state.contacts,
        social_media: [
          ...newSocialMedia.slice(0, index),
          { ...newSocialMedia[index], url: value },
          ...newSocialMedia.slice(index + 1)
        ]
      }
    });
  }

  const handleSaveContactChanges = async (event) => {
    event.preventDefault();

    // Reset errors
    setState({
      ...state,
      contacts: {
        ...state.contacts,
        errors: [],
      },
    });

    // Validate form
    if (state.contacts.email === "") {
      setState({
        ...state,
        contacts: {
          ...state.contacts,
          errors: [
            ...state.contacts.errors,
            "Please enter an email for your organization."
          ]
        }
      });
      return;
    }

    console.log(organization?.contact);

    if (organization?.contact === null || organization?.contact === undefined) {
      // Send POST request to create contact
      const organizationContactsURL = new URL(`/organizations/${id}/contacts?role=${role}`, process.env.REACT_APP_BACKEND_API);
      await axios.post(organizationContactsURL, state.contacts).then((res) => {
        console.log(res);
        if (!res.data) {
          alert('You do not have permission to create contact.');
          navigate('/');
        } else {
          alert("Successfully created contact!");
        }
      }).catch((err) => {
        const { data } = err.response;
        const errors = Object.keys(data).map((key) => `${key}: ${data[key]}`);
        setState({
          ...state,
          contacts: {
            ...state.contacts,
            errors: [
              ...state.contacts.errors,
              ...errors
            ]
          }
        });
      });
    } else {
      // Send PATCH request to update organization
      const organizationContactsURL = new URL(`/organizations/${id}/contacts?role=${role}`, process.env.REACT_APP_BACKEND_API);
      await axios.patch(organizationContactsURL, state.contacts).then((res) => {
        console.log(res);
        if (!res.data) {
          alert('You do not have permission to update contacts.')
          navigate('/');
        } else {
          alert("Successfully updated contact!");
        }
      }).catch((err) => {
        const { data } = err.response;
        const errors = Object.keys(data).map((key) => `${key}: ${data[key]}`);
        setState({
          ...state,
          contacts: {
            ...state.contacts,
            errors: [
              ...state.contacts.errors,
              ...errors
            ]
          }
        });
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

  // Save committee members changes
  const handleChildData = (data) => {
    
    const committeeMembersURL = new URL(`/organizations/${id}/committeeMembers?role=${user.role}`, process.env.REACT_APP_BACKEND_API);
    const committeeMembers = getCommitteeMembers();
    const body = [...data]

    // Check if no changes were made
    if (JSON.stringify(committeeMembers) === JSON.stringify(body)) {
      return;
    } else if (committeeMembers.length === 0) {
      // Send POST request to create committee members
      axios.post(committeeMembersURL, body).then((res) => {
        console.log(res);
        alert("Successfully created committee members!");
      }).catch((err) => {
        console.log(err);
      });
    } else {
      // Send PATCH request to update committee members
      axios.patch(committeeMembersURL, body).then((res) => {
        console.log(res);
        alert("Successfully updated committee members!");
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  const searchUsers = async (search) => {
    const usersURL = new URL(`/users/search?query=${search}`, process.env.REACT_APP_BACKEND_API);
    const users = await axios.get(usersURL).then((res) => res.data);
    return users;
  }

  const getCommitteeMembers = () => {
    // const committeeMembersURL = new URL(`/committeeMembers?organization_id=${id}`, process.env.REACT_APP_BACKEND_API);
    // const committeeMembers = await axios.get(committeeMembersURL).then((res) => res.data);
    // return committeeMembers;
    return state.committeeMembers;
  }

  return (
    <CommitteeMemberProtected user={ user }>
      <Navbar />
      <div className="bg-pink-300 py-4 px-4 md:px-0">
        {/*  Organizational Profile */}
        <div className="bg-neutral-100 rounded-lg shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2 block mx-auto">
          {/* Allow for edit of profile picture */}
          <div className="p-8">
            <img src={profilePicture} alt="organization-image" className="w-32 h-32 rounded-full mx-auto" />
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
                        {
                          state.profile.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                )
              }
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
            <form onSubmit={handleSaveContactChanges}>
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
                    value={state.contacts.email}
                    onChange={
                      (event) => setState({
                        ...state,
                        contacts: {
                          ...state.contacts,
                          email: event.target.value
                        }
                      })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="description">
                    Social Media Platforms
                  </label>
                  {
                    state?.contacts?.social_media?.map((item, index) => {
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
                  {/* Display Errors */}
                  {
                    state.contacts.errors.length > 0 && (
                      <div className="col-span-2">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                          <ul>
                            {
                              state.contacts.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    )
                  }
                  <div className="flex flex-row gap-2 ml-auto my-2">
                    {/* Add Social Media */}
                    <Link
                      className="bg-white hover:bg-secondary-600 
                      border-gray-600 border-2 hover:border-white
                      hover:text-white text-gray-600 
                      ml-auto py-2 px-6 rounded-lg block"
                      onClick={handleAddSocialMedia}
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
        <AdminVisible>
          {/* Spacer */}
          <div className="h-4 md:h-6"></div>
          {/* Card to manage committee members only visible to admin */}
          <div className="bg-neutral-100 rounded-lg shadow-lg md:w-3/4 lg:w-2/3 xl:w-1/2 block mx-auto">
            <div className="px-8 py-4 lg:py-8">
              <h3 className="text-xl font-bold pb-4">Manage Committee Members</h3>
              {/* Simulate a giant textbox */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm lg:text-base font-bold mb-2" htmlFor="description">
                    Committee Members
                  </label>
                  <TagInput 
                    onChildData = { handleChildData }
                    searchCallback={ searchUsers }
                    getTag={ (item) => `${item.full_name} <${item.email}>` }
                    getData={ (item) => item._id }
                    populateDataCallback = { getCommitteeMembers }
                  />
                </div>
              </div>
            </div>
          </div>
        </AdminVisible>
      </div>
    </CommitteeMemberProtected>
  );
}

export default EditOrganizationPage;