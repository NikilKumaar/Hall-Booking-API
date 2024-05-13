const express = require("express");
const bodyParser = require("body-parser");
const { format } = require("date-fns");

const app = express();

app.use(bodyParser.json());

require("dotenv").config();
//console.log(process.env)
const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;

const rooms = [
  {
    roomName: "Auditorium",
    roomId: "01",
    seats: 100,
    amenities: "wifi,projector,AC,foods",
    price: 1500,
  },
  {
    roomName: "Banquet",
    roomId: "02",
    seats: 150,
    amenities: "speaker,projector,AC,foods",
    price: 2000,
  },
  {
    roomName: "Conference ",
    roomId: "03",
    seats: 75,
    amenities: "wifi,projector,AC,tables,foods",
    price: 1250,
  },
];

const bookings = [
  {
    bookingId: 1,
    customerName: "Nikil kumaar N",
    roomId: "K1",
    date: format(new Date("09-05-2024"), "dd-MMM-yyyy"),
    start: "08:00 am",
    end: "09:00 pm",
    status: "confirmed",
  },
  {
    bookingId: 2,
    customerName: "Sreeman SP",
    roomId: "R2",
    date: format(new Date("09-05-2024"), "dd-MMM-yyyy"),
    start: "08:00 am",
    end: "09:00 pm",
    status: "waiting for confirmation",
  },
  {
    bookingId: 3,
    customerName: "Isaac Inbaraj F",
    roomId: "S1",
    date: format(new Date("12-05-2024"), "dd-MMM-yyyy"),
    start: "08:00 am",
    end: "09:00 pm",
    status: "confirmed",
  },
];
let customers = [
  {
    name: "Kumaresan K",
    bookings: [
      {
        customer: "Kumaresan K",
        bookingDate: "01/05/2024",
        startTime: "12:00 pm",
        endTime: "11:59 am",
        bookingID: "3",
        roomId: "K1",
        status: "booked",
        booked_On: "13/05/2024",
      },
    ],
  },
  {
    name: "Sundaram K",
    bookings: [
      {
        customer: "Sundaram K",
        bookingDate: "05/05/2024",
        startTime: "08:00 am",
        endTime: "07:59 pm",
        bookingID: "5",
        roomId: "S1",
        status: "booked",
        booked_On: "10/05/2024",
      },
    ],
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Hall Booking API</h1>");
});
// all rooms details in the postman API
app.get("/rooms", (req, res) => {
  res.send(rooms);
});
// creating new rooms in the postman API

app.post("/createrooms", (req, res) => {
  const { roomName, seats, amenities, price } = req.body;
  const room = { roomName, roomId: rooms.length + 1, seats, amenities, price };
  rooms.push(room); // new room is created and it is pushed in rooms array
  res.status(201).json({ message: "Room added sucessfully" });
});
//  all booking data views
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

app.post("/viewbookings", (req, res) => {
  const { customerName, date, start, end, roomId, status } = req.body;
  const bookingFilter = bookings.find(
    (room) => room.date == date && room.roomId == roomId && room.start == start
  );
  if (bookingFilter) {
    return res.status(404).json({ message: "Room already booked" });
  }
  let roomIdVerify = rooms.map((room) => (room = room.roomId));
  if (!roomIdVerify.includes(roomId)) {
    return res
      .status(404)
      .json({ message: "Requested room N/A, Kindly check Other rooms" });
  }
  const booking = {
    bookingId: bookings.length + 1,
    customerName,
    date,
    start,
    end,
    roomId,
    status,
  };
  bookings.push(booking);
  res.status(201).json({ message: "Room booked sucessfully" });
});

app.get("/customers", (req, res) => {
  const customerBookings = customers.map((customer) => {
    const { name, bookings } = customer;
    const customerDetails = bookings.map((booking) => {
      const { roomId, bookingDate, startTime, endTime, status } = booking;
      return { name, roomId, bookingDate, startTime, endTime, status };
    });

    return customerDetails;
  });

  res.json(customerBookings);
});

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server started at http://${HOSTNAME}:${PORT}`);
});
