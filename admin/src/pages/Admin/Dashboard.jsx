import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets_admin/assets";

const Dashboard = () => {
    const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
    const { currencySymbol, slotDateFormat } = useContext(AppContext);
    
    useEffect(() => {
        if (aToken) {
            getDashData();
        }
    }, [aToken]);

    return (
        dashData && (
            <div className="m-5">
                <div className="flex flex-wrap gap-3">
                    {/* Doctors */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                        <img className="w-14" src={assets.doctor_icon} alt="" />
                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {dashData.doctors}
                            </p>
                            <p className="text-gray-400">Doctors</p>
                        </div>
                    </div>
                    {/* Appointments */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                        <img className="w-14" src={assets.appointments_icon} alt="" />
                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {dashData.appointments}
                            </p>
                            <p className="text-gray-400">Appointments</p>
                        </div>
                    </div>
                    {/* Patients */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                        <img className="w-14" src={assets.patients_icon} alt="" />
                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {dashData.patients}
                            </p>
                            <p className="text-gray-400">Patients</p>
                        </div>
                    </div>
                    {/* Earnings */}
                    <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
                        <img className="w-14" src={assets.earnings_icon} alt="" />
                        <div>
                            <p className="text-xl font-semibold text-gray-600">
                                {currencySymbol}{dashData.earnings}
                            </p>
                            <p className="text-gray-400">Admin Earnings</p>
                        </div>
                    </div>
                </div>

                {/* Latest Bookings Section */}
                <div className="bg-white">
                    <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
                        <img className="" src={assets.list_icon} alt="" />
                        <p className="font-semibold">Latest Bookings</p>
                    </div>
                    <div className="pt-4 border border-t-0">
                        {dashData.latestAppointments.map((item, index) => (
                            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
                                <img className="rounded-full w-10" src={item.docData.image} alt="" />
                                <div className="flex-1 text-sm">
                                    <p className="text-gray-800 font-medium">{item.docData.name}</p>
                                    <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
                                </div>
                                {item.cancelled
                                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                    : item.isCompleted ?
                                        <p className='text-green-500 text-xs font-medium'>Completed</p>
                                        : <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    );
}

export default Dashboard;
