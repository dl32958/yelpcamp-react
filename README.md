# YelpCamp (React)

A Full-Stack MERN application that enables users to manage campground information. Users can create, view, update, and delete campgrounds, as well as add comments and delete their reviews. To access features like creating, editing, or reviewing campgrounds, users must log in or register.

## Project Screen Shots


## Features

* Authentication:
  - User registration
  - User login with email and password
  - Email collision feature
* Authorization:
  - One cannot manage posts without being authenticated
  - One cannot edit or delete posts and comments created by other users
* Manage campground posts with basic functionalities:
  - Create, edit and delete posts and comments
  - Upload campground photos
  - Browse through a list of campgrounds
  - Search existing campgrounds
* Manage user account with basic functionalities
  - Flash messages responding to users' interaction with the app
  - Responsive web design
  - Update campground photos when editing campgrounds
* Separated back-end and front-end architecture

## Technologies

### Front-end:
- React
- BootStrap
- react-hook-form
- react-toastify
- Yup

### Back-end:
- Express.js
- Node.js
- JWT
- bcrypt.js
- MongoDB
- Mongoose
- Joi

## Installation and Setup Instructions

## Behind the Rebuild

After completing the renowned Web Development Bootcamp by Colt Steele and gaining hands-on experience as a SDE intern this past summer, I wanted to apply the new tech stack I had learned to one of my favorite projects—YelpCamp. This gave me a great opportunity to practice my web development skills. And so, YelpCamp React was born.

The most challenging parts for me were implementing authentication and authorization, managing image uploads, and designing efficient data structures. Some aspects required significant time debugging the data transmission between the front-end and back-end to ensure seamless functionality. Additionally, incorporating newly learned technologies also posed challenges, such as using the useContext hook for authentication state management, which I learned through Meta Front-End Developer Professional Certificate on Coursera, and implementing react-toastify to handle flash messages on the front end in response to user actions.

However, this journey of overcoming challenges was incredibly meaningful to me. I experimented with new technologies, implemented Git version control, and set up CI/CD pipelines to streamline the development and deployment process. The independent development process gave me a deeper understanding of full-stack development. It enhanced my ability to tackle complex problems and strengthened my confidence in building robust and scalable web applications.
