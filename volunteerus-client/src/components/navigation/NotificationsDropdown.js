import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { socket } from "../../socket";
import { api } from "../../services/api-service";

export default function NotificationsDropdown() {
    const { user } = useSelector((state) => state.user);
    const [notifications, setNotifications] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    const getUserNotifications = async () => {
        try {
            const res = await api.getNotificationsForUser(localStorage.getItem("token"), user.id);
            setNotifications(res.data.reverse());
        } catch (err) {
            console.log(err);
        }
    }

    const handleMarkRead = async (e, notification) => {
        e.preventDefault();
        if (notification.read) {
            return;
        }
        try {
            await api.markNotificationAsRead(localStorage.getItem("token"), notification._id);
            getUserNotifications();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUserNotifications();
    }, []);

    useEffect(() => {
        const onConnect = () => {
            console.log("connected");
            setIsConnected(true);

            // subscribe to notifications and join room with user id
            socket.emit('joinRoom', user.id);
        }
        const onDisconnect = () => {
            console.log("disconnected");
            setIsConnected(false);
        }
        const onNotificationEvent = (notification) => {
            console.log("called onNotificationEvent()");
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('notificationEvent', onNotificationEvent);
        
        // return a function to clean up state
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('notificationEvent', onNotificationEvent);
        }
    }, []);

    return (
        <Menu as="div" className="relative inline-block text-left">
            {({ open }) => (
                <>
                    <Menu.Button className="rounded-full p-1 text-black hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items
                            static
                            className="absolute sm:origin-top-right -right-12 sm:right-0 mt-2 w-80 sm:w-96 max-h-96 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        >
                            {/* Notifications */}
                            <div className="px-4 py-3 font-medium">
                                Notifications
                            </div>
                            {/* Divider */} 
                            <div className="border-t border-gray-200 border-1"></div>                           
                            {/* Notifications */}
                            {
                                notifications.length === 0 ? (
                                    <Menu.Item>
                                        <div className="flex flex-row items-center px-4 py-3 text-sm hover:bg-gray-100">
                                            <div className="flex-col">
                                                <div>No notifications</div>
                                            </div>
                                        </div>
                                    </Menu.Item>
                                ) : notifications.map((notification, index) => (
                                    <Menu.Item key={index}>
                                        <div className="flex flex-row items-center px-4 py-3 text-sm hover:bg-gray-100" onClick={(e) => handleMarkRead(e, notification)}>
                                            <div className="flex-col">
                                                <div>{notification.message}</div>
                                                <span className="text-gray-700">{new moment(`${notification.timestamp}`).format('Do MMM YYYY, h:mm A')}</span>
                                            </div>
                                            {/* If notification is not read, display red dot */}
                                            <div className="flex-grow"></div>
                                            { 
                                                !notification.read && (<div className="bg-red-500 rounded-full m-2 h-2 w-2"></div>)
                                            }
                                        </div>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.Items>
                    </Transition>
                </>
            )}
        </Menu>
    )
}