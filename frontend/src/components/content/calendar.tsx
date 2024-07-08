'use client'

import { Calendar } from "@/components/ui/calendar"
import React from "react"



const CalendarComponent = ({ date, setDate }) => {

    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    )

}

export default CalendarComponent