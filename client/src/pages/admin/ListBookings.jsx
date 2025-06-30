import React, { useEffect, useState } from "react";
import { dummyBookingData } from "../../assets/assets";
import Title from "../../components/admin/Title";
import Loading from "../../components/Loading";
import dateFormat from "../../lib/dateFormat";
import BlurCircle from "../../components/common/BlurCircle";



const ListBookings = () => {

    const currency = import.meta.env.VITE_CURRENCY;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);


    const getAllBookings = async() => {
        setBookings(dummyBookingData);
        setLoading(false);
    }

    useEffect(()=>{
        getAllBookings();
    },[]);

    return !loading ? (
        <div className="relative">
          <Title text1="List" text2="Bookings"/>
            <BlurCircle top="-100px" left="100px"/>
          <div className="max-w-4xl mt-6 overflow-x-auto">
            
            <table className="w-full border-collapse rounded-md overflow-hidden">
                <thead>
                    <tr className="bg-primary/20 text-left text-white">
                        <th className="p-2 font-medium pl-5">User Name</th>
                        <th className="p-2 font-medium">Movie Name</th>
                        <th className="p-2 font-medium">Show Time</th>
                        <th className="p-2 font-medium">Seats</th>
                        <th className="p-2 font-medium">Amount</th>
                    </tr>
                </thead>
                <tbody className="text-sm font-light">
                    {
                        bookings.map((item,index)=>(
                            <tr key={index} className="border-b border-primary/20
                            bg-primary/5 even:bg-primary/10">
                                <td className="p-2 min-w-45 pl-5">{item.user.name}</td>
                                <td className="p-2">{item.show.movie.title}</td>
                                <td className="p-2">{dateFormat(item.show.showDateTime)}</td>
                                <td className="p-2">{Object.keys(item.bookedSeats).map(seat =>
                                    item.bookedSeats[seat]).join(", ")}</td>
                                <td className="p-2">{currency} {item.amount}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
          </div>
        </div>
    ) : (
        <Loading/>
    )
}


export default ListBookings;