import React, { useState } from "react";
import BlurCircle from "./common/BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const DateSelector = ({dateTime,id}) => {

    const [selected,setSelected] = useState(null);
    const navigate = useNavigate();

    const bookHandler = () => {
        if(!selected){
            return toast("Please select a date");
        }
        navigate(`/movies/${id}/${selected}`);
        scrollTo(0,0);

    }

    return (
        <div id="dateSelect" className="pt-30">
            <div className="flex flex-col md:flex-row item-center justify-between gap-10
            relative p-8 bg-primary/10 border border-primary/20 rounded-lg">

                <BlurCircle top="-100px" left="-100px"/>
                <BlurCircle top="100px" right="0px"/>

                <div>
                    <p className="text-lg font-semibold">Choose Date</p>
                    <div className="flex items-center gap-6 text-sm mt-5">
                        <ChevronLeftIcon width={28}/>
                        <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                            {
                                Object.keys(dateTime).map((date)=>(
                                    <button key={date} className={`flex flex-col items-center
                                    justify-center h-14 w-14 aspect-square rounded cursor-pointer
                                    ${selected === date ? "bg-primary text-white" : "border border-primary/70"}`}
                                    onClick={()=> setSelected(date)}>
                                        <span>{new Date(date).getDate()}</span>
                                        <span>{new Date(date).toLocaleDateString("en-US",{month : "short"})}</span>
                                    </button>
                                ))
                            }
                        </span>
                        <ChevronRightIcon iwdth={28}/>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <button className="bg-primary text-white px-6 py-3 mt-6 rounded
                        hover:bg-primary/90 transition-all cursor-pointer"
                        onClick={bookHandler}>
                        Book Now
                    </button>
                </div>

            </div>

            
        </div>
    )
    
}



export default DateSelector;